/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { apiRouter } from "./routes.js";
import { envConfig, validateEnvironment, getSanitizedConfig } from "./config.js";
import {
  corsMiddleware,
  securityHeadersMiddleware,
  apiGeneralLimiter
} from "./security.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function startServer() {
  const app = express();
  const PORT = envConfig.port;
  const isProduction = envConfig.nodeEnv === "production";
  const envValidation = validateEnvironment();
  if (envValidation.warnings.length > 0) {
    envValidation.warnings.forEach((w) => console.warn(`[CONFIG WARNING] ${w}`));
  }
  if (!envValidation.valid) {
    envValidation.errors.forEach((e) => console.error(`[CONFIG ERROR] ${e}`));
    process.exit(1);
  }
  console.log("[SECURITY] Initialized with config:", JSON.stringify(getSanitizedConfig(), null, 2));
  app.use(securityHeadersMiddleware);
  app.use(corsMiddleware);
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      if (req.path.startsWith("/api")) {
        console.log(`[SmartPick API] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
      }
    });
    next();
  });
  app.use("/api", apiGeneralLimiter);
  app.use("/api", apiRouter);
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "SmartPick AI Advisor Engine",
      version: "1.0.0",
      environment: envConfig.nodeEnv,
      security: {
        jwt_auth: "active",
        jwt_algorithm: "HS256",
        rate_limiting: "active",
        cors_configured: true,
        admin_protection: "active",
        sanitized_headers: true
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.use((err, _req, res, _next) => {
    console.error("Unhandled server error:", err);
    res.status(err.status || 500).json({
      error: "Internal Server Error",
      message: isProduction ? "An unexpected error occurred. Please retry shortly." : err.message || "Server error",
      code: err.code || "INTERNAL_ERROR"
    });
  });
  const frontendDir = [
    path.resolve(__dirname, "../../frontend"),
    path.resolve(process.cwd(), "frontend")
  ].find((p) => fs.existsSync(p)) || path.resolve(__dirname, "../../frontend");
  const frontendViteConfig = [
    path.resolve(frontendDir, "vite.config.js"),
    path.resolve(frontendDir, "vite.config.ts")
  ].find((p) => fs.existsSync(p));
  if (!isProduction) {
    const vite = await createViteServer({
      root: frontendDir,
      configFile: frontendViteConfig,
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(frontendDir, "dist");
    const fallbackDist = path.resolve(process.cwd(), "dist");
    const finalDist = fs.existsSync(distPath) ? distPath : fallbackDist;
    app.use(express.static(finalDist));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(finalDist, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u{1F680} SmartPick Server running at http://0.0.0.0:${PORT} [${envConfig.nodeEnv}]`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start SmartPick server:", err);
  process.exit(1);
});
