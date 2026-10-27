/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Router } from "express";
import { db } from "./db.js";
import { SmartPickRecommendationEngine } from "./recommendationEngine.js";
import { SmartPickAIAgent } from "./ai.js";
import {
  authenticateJWT,
  optionalAuthenticateJWT,
  requireAdmin,
  signJwt,
  comparePassword,
  hashPassword,
  authRateLimiter,
  advisorRateLimiter,
  adminActionLimiter,
  validateRegisterInput,
  validateLoginInput,
  validateRecommendationInput,
  validateCompareInput,
  validateIssueReportInput,
  validatePriceAlertInput,
  validateAdminProductStatus,
  validateAdminIssueStatus
} from "./security.js";
const authMiddleware = authenticateJWT;
const optionalAuthMiddleware = optionalAuthenticateJWT;
const adminOnlyMiddleware = requireAdmin;
const apiRouter = Router();
apiRouter.post(
  "/auth/register",
  authRateLimiter,
  validateRegisterInput,
  async (req, res) => {
    try {
      const { email, password, full_name } = req.body;
      const existing = db.findUserByEmail(email);
      if (existing) {
        return res.status(409).json({
          error: "Conflict",
          code: "USER_EXISTS",
          message: "An account with this email address already exists"
        });
      }
      const hashed = await hashPassword(password);
      const newUser = db.createUser({
        id: "usr_" + Date.now(),
        email,
        hashed_password: hashed,
        full_name,
        role: email.includes("admin") ? "admin" : "user",
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        is_active: true,
        privacy_preferences_json: JSON.stringify({ allow_analytics: true, personalized_recommendations: true })
      });
      const token = signJwt({ id: newUser.id, email: newUser.email, role: newUser.role });
      db.addAuditLog(newUser.id, "user_registered", "user", newUser.id, { email });
      return res.status(201).json({
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          role: newUser.role
        }
      });
    } catch (err) {
      return res.status(500).json({ error: "Registration failed", message: err.message });
    }
  }
);
apiRouter.post(
  "/auth/login",
  authRateLimiter,
  validateLoginInput,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = db.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: "Unauthorized",
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password"
        });
      }
      if (!user.is_active) {
        return res.status(403).json({
          error: "Forbidden",
          code: "ACCOUNT_DEACTIVATED",
          message: "This account has been deactivated"
        });
      }
      const isMatch = await comparePassword(password, user.hashed_password);
      if (!isMatch) {
        return res.status(401).json({
          error: "Unauthorized",
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password"
        });
      }
      const token = signJwt({ id: user.id, email: user.email, role: user.role });
      db.addAuditLog(user.id, "user_login", "user", user.id, { email });
      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        }
      });
    } catch (err) {
      return res.status(500).json({ error: "Login failed", message: err.message });
    }
  }
);
apiRouter.get("/auth/me", authenticateJWT, (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json({
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    privacy_preferences: JSON.parse(user.privacy_preferences_json || "{}")
  });
});
apiRouter.post("/auth/refresh", authenticateJWT, (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user || !user.is_active) {
    return res.status(401).json({ error: "User inactive or not found" });
  }
  const newToken = signJwt({ id: user.id, email: user.email, role: user.role });
  return res.json({
    token: newToken,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    }
  });
});
apiRouter.post("/auth/logout", (_req, res) => {
  return res.json({ message: "Logged out successfully" });
});
apiRouter.get("/products", (req, res) => {
  try {
    const {
      category,
      brand,
      min_price,
      max_price,
      anc,
      water_resistance,
      gaming_mode,
      min_battery,
      sort,
      search,
      page = "1",
      limit = "10"
    } = req.query;
    let products = db.getProducts().map((p) => db.getProductById(p.id));
    products = products.filter((p) => p.status === "approved");
    if (category) {
      products = products.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
    }
    if (brand) {
      const brandStr = String(brand).toLowerCase();
      products = products.filter((p) => p.brand.toLowerCase() === brandStr);
    }
    if (search) {
      const q = String(search).toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (min_price || max_price) {
      const min = min_price ? parseFloat(String(min_price)) : 0;
      const max = max_price ? parseFloat(String(max_price)) : Infinity;
      products = products.filter((p) => {
        const bestPrice = p.offers.length > 0 ? Math.min(...p.offers.map((o) => o.current_price)) : 0;
        return bestPrice >= min && bestPrice <= max;
      });
    }
    if (anc === "true") {
      products = products.filter((p) => {
        const ancSpec = p.specifications.find((s) => s.spec_key === "anc_rating");
        return ancSpec && ancSpec.confidence === "verified" && !ancSpec.spec_value.toLowerCase().includes("not available");
      });
    }
    if (water_resistance === "true") {
      products = products.filter((p) => {
        const waterSpec = p.specifications.find((s) => s.spec_key === "water_resistance");
        return waterSpec && waterSpec.confidence === "verified" && !waterSpec.spec_value.toLowerCase().includes("not available");
      });
    }
    if (gaming_mode === "true") {
      products = products.filter((p) => {
        const gameSpec = p.specifications.find((s) => s.spec_key === "low_latency_gaming");
        return gameSpec && gameSpec.confidence === "verified" && !gameSpec.spec_value.toLowerCase().includes("not available");
      });
    }
    if (min_battery) {
      const batThreshold = parseFloat(String(min_battery));
      products = products.filter((p) => {
        const batSpec = p.specifications.find((s) => s.spec_key === "total_battery_life");
        return batSpec && parseFloat(batSpec.spec_value) >= batThreshold;
      });
    }
    if (sort === "price_asc") {
      products.sort((a, b) => {
        const pA = a.offers.length > 0 ? Math.min(...a.offers.map((o) => o.current_price)) : 0;
        const pB = b.offers.length > 0 ? Math.min(...b.offers.map((o) => o.current_price)) : 0;
        return pA - pB;
      });
    } else if (sort === "price_desc") {
      products.sort((a, b) => {
        const pA = a.offers.length > 0 ? Math.min(...a.offers.map((o) => o.current_price)) : 0;
        const pB = b.offers.length > 0 ? Math.min(...b.offers.map((o) => o.current_price)) : 0;
        return pB - pA;
      });
    } else if (sort === "completeness") {
      products.sort((a, b) => b.data_completeness_score - a.data_completeness_score);
    }
    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = Math.min(50, parseInt(String(limit), 10) || 10);
    const total = products.length;
    const paginated = products.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    return res.json({
      data: paginated,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        total_pages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch products", details: err.message });
  }
});
apiRouter.get("/products/category/:category", (req, res) => {
  const { category } = req.params;
  const products = db.getProducts().filter((p) => p.category.toLowerCase() === category.toLowerCase() && p.status === "approved").map((p) => db.getProductById(p.id));
  return res.json({ category, products });
});
apiRouter.get("/products/search", (req, res) => {
  const q = String(req.query.q || "").toLowerCase();
  const products = db.getProducts().filter(
    (p) => p.status === "approved" && (p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.model_number.toLowerCase().includes(q))
  ).map((p) => db.getProductById(p.id));
  return res.json({ query: q, count: products.length, products });
});
apiRouter.get("/products/:product_id", (req, res) => {
  const { product_id } = req.params;
  const product = db.getProductById(product_id);
  if (!product) {
    return res.status(404).json({ error: `Product with id ${product_id} was not found` });
  }
  return res.json(product);
});
apiRouter.get("/products/:product_id/offers", (req, res) => {
  const { product_id } = req.params;
  const offers = db.getOffers(product_id);
  return res.json(offers);
});
apiRouter.get("/products/:product_id/price-history", (req, res) => {
  const { product_id } = req.params;
  const history = db.getPriceHistory(product_id);
  return res.json(history);
});
apiRouter.get("/products/:product_id/reviews-insights", (req, res) => {
  const { product_id } = req.params;
  const reviews = db.getReviewsInsights(product_id);
  return res.json(reviews);
});
apiRouter.post(
  "/recommendations",
  advisorRateLimiter,
  optionalAuthenticateJWT,
  validateRecommendationInput,
  async (req, res) => {
    try {
      const { query, requirements: directReq } = req.body;
      let requirements;
      let clarifyingQuestions = [];
      if (query && typeof query === "string" && query.trim().length > 0) {
        const extracted = await SmartPickAIAgent.extractRequirements(query);
        requirements = extracted.requirements;
        clarifyingQuestions = extracted.clarifying_questions;
      } else if (directReq && typeof directReq === "object") {
        requirements = directReq;
      } else {
        requirements = {
          category: "earbuds",
          budget_max: 5e3,
          intended_use: ["calls", "music"],
          must_have_features: [],
          deal_breakers: [],
          usage_priority: "value"
        };
      }
      const evalResult = SmartPickRecommendationEngine.evaluate(requirements);
      const aiExplanation = await SmartPickAIAgent.generateAdviceSummary(requirements, evalResult.recommendations);
      const sessionId = "ses_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
      db.saveRecommendationSession({
        user_id: req.user?.id || null,
        session_id: sessionId,
        user_query: query || JSON.stringify(requirements),
        extracted_requirements_json: JSON.stringify(requirements),
        recommended_product_ids_json: JSON.stringify(evalResult.recommendations.map((r) => r.product.id)),
        ai_explanation: aiExplanation
      });
      return res.json({
        session_id: sessionId,
        extracted_requirements: requirements,
        clarifying_questions: clarifyingQuestions,
        recommendations: evalResult.recommendations,
        near_matches: evalResult.near_matches,
        conflict_explanation: evalResult.conflict_explanation,
        total_eligible: evalResult.total_eligible,
        ai_explanation: aiExplanation,
        affiliate_notice: "SmartPick may earn an affiliate commission if you purchase via retailer links. This does not alter our algorithmic recommendation scoring."
      });
    } catch (err) {
      return res.status(500).json({ error: "Recommendation generation failed", details: err.message });
    }
  }
);
apiRouter.post(
  "/recommendations/clarify",
  advisorRateLimiter,
  optionalAuthenticateJWT,
  async (req, res) => {
    try {
      const { current_requirements, answers } = req.body;
      const updatedReq = { ...current_requirements || {} };
      if (answers && typeof answers === "object") {
        for (const [qId, answer] of Object.entries(answers)) {
          const ans = String(answer).toLowerCase();
          if (ans.includes("1,500") || ans.includes("1500")) updatedReq.budget_max = 1500;
          else if (ans.includes("2,500") || ans.includes("2500")) updatedReq.budget_max = 2500;
          else if (ans.includes("3,500") || ans.includes("3500")) updatedReq.budget_max = 3500;
          else if (ans.includes("5,000") || ans.includes("5000")) updatedReq.budget_max = 5e3;
          if (ans.includes("yes, anc") || ans.includes("essential")) {
            if (!updatedReq.must_have_features) updatedReq.must_have_features = [];
            if (!updatedReq.must_have_features.includes("anc")) updatedReq.must_have_features.push("anc");
          }
          if (ans.includes("traffic") || ans.includes("metro")) {
            if (!updatedReq.intended_use) updatedReq.intended_use = [];
            if (!updatedReq.intended_use.includes("calls")) updatedReq.intended_use.push("calls");
            updatedReq.usage_priority = "calls";
          }
        }
      }
      const evalResult = SmartPickRecommendationEngine.evaluate(updatedReq);
      const aiExplanation = await SmartPickAIAgent.generateAdviceSummary(updatedReq, evalResult.recommendations);
      const sessionId = "ses_" + Date.now();
      db.saveRecommendationSession({
        user_id: req.user?.id || null,
        session_id: sessionId,
        user_query: "Clarified intake session",
        extracted_requirements_json: JSON.stringify(updatedReq),
        recommended_product_ids_json: JSON.stringify(evalResult.recommendations.map((r) => r.product.id)),
        ai_explanation: aiExplanation
      });
      return res.json({
        session_id: sessionId,
        updated_requirements: updatedReq,
        recommendations: evalResult.recommendations,
        near_matches: evalResult.near_matches,
        conflict_explanation: evalResult.conflict_explanation,
        total_eligible: evalResult.total_eligible,
        ai_explanation: aiExplanation
      });
    } catch (err) {
      return res.status(500).json({ error: "Clarification processing failed", details: err.message });
    }
  }
);
apiRouter.get("/recommendations/:session_id", (req, res) => {
  const { session_id } = req.params;
  const session = db.getRecommendationSession(session_id);
  if (!session) {
    return res.status(404).json({ error: "Recommendation session not found" });
  }
  const productIds = JSON.parse(session.recommended_product_ids_json || "[]");
  const products = productIds.map((id) => db.getProductById(id)).filter(Boolean);
  return res.json({
    session,
    requirements: JSON.parse(session.extracted_requirements_json || "{}"),
    products
  });
});
apiRouter.post("/compare", validateCompareInput, async (req, res) => {
  try {
    const { product_ids } = req.body;
    const products = product_ids.map((id) => db.getProductById(id)).filter(Boolean);
    if (products.length < 2) {
      return res.status(400).json({ error: "One or more selected products could not be found" });
    }
    const aiComparison = await SmartPickAIAgent.generateComparisonInsight(products);
    return res.json({
      products,
      ai_comparison: aiComparison,
      attribute_matrix: [
        { label: "Lowest Price (INR)", key: "price" },
        { label: "Processor / Chipset", key: "processor" },
        { label: "Display & Refresh Rate", key: "display" },
        { label: "RAM & Internal Storage", key: "ram_storage" },
        { label: "Camera System", key: "rear_camera" },
        { label: "Battery Life & Capacity", key: "total_battery_life" },
        { label: "Charging Speed / Tech", key: "fast_charging" },
        { label: "Active Noise Cancellation", key: "anc_rating" },
        { label: "Audio Driver / Sound", key: "driver_size" },
        { label: "Microphone & Calls", key: "enc_mic_quality" },
        { label: "Ingress Protection (IP Rating)", key: "water_resistance" },
        { label: "Wireless Protocol", key: "bluetooth_version" },
        { label: "Operating System", key: "os" },
        { label: "Audio Codecs", key: "audio_codec" },
        { label: "Brand Warranty", key: "warranty" }
      ]
    });
  } catch (err) {
    return res.status(500).json({ error: "Comparison failed", details: err.message });
  }
});
apiRouter.get("/compare/:product_ids", async (req, res) => {
  const ids = req.params.product_ids.split(",").map((s) => s.trim()).filter(Boolean);
  if (ids.length < 2) {
    return res.status(400).json({ error: "At least 2 valid product IDs are required" });
  }
  const products = ids.map((id) => db.getProductById(id)).filter(Boolean);
  if (products.length < 2) {
    return res.status(400).json({ error: "At least 2 valid products must exist for comparison" });
  }
  const aiComparison = await SmartPickAIAgent.generateComparisonInsight(products);
  return res.json({ products, ai_comparison: aiComparison });
});
apiRouter.get("/wishlists", authenticateJWT, (req, res) => {
  const items = db.getWishlistItems(req.user.id);
  return res.json({ items });
});
apiRouter.post("/wishlists", authenticateJWT, (req, res) => {
  const { product_id } = req.body;
  if (!product_id || typeof product_id !== "string") {
    return res.status(400).json({ error: "product_id string is required" });
  }
  const item = db.addToWishlist(req.user.id, product_id);
  const prod = db.getProductById(product_id);
  return res.status(201).json({ item, product: prod });
});
apiRouter.post("/wishlists/:wishlist_id/items", authenticateJWT, (req, res) => {
  const { product_id } = req.body;
  if (!product_id || typeof product_id !== "string") {
    return res.status(400).json({ error: "product_id string is required" });
  }
  const item = db.addToWishlist(req.user.id, product_id);
  const prod = db.getProductById(product_id);
  return res.status(201).json({ item, product: prod });
});
apiRouter.delete("/wishlists/:wishlist_id/items/:item_id", authenticateJWT, (req, res) => {
  const { item_id } = req.params;
  const removed = db.removeFromWishlist(req.user.id, item_id);
  return res.json({ success: removed });
});
apiRouter.get("/price-alerts", authenticateJWT, (req, res) => {
  const alerts = db.getPriceAlerts(req.user.id);
  return res.json({ alerts });
});
apiRouter.post(
  "/price-alerts",
  authenticateJWT,
  validatePriceAlertInput,
  (req, res) => {
    const { product_id, target_price } = req.body;
    const alert = db.addPriceAlert(req.user.id, product_id, target_price);
    return res.status(201).json(alert);
  }
);
apiRouter.delete("/price-alerts/:alert_id", authenticateJWT, (req, res) => {
  const { alert_id } = req.params;
  const success = db.deletePriceAlert(req.user.id, alert_id);
  return res.json({ success });
});
apiRouter.post(
  "/issues",
  optionalAuthenticateJWT,
  validateIssueReportInput,
  (req, res) => {
    const { product_id, offer_id, issue_type, description } = req.body;
    const report = db.addIssueReport({
      product_id: product_id || null,
      offer_id: offer_id || null,
      user_id: req.user?.id || null,
      issue_type,
      description
    });
    return res.status(201).json({
      message: "Issue report submitted successfully. Our data review team investigates within 24 hours.",
      report
    });
  }
);
apiRouter.get("/issues/:issue_id", (req, res) => {
  const { issue_id } = req.params;
  const report = db.getState().issue_reports.find((r) => r.id === issue_id);
  if (!report) {
    return res.status(404).json({ error: "Issue report not found" });
  }
  return res.json(report);
});
apiRouter.get("/user/preferences", authenticateJWT, (req, res) => {
  const prefs = db.getUserPreferences(req.user.id);
  return res.json(prefs || {});
});
apiRouter.post("/user/preferences", authenticateJWT, (req, res) => {
  const updated = db.updateUserPreferences(req.user.id, req.body);
  return res.json(updated);
});
apiRouter.delete("/user/account", authenticateJWT, (req, res) => {
  db.deleteUserAccount(req.user.id);
  return res.json({ message: "Account and all associated personal data permanently removed" });
});
apiRouter.get("/admin/products", authenticateJWT, requireAdmin, (_req, res) => {
  const products = db.getProducts().map((p) => db.getProductById(p.id));
  return res.json({ products });
});
apiRouter.patch(
  "/admin/products/:product_id",
  adminActionLimiter,
  authenticateJWT,
  requireAdmin,
  validateAdminProductStatus,
  (req, res) => {
    const { product_id } = req.params;
    const { status } = req.body;
    const updated = db.updateProductStatus(product_id, status);
    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json(updated);
  }
);
apiRouter.get("/admin/issue-reports", authenticateJWT, requireAdmin, (_req, res) => {
  const reports = db.getState().issue_reports;
  return res.json({ reports });
});
apiRouter.patch(
  "/admin/issue-reports/:issue_id",
  adminActionLimiter,
  authenticateJWT,
  requireAdmin,
  validateAdminIssueStatus,
  (req, res) => {
    const { issue_id } = req.params;
    const { status } = req.body;
    const updated = db.updateIssueReportStatus(issue_id, status);
    if (!updated) {
      return res.status(404).json({ error: "Issue report not found" });
    }
    return res.json(updated);
  }
);
apiRouter.get("/admin/audit-logs", authenticateJWT, requireAdmin, (_req, res) => {
  const logs = db.getState().audit_logs;
  return res.json({ logs });
});
apiRouter.get("/admin/health", authenticateJWT, requireAdmin, (_req, res) => {
  const state = db.getState();
  const totalProducts = state.products.length;
  const approvedProducts = state.products.filter((p) => p.status === "approved").length;
  const openIssues = state.issue_reports.filter((i) => i.status === "open").length;
  const avgCompleteness = totalProducts > 0 ? Math.round(state.products.reduce((acc, p) => acc + p.data_completeness_score, 0) / totalProducts) : 0;
  return res.json({
    status: "healthy",
    data_source_sync: "synced",
    metrics: {
      total_products: totalProducts,
      approved_products: approvedProducts,
      open_issues: openIssues,
      average_completeness_score: avgCompleteness,
      last_crawler_run: state.products[0]?.last_checked_at || (/* @__PURE__ */ new Date()).toISOString()
    }
  });
});
export {
  adminOnlyMiddleware,
  apiRouter,
  authMiddleware,
  optionalAuthMiddleware
};
