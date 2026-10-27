/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { db } from "./db.js";
class SmartPickRecommendationEngine {
  static evaluate(requirements) {
    const allProducts = db.getProducts().map((p) => db.getProductById(p.id));
    const category = (requirements.category || "all").toLowerCase();
    const budgetMax = requirements.budget_max && requirements.budget_max > 0 ? requirements.budget_max : 15e4;
    const budgetMin = requirements.budget_min || 0;
    const intendedUses = (requirements.intended_use || []).map((u) => u.toLowerCase());
    const mustHaves = (requirements.must_have_features || []).map((m) => m.toLowerCase());
    const dealBreakers = (requirements.deal_breakers || []).map((d) => d.toLowerCase());
    const preferredBrands = (requirements.preferred_brands || []).map((b) => b.toLowerCase());
    const priority = requirements.usage_priority || "value";
    const eligibleProducts = [];
    const disqualifiedReasons = /* @__PURE__ */ new Map();
    for (const prod of allProducts) {
      const reasons = [];
      if (prod.status !== "approved") {
        reasons.push("Product status is not approved");
      }
      if (category !== "all" && category !== "" && prod.category.toLowerCase() !== category) {
        if (!(category === "audio" && prod.category === "earbuds" || category === "earbuds" && prod.category === "audio")) {
          reasons.push(`Category ${prod.category} does not match requested ${category}`);
        }
      }
      const bestOffer = prod.offers && prod.offers.length > 0 ? Math.min(...prod.offers.map((o) => o.current_price)) : 999999;
      if (bestOffer > budgetMax) {
        reasons.push(`Lowest available price \u20B9${bestOffer.toLocaleString("en-IN")} exceeds budget ceiling \u20B9${budgetMax.toLocaleString("en-IN")}`);
      }
      if (budgetMin > 0 && bestOffer < budgetMin) {
        reasons.push(`Lowest price \u20B9${bestOffer.toLocaleString("en-IN")} is below minimum budget \u20B9${budgetMin.toLocaleString("en-IN")}`);
      }
      const cat = prod.category.toLowerCase();
      let hasEssential = true;
      if (cat === "earbuds") {
        const earbudKeys = ["driver_size", "total_battery_life"];
        hasEssential = earbudKeys.every(
          (k) => prod.specifications.some((s) => s.spec_key === k && s.confidence !== "missing")
        );
      } else if (cat === "smartphones") {
        const phoneKeys = ["processor", "display"];
        hasEssential = phoneKeys.every(
          (k) => prod.specifications.some((s) => s.spec_key === k && s.confidence !== "missing")
        );
      } else if (cat === "laptops") {
        const laptopKeys = ["processor", "display"];
        hasEssential = laptopKeys.every(
          (k) => prod.specifications.some((s) => s.spec_key === k && s.confidence !== "missing")
        );
      }
      if (!hasEssential) {
        reasons.push("Missing essential verified laboratory specifications");
      }
      for (const must of mustHaves) {
        if (must.includes("anc") || must.includes("noise cancel")) {
          const ancSpec = prod.specifications.find((s) => s.spec_key === "anc_rating");
          if (!ancSpec || ancSpec.confidence === "missing" || ancSpec.spec_value.toLowerCase().includes("not available")) {
            reasons.push("Lacks certified Active Noise Cancellation (ANC)");
          }
        }
        if (must.includes("water") || must.includes("gym") || must.includes("sweat")) {
          const waterSpec = prod.specifications.find((s) => s.spec_key === "water_resistance");
          if (!waterSpec || waterSpec.confidence === "missing" || waterSpec.spec_value.toLowerCase().includes("not available")) {
            reasons.push("Lacks certified water/sweat ingress protection");
          }
        }
        if (must.includes("oled") || must.includes("amoled")) {
          const dispSpec = prod.specifications.find((s) => s.spec_key === "display");
          if (!dispSpec || !dispSpec.spec_value.toLowerCase().includes("oled")) {
            reasons.push("Lacks OLED display panel");
          }
        }
      }
      if (reasons.length === 0) {
        eligibleProducts.push(prod);
      } else {
        disqualifiedReasons.set(prod.id, reasons);
      }
    }
    const scoreProduct = (prod, isNearMatch = false) => {
      let useFitScore = 20;
      let valueScore = 15;
      let specScore = Math.round(prod.data_completeness_score / 100 * 15);
      let evidenceScore = prod.data_source?.includes("BIS") ? 10 : 8;
      let priorityScore = 7;
      let reviewScore = prod.reviews_insights?.[0]?.confidence === "high" ? 5 : 3;
      const bestPrice = prod.offers && prod.offers.length > 0 ? Math.min(...prod.offers.map((o) => o.current_price)) : budgetMax;
      const headroomRatio = (budgetMax - bestPrice) / budgetMax;
      if (headroomRatio >= 0.25) valueScore = 24;
      else if (headroomRatio >= 0.1) valueScore = 20;
      else valueScore = 16;
      if (preferredBrands.some((b) => prod.brand.toLowerCase().includes(b))) {
        priorityScore += 3;
      }
      if (priority === "camera" && prod.specifications.some((s) => s.spec_key.includes("camera"))) {
        priorityScore = 10;
        useFitScore += 8;
      } else if (priority === "battery" && prod.specifications.some((s) => s.spec_key.includes("battery"))) {
        priorityScore = 10;
        useFitScore += 7;
      } else if (priority === "performance" && prod.specifications.some((s) => s.spec_key === "processor")) {
        priorityScore = 10;
        useFitScore += 8;
      } else if (priority === "sound" && (prod.category === "audio" || prod.category === "earbuds")) {
        priorityScore = 10;
        useFitScore += 8;
      }
      useFitScore = Math.min(35, useFitScore);
      priorityScore = Math.min(10, priorityScore);
      const totalScore = Math.min(100, Math.max(50, useFitScore + valueScore + specScore + evidenceScore + priorityScore + reviewScore));
      const pros = (prod.pros_cons || []).filter((pc) => pc.type === "pro").map((pc) => pc.text);
      const cons = (prod.pros_cons || []).filter((pc) => pc.type === "con").map((pc) => pc.text);
      const whyFit = pros.length > 0 ? `Directly matches your requirements: ${pros.slice(0, 2).join(" and ")}.` : `Verified laboratory benchmarks confirm reliable build quality and spec fidelity for your budget tier.`;
      const tradeOff = cons.length > 0 ? `Audited technical compromise: ${cons[0]}` : `Standard manufacturer trade-offs apply.`;
      return {
        product: prod,
        match_score: totalScore,
        score_breakdown: {
          use_fit: useFitScore,
          value_for_money: valueScore,
          spec_completeness: specScore,
          evidence_quality: evidenceScore,
          priority_match: priorityScore,
          review_confidence: reviewScore
        },
        why_it_fits: whyFit,
        trade_offs: tradeOff,
        pros,
        cons,
        evidence_quality: evidenceScore >= 9 ? "High" : "Medium",
        last_checked_at: prod.last_checked_at,
        retailer_offers: prod.offers || [],
        affiliate_disclosure: "SmartPick may earn an affiliate commission on qualifying purchases.",
        is_near_match: isNearMatch
      };
    };
    const scoredEligible = eligibleProducts.map((p) => scoreProduct(p, false)).sort((a, b) => b.match_score - a.match_score);
    const recommendations = scoredEligible.slice(0, 5);
    let conflictExplanation = null;
    let nearMatches = [];
    if (recommendations.length === 0) {
      conflictExplanation = `Your constraints (Budget ceiling: \u20B9${budgetMax.toLocaleString("en-IN")}${category !== "all" ? ` in category "${category}"` : ""}${mustHaves.length > 0 ? ` with ${mustHaves.join(", ")}` : ""}) left 0 exact matches.`;
      const nearest = allProducts.filter((p) => p.status === "approved").filter((p) => category === "all" || p.category.toLowerCase() === category || category.includes(p.category.toLowerCase())).slice(0, 4).map((p) => scoreProduct(p, true));
      nearMatches = nearest;
    } else if (recommendations.length < 3) {
      const existingIds = new Set(recommendations.map((r) => r.product.id));
      const alternatives = allProducts.filter((p) => !existingIds.has(p.id) && p.status === "approved").slice(0, 3 - recommendations.length).map((p) => scoreProduct(p, true));
      nearMatches = alternatives;
    }
    return {
      recommendations,
      total_eligible: eligibleProducts.length,
      conflict_explanation: conflictExplanation,
      near_matches: nearMatches,
      extracted_requirements: {
        category,
        budget_max: budgetMax,
        budget_min: budgetMin,
        intended_use: intendedUses,
        must_have_features: mustHaves,
        usage_priority: priority
      }
    };
  }
}
export {
  SmartPickRecommendationEngine
};
