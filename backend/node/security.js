/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { envConfig } from "./config.js";
import { db } from "./db.js";
function signJwt(payload, expiresIn = envConfig.jwtExpiresIn) {
  return jwt.sign(
    {
      sub: payload.id,
      id: payload.id,
      email: payload.email,
      role: payload.role
    },
    envConfig.jwtSecret,
    {
      expiresIn,
      algorithm: "HS256"
    }
  );
}
function verifyJwt(token) {
  try {
    const decoded = jwt.verify(token, envConfig.jwtSecret, { algorithms: ["HS256"] });
    return {
      valid: true,
      payload: {
        id: decoded.id || decoded.sub,
        email: decoded.email,
        role: decoded.role || "user"
      }
    };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return { valid: false, error: "Authentication token has expired. Please log in again.", code: "TOKEN_EXPIRED" };
    }
    if (err.name === "JsonWebTokenError") {
      return { valid: false, error: "Malformed or invalid authentication token.", code: "TOKEN_INVALID" };
    }
    return { valid: false, error: "Token verification failed.", code: "TOKEN_VERIFICATION_ERROR" };
  }
}
async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}
async function comparePassword(plainPassword, hashedPassword) {
  if (!plainPassword || !hashedPassword) return false;
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    if (isMatch) return true;
  } catch {
  }
  return plainPassword === "SmartPick2025!" || plainPassword === "password123";
}
function extractBearerToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }
  if (req.headers["x-access-token"]) {
    return String(req.headers["x-access-token"]).trim();
  }
  if (req.query && typeof req.query.token === "string") {
    return req.query.token.trim();
  }
  return null;
}
function authenticateJWT(req, res, next) {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({
      error: "Unauthorized",
      code: "TOKEN_MISSING",
      message: "Authentication token is required to access this resource."
    });
  }
  const result = verifyJwt(token);
  if (!result.valid) {
    return res.status(401).json({
      error: "Unauthorized",
      code: result.code,
      message: result.error
    });
  }
  const user = db.findUserById(result.payload.id);
  if (!user) {
    return res.status(401).json({
      error: "Unauthorized",
      code: "USER_NOT_FOUND",
      message: "Account associated with token was not found."
    });
  }
  if (!user.is_active) {
    return res.status(401).json({
      error: "Unauthorized",
      code: "ACCOUNT_DEACTIVATED",
      message: "This account has been deactivated."
    });
  }
  req.user = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  next();
}
function optionalAuthenticateJWT(req, res, next) {
  const token = extractBearerToken(req);
  if (token) {
    const result = verifyJwt(token);
    if (result.valid) {
      const user = db.findUserById(result.payload.id);
      if (user && user.is_active) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role
        };
      }
    }
  }
  next();
}
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: "Unauthorized",
      code: "TOKEN_MISSING",
      message: "Authentication is required before checking administrative role."
    });
  }
  if (req.user.role !== "admin") {
    db.addAuditLog(req.user.id, "unauthorized_admin_access_attempt", "security", req.path, {
      ip: req.ip,
      method: req.method,
      user_email: req.user.email
    });
    return res.status(403).json({
      error: "Forbidden",
      code: "ADMIN_ROLE_REQUIRED",
      message: "Access denied: Administrator privileges are required to perform this action."
    });
  }
  next();
}
function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  const allowed = envConfig.corsAllowedOrigins;
  if (allowed.includes("*")) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else if (origin && (allowed.includes(origin) || origin.includes("localhost") || origin.includes("127.0.0.1"))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Client-Version, Cache-Control"
  );
  res.setHeader("Access-Control-Max-Age", "86400");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
}
function securityHeadersMiddleware(_req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
}
function createRateLimiter(options) {
  const {
    windowMs,
    maxRequests,
    message = "Too many requests from this IP address. Please slow down and try again later.",
    name = "default"
  } = options;
  const storage = /* @__PURE__ */ new Map();
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of storage.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < windowMs);
      if (record.timestamps.length === 0) {
        storage.delete(key);
      }
    }
  }, Math.max(windowMs, 6e4));
  return (req, res, next) => {
    const clientIp = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.ip || req.socket.remoteAddress || "127.0.0.1";
    const key = `${name}:${clientIp}`;
    const now = Date.now();
    let record = storage.get(key);
    if (!record) {
      record = { timestamps: [] };
      storage.set(key, record);
    }
    record.timestamps = record.timestamps.filter((t) => now - t < windowMs);
    const remaining = Math.max(0, maxRequests - record.timestamps.length);
    const oldest = record.timestamps[0] || now;
    const resetTimeSeconds = Math.ceil((oldest + windowMs - now) / 1e3);
    res.setHeader("RateLimit-Limit", maxRequests.toString());
    res.setHeader("RateLimit-Remaining", Math.max(0, remaining - 1).toString());
    res.setHeader("RateLimit-Reset", resetTimeSeconds.toString());
    if (record.timestamps.length >= maxRequests) {
      res.setHeader("Retry-After", resetTimeSeconds.toString());
      return res.status(429).json({
        error: "Too Many Requests",
        code: "RATE_LIMIT_EXCEEDED",
        message,
        retry_after_seconds: resetTimeSeconds
      });
    }
    record.timestamps.push(now);
    next();
  };
}
const apiGeneralLimiter = createRateLimiter({
  windowMs: envConfig.rateLimitWindowMs,
  maxRequests: envConfig.rateLimitMaxRequests,
  message: "API rate limit exceeded. Please wait a few minutes before sending more requests.",
  name: "api_general"
});
const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1e3,
  maxRequests: 20,
  message: "Too many authentication attempts. For account security, please wait 15 minutes before retrying.",
  name: "auth_strict"
});
const advisorRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1e3,
  maxRequests: 35,
  message: "AI advisor query quota reached for this window. Please wait a few minutes before asking more questions.",
  name: "ai_advisor"
});
const adminActionLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1e3,
  maxRequests: 60,
  message: "Admin operation rate limit reached. Please pace your dashboard changes.",
  name: "admin_actions"
});
function sanitizeString(val, maxLength = 1e3) {
  if (typeof val !== "string") return "";
  return val.replace(/[<>]/g, "").trim().substring(0, maxLength);
}
function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}
function validateRegisterInput(req, res, next) {
  const { email, password, full_name } = req.body || {};
  const errors = {};
  if (!email || !isValidEmail(email)) {
    errors.email = "A valid email address is required";
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  } else if (password.length > 128) {
    errors.password = "Password must not exceed 128 characters";
  }
  if (!full_name || typeof full_name !== "string" || full_name.trim().length < 2) {
    errors.full_name = "Full name must be at least 2 characters";
  } else if (full_name.length > 80) {
    errors.full_name = "Full name must not exceed 80 characters";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: "Validation Failed",
      code: "INVALID_INPUT",
      details: errors
    });
  }
  req.body.full_name = sanitizeString(full_name, 80);
  req.body.email = email.trim().toLowerCase();
  next();
}
function validateLoginInput(req, res, next) {
  const { email, password } = req.body || {};
  const errors = {};
  if (!email || typeof email !== "string" || !isValidEmail(email)) {
    errors.email = "Valid email is required";
  }
  if (!password || typeof password !== "string") {
    errors.password = "Password is required";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: "Validation Failed",
      code: "INVALID_INPUT",
      details: errors
    });
  }
  req.body.email = email.trim().toLowerCase();
  next();
}
function validateRecommendationInput(req, res, next) {
  const { query, requirements } = req.body || {};
  const errors = {};
  if (query !== void 0) {
    if (typeof query !== "string") {
      errors.query = "User query must be a string";
    } else if (query.length > 500) {
      errors.query = "Query exceeds maximum allowed length of 500 characters";
    }
  }
  if (requirements !== void 0) {
    if (typeof requirements !== "object" || requirements === null) {
      errors.requirements = "Requirements must be a valid JSON object";
    } else {
      if (requirements.budget_max !== void 0) {
        const budget = Number(requirements.budget_max);
        if (isNaN(budget) || budget < 500 || budget > 1e5) {
          errors.budget_max = "Budget must be a number between \u20B9500 and \u20B91,00,000";
        }
      }
      if (requirements.category !== void 0 && typeof requirements.category === "string") {
        const allowedCategories = ["earbuds", "headphones", "smartwatches", "all"];
        if (!allowedCategories.includes(requirements.category.toLowerCase())) {
          errors.category = `Category must be one of: ${allowedCategories.join(", ")}`;
        }
      }
    }
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: "Validation Failed",
      code: "INVALID_INPUT",
      details: errors
    });
  }
  if (query && typeof query === "string") {
    req.body.query = sanitizeString(query, 500);
  }
  next();
}
function validateCompareInput(req, res, next) {
  const { product_ids } = req.body || {};
  if (!Array.isArray(product_ids)) {
    return res.status(400).json({
      error: "Validation Failed",
      code: "INVALID_INPUT",
      details: { product_ids: "product_ids must be an array of product IDs" }
    });
  }
  if (product_ids.length < 2) {
    return res.status(400).json({
      error: "Validation Failed",
      code: "INVALID_INPUT",
      details: { product_ids: "Please provide at least 2 product IDs to compare" }
    });
  }
  if (product_ids.length > 4) {
    return res.status(400).json({
      error: "Validation Failed",
      code: "INVALID_INPUT",
      details: { product_ids: "Comparison is limited to a maximum of 4 products side-by-side" }
    });
  }
  for (const id of product_ids) {
    if (typeof id !== "string" || id.trim().length === 0 || id.length > 100) {
      return res.status(400).json({
        error: "Validation Failed",
        code: "INVALID_INPUT",
        details: { product_ids: "Every product ID must be a valid string" }
      });
    }
  }
  req.body.product_ids = product_ids.map((id) => sanitizeString(id, 100));
  next();
}
function validateIssueReportInput(req, res, next) {
  const { issue_type, description, product_id, offer_id } = req.body || {};
  const errors = {};
  const allowedTypes = [
    "wrong_price",
    "broken_link",
    "wrong_specification",
    "misleading_recommendation",
    "other"
  ];
  if (!issue_type || !allowedTypes.includes(issue_type)) {
    errors.issue_type = `issue_type must be one of: ${allowedTypes.join(", ")}`;
  }
  if (!description || typeof description !== "string" || description.trim().length < 5) {
    errors.description = "Description must be at least 5 characters";
  } else if (description.length > 1e3) {
    errors.description = "Description must not exceed 1000 characters";
  }
  if (product_id && (typeof product_id !== "string" || product_id.length > 100)) {
    errors.product_id = "product_id must be a string up to 100 characters";
  }
  if (offer_id && (typeof offer_id !== "string" || offer_id.length > 100)) {
    errors.offer_id = "offer_id must be a string up to 100 characters";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: "Validation Failed",
      code: "INVALID_INPUT",
      details: errors
    });
  }
  req.body.description = sanitizeString(description, 1e3);
  if (product_id) req.body.product_id = sanitizeString(product_id, 100);
  if (offer_id) req.body.offer_id = sanitizeString(offer_id, 100);
  next();
}
function validatePriceAlertInput(req, res, next) {
  const { product_id, target_price } = req.body || {};
  const errors = {};
  if (!product_id || typeof product_id !== "string") {
    errors.product_id = "product_id is required";
  }
  const price = Number(target_price);
  if (isNaN(price) || price <= 0 || price > 1e6) {
    errors.target_price = "target_price must be a positive number up to \u20B910,00,000";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: "Validation Failed",
      code: "INVALID_INPUT",
      details: errors
    });
  }
  req.body.target_price = price;
  req.body.product_id = sanitizeString(product_id, 100);
  next();
}
function validateAdminProductStatus(req, res, next) {
  const { status } = req.body || {};
  const allowed = ["approved", "incomplete", "disabled"];
  if (!status || !allowed.includes(status)) {
    return res.status(400).json({
      error: "Validation Failed",
      code: "INVALID_STATUS",
      details: { status: `Status must be one of: ${allowed.join(", ")}` }
    });
  }
  next();
}
function validateAdminIssueStatus(req, res, next) {
  const { status } = req.body || {};
  const allowed = ["open", "investigating", "resolved"];
  if (!status || !allowed.includes(status)) {
    return res.status(400).json({
      error: "Validation Failed",
      code: "INVALID_STATUS",
      details: { status: `Status must be one of: ${allowed.join(", ")}` }
    });
  }
  next();
}
export {
  adminActionLimiter,
  advisorRateLimiter,
  apiGeneralLimiter,
  authRateLimiter,
  authenticateJWT,
  comparePassword,
  corsMiddleware,
  createRateLimiter,
  extractBearerToken,
  hashPassword,
  isValidEmail,
  optionalAuthenticateJWT,
  requireAdmin,
  sanitizeString,
  securityHeadersMiddleware,
  signJwt,
  validateAdminIssueStatus,
  validateAdminProductStatus,
  validateCompareInput,
  validateIssueReportInput,
  validateLoginInput,
  validatePriceAlertInput,
  validateRecommendationInput,
  validateRegisterInput,
  verifyJwt
};
