/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import crypto from "crypto";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = [
  path.resolve(__dirname, ".env"),
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../.env")
].find((p) => fs.existsSync(p));
dotenv.config(envPath ? { path: envPath } : void 0);
function resolveJwtSecret(nodeEnv) {
  const envSecret = process.env.JWT_SECRET?.trim();
  if (envSecret && envSecret.length >= 16) {
    return envSecret;
  }
  if (nodeEnv === "production") {
    if (!envSecret) {
      console.error("[SECURITY CRITICAL] JWT_SECRET is not defined in production environment!");
      return crypto.randomBytes(32).toString("hex");
    }
    if (envSecret.length < 16) {
      console.warn("[SECURITY WARNING] JWT_SECRET is too short (<16 chars). Consider using a stronger secret.");
    }
  }
  return envSecret || "smartpick_development_jwt_secret_key_2025_ind";
}
function resolveCorsOrigins() {
  const raw = process.env.CORS_ALLOWED_ORIGINS || process.env.APP_URL;
  if (!raw) {
    return ["*"];
  }
  return raw.split(",").map((o) => o.trim()).filter(Boolean);
}
const envConfig = {
  port: Number(process.env.PORT) || 3e3,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: resolveJwtSecret(process.env.NODE_ENV || "development"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  geminiApiKey: process.env.GEMINI_API_KEY?.trim() || void 0,
  corsAllowedOrigins: resolveCorsOrigins(),
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1e3,
  // 15 mins
  rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 150
};
function getSanitizedConfig() {
  const mask = (val) => {
    if (!val) return "NOT_SET";
    if (val.length <= 8) return "******";
    return `${val.substring(0, 4)}...${val.substring(val.length - 4)}`;
  };
  return {
    PORT: envConfig.port,
    NODE_ENV: envConfig.nodeEnv,
    JWT_SECRET_CONFIGURED: Boolean(envConfig.jwtSecret),
    JWT_SECRET_PREVIEW: mask(envConfig.jwtSecret),
    JWT_EXPIRES_IN: envConfig.jwtExpiresIn,
    GEMINI_API_KEY_CONFIGURED: Boolean(envConfig.geminiApiKey),
    GEMINI_API_KEY_PREVIEW: mask(envConfig.geminiApiKey),
    CORS_ALLOWED_ORIGINS: envConfig.corsAllowedOrigins,
    RATE_LIMIT_WINDOW_MS: envConfig.rateLimitWindowMs,
    RATE_LIMIT_MAX_REQUESTS: envConfig.rateLimitMaxRequests
  };
}
function validateEnvironment() {
  const warnings = [];
  const errors = [];
  if (!envConfig.geminiApiKey) {
    warnings.push("GEMINI_API_KEY is not defined. SmartPick AI Advisor will run in grounded deterministic mode.");
  }
  if (envConfig.nodeEnv === "production" && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16)) {
    warnings.push("JWT_SECRET is either missing or too short in production. A secure random token has been provisioned.");
  }
  return {
    valid: errors.length === 0,
    warnings,
    errors
  };
}
export {
  envConfig,
  getSanitizedConfig,
  validateEnvironment
};
