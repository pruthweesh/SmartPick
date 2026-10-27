/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI } from "@google/genai";
const GEMINI_MODEL = "gemini-3.8-flash";
let genAI = null;

// Helper: delay for ms
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generic retry wrapper for async functions.
 * Retries on Gemini overload errors with exponential backoff.
 */
async function retryAsync(fn, attempts = 3, baseDelay = 500) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('overloaded') || msg.includes('overload')) {
        if (i < attempts - 1) {
          const wait = baseDelay * Math.pow(2, i);
          console.warn(`Gemini overload detected, retry ${i + 1}/${attempts} after ${wait}ms`);
          await delay(wait);
          continue;
        }
      }
      throw err;
    }
  }
}

/**
 * Wrapper around Gemini generateContent with retry on overload.
 */
async function generateContentWithRetry(ai, options) {
  return retryAsync(() => ai.models.generateContent(options));
}
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenAI();
  }
  return genAI;
}
class SmartPickAIAgent {
  /**
   * 1. Extract structured requirements and generate a maximum of 3 clarifying questions
   */
  static async extractRequirements(userQuery) {
    const ai = getGenAI();
    const fallback = parseQueryDeterministically(userQuery);
    if (!ai) {
      return {
        requirements: fallback.requirements,
        clarifying_questions: fallback.clarifying_questions.slice(0, 3),
        confidence: "medium"
      };
    }
    try {
      const prompt = `
You are the AI shopping advisor for "SmartPick", a premier trust-first tech and electronics advisor in India.
Analyze this user shopping query: "${userQuery}"

Your tasks:
1. Detect product category: "smartphones", "laptops", "audio", "smartwatches", "tablets", "smart-home", or "all".
2. Extract structured shopping constraints in Indian Rupees (\u20B9/INR).
3. Extract any must-have features (e.g. "anc", "oled", "120hz", "fast_charge", "long_battery", "water_resistance", "m3", "snapdragon").
4. Determine usage priority: "performance", "battery", "camera", "display", "portability", "sound", "calls", or "value".
5. Generate a MAXIMUM OF THREE (1, 2, or 3) short, multiple-choice clarifying questions ONLY for missing critical dimensions (budget, intended usage, or must-have).
   - If user already stated budget or usage, DO NOT ask for it.
   - Never return more than 3 clarifying questions.

Respond ONLY with valid JSON in this exact structure:
{
  "category": "smartphones",
  "budget_min": 0,
  "budget_max": 70000,
  "intended_use": ["photography", "daily"],
  "must_have_features": ["120hz", "fast_charge"],
  "deal_breakers": [],
  "preferred_brands": ["apple", "samsung", "oneplus"],
  "usage_priority": "camera",
  "clarifying_questions": [
    {
      "id": "q_budget",
      "dimension": "budget",
      "question": "What is your target budget ceiling?",
      "options": ["Under \u20B930,000", "Under \u20B950,000", "Under \u20B980,000", "Flagship (\u20B91,00,000+)"]
    }
  ]
}
`;
      const response = await generateContentWithRetry(ai, {
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      const text = response.text?.trim() || "{}";
      const parsed = JSON.parse(text);
      const merged = {
        category: parsed.category || fallback.requirements.category || "all",
        budget_min: typeof parsed.budget_min === "number" ? parsed.budget_min : fallback.requirements.budget_min || 0,
        budget_max: typeof parsed.budget_max === "number" && parsed.budget_max > 0 ? parsed.budget_max : fallback.requirements.budget_max || 15e4,
        intended_use: Array.isArray(parsed.intended_use) && parsed.intended_use.length > 0 ? parsed.intended_use : fallback.requirements.intended_use || ["daily"],
        must_have_features: Array.isArray(parsed.must_have_features) ? parsed.must_have_features : fallback.requirements.must_have_features || [],
        deal_breakers: Array.isArray(parsed.deal_breakers) ? parsed.deal_breakers : fallback.requirements.deal_breakers || [],
        preferred_brands: Array.isArray(parsed.preferred_brands) ? parsed.preferred_brands : fallback.requirements.preferred_brands || [],
        usage_priority: parsed.usage_priority || fallback.requirements.usage_priority || "value"
      };
      let questions = Array.isArray(parsed.clarifying_questions) && parsed.clarifying_questions.length > 0 ? parsed.clarifying_questions : fallback.clarifying_questions;
      questions = questions.slice(0, 3);
      return {
        requirements: merged,
        clarifying_questions: questions,
        confidence: "high"
      };
    } catch (err) {
      console.warn("Gemini extraction failed, using deterministic parser:", err);
      return {
        requirements: fallback.requirements,
        clarifying_questions: fallback.clarifying_questions.slice(0, 3),
        confidence: "medium"
      };
    }
  }
  /**
   * 2. Grounded explanation generation for recommendations
   */
  static async generateAdviceSummary(requirements, recommendations) {
    if (recommendations.length === 0) {
      return "No approved products matched your exact criteria. Please review our suggested near-matches or consider adjusting your budget or feature requirements.";
    }
    const ai = getGenAI();
    if (!ai) {
      const top = recommendations[0];
      const lowestOffer = top.product.offers?.[0]?.current_price || top.product.current_price;
      return `For your ceiling of \u20B9${requirements.budget_max?.toLocaleString("en-IN") || "1,00,000"} prioritizing ${requirements.intended_use?.join(", ") || "everyday performance"}, the #1 pick is ${top.product.name} (Match Score: ${top.match_score}/100) at \u20B9${lowestOffer?.toLocaleString("en-IN")}. It delivers audited laboratory specifications with balanced performance.`;
    }
    try {
      const topProductsData = recommendations.slice(0, 5).map((r, idx) => ({
        rank: idx + 1,
        name: r.product.name,
        brand: r.product.brand,
        category: r.product.category,
        score: r.match_score,
        price: r.product.offers?.[0]?.current_price ? `\u20B9${r.product.offers[0].current_price}` : "Not available",
        availability: r.product.offers?.[0]?.availability_status || "Not available",
        specs: r.product.specifications?.map((s) => `${s.spec_key}: ${s.spec_value || "Not available"}`) || [],
        reviews_summary: r.product.reviews_insights?.[0]?.summary || "Not available",
        trade_offs: r.trade_offs || "Not available"
      }));
      const prompt = `
You are SmartPick's fiduciary AI shopping advisor in India.
Write an intelligent, evidence-led synthesis (2 short paragraphs) explaining why these ${topProductsData.length} products were selected.

User Context:
- Category: ${requirements.category || "All Electronics"}
- Budget Ceiling: \u20B9${requirements.budget_max || 15e4}
- Intended Use: ${requirements.intended_use?.join(", ") || "General use"}
- Must Have Features: ${requirements.must_have_features?.join(", ") || "None specified"}
- Usage Priority: ${requirements.usage_priority || "Value for money"}

Database Candidates (GROUND TRUTH):
${JSON.stringify(topProductsData, null, 2)}

ABSOLUTE ANTI-HALLUCINATION CONSTITUTION:
1. NEVER invent product specifications, prices, discounts, availability, reviews, or warranties.
2. If any specification, price, availability, or review data is missing, null, or not explicitly provided in the ground truth, you MUST say "Not available".
3. NEVER guess battery life, processor speed, screen resolution, or camera specs. Use only the exact numbers provided.
4. Tone: honest, objective, reassuring, strictly evidence-bound.
`;
      const response = await generateContentWithRetry(ai, {
        model: GEMINI_MODEL,
        contents: prompt
      });
      return response.text?.trim() || "Advisor summary generated based on verified laboratory test specifications and current Indian retail pricing.";
    } catch (err) {
      console.warn("AI summary generation failed:", err);
      const top = recommendations[0];
      const lowestOffer = top.product.offers?.[0]?.current_price;
      const priceText = lowestOffer ? `\u20B9${lowestOffer.toLocaleString("en-IN")}` : "Not available";
      return `We selected ${top.product.name} (Match score: ${top.match_score}/100, Price: ${priceText}) as the primary recommendation based on your criteria. Review the side-by-side trade-offs below to determine which model fits your lifestyle best.`;
    }
  }
  /**
   * 3. Multi-product comparison synthesis
   */
  static async generateComparisonInsight(products) {
    if (!products || products.length < 2) {
      return "Select at least 2 models to view side-by-side technical trade-offs.";
    }
    const ai = getGenAI();
    if (!ai) {
      const names = products.map((p) => p.name).join(" vs ");
      const priceSummaries = products.map((p) => {
        const best = p.offers?.length > 0 ? Math.min(...p.offers.map((o) => o.current_price)) : 0;
        return `${p.name} (\u20B9${best.toLocaleString("en-IN")})`;
      }).join(", ");
      return `Comparing ${names}: Current live pricing stands at ${priceSummaries}. Check the detailed attribute matrix below for verified differences in processor/audio hardware, display technology, battery life, and durability standards.`;
    }
    try {
      const summaryPayload = products.map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        best_price: p.offers?.length > 0 ? Math.min(...p.offers.map((o) => o.current_price)) : "Not available",
        specs: (p.specifications || []).map((s) => `${s.spec_key}: ${s.spec_value}`)
      }));
      const prompt = `
You are the lead tech analyst for "SmartPick", India's trust-first tech and electronics advisor.
Compare the following ${products.length} products objectively based strictly on their verified specifications and pricing:

${JSON.stringify(summaryPayload, null, 2)}

Provide a concise 2-3 paragraph comparison highlighting:
1. Key differences in performance, display/audio hardware, and battery life.
2. Value-for-money verdict considering current Indian retail pricing.
3. Who each model is best suited for.

ABSOLUTE ANTI-HALLUCINATION RULES:
- Only cite specifications and numbers present in the data above.
- If an attribute is missing or unknown, state "Not available".
- Be balanced, factual, and strictly evidence-bound.
`;
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt
      });
      return response.text?.trim() || "Comparison summary generated based on verified technical specifications.";
    } catch (err) {
      console.warn("Comparison insight generation failed:", err);
      const names = products.map((p) => p.name).join(" vs ");
      return `Direct specification comparison for ${names}. Review the side-by-side hardware matrix below to inspect verified benchmarks, battery runtimes, and retail offers.`;
    }
  }
}
function parseQueryDeterministically(query) {
  const text = query.toLowerCase().trim();
  let detectedCategory = "all";
  let defaultBudget = 15e4;
  if (text.includes("phone") || text.includes("iphone") || text.includes("pixel") || text.includes("galaxy s") || text.includes("mobile") || text.includes("smartphone") || text.includes("oneplus 12")) {
    detectedCategory = "smartphones";
    defaultBudget = 8e4;
  } else if (text.includes("laptop") || text.includes("macbook") || text.includes("ultrabook") || text.includes("notebook") || text.includes("zenbook") || text.includes("ideapad")) {
    detectedCategory = "laptops";
    defaultBudget = 12e4;
  } else if (text.includes("watch") || text.includes("smartwatch") || text.includes("fitness tracker") || text.includes("wearable")) {
    detectedCategory = "smartwatches";
    defaultBudget = 4e4;
  } else if (text.includes("tablet") || text.includes("ipad") || text.includes("kindle") || text.includes("e-reader")) {
    detectedCategory = "tablets";
    defaultBudget = 5e4;
  } else if (text.includes("vacuum") || text.includes("dyson") || text.includes("mouse") || text.includes("speaker") || text.includes("smarthome")) {
    detectedCategory = "smart-home";
    defaultBudget = 5e4;
  } else if (text.includes("earbud") || text.includes("headphone") || text.includes("tws") || text.includes("airpod") || text.includes("anc")) {
    detectedCategory = "audio";
    defaultBudget = 1e4;
  }
  const req = {
    category: detectedCategory,
    budget_min: 0,
    budget_max: defaultBudget,
    intended_use: [],
    must_have_features: [],
    deal_breakers: [],
    preferred_brands: [],
    usage_priority: "value"
  };
  let budgetExplicitlyFound = false;
  const lakhMatch = text.match(/(?:under|below|within|upto|less than|<)?\s*(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lac)\b/i);
  const kMatch = text.match(/(?:under|below|within|upto|less than|<)?\s*(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d+)?)\s*k\b/i);
  const numMatch = text.match(/(?:under|below|within|upto|less than|<)?\s*(?:rs\.?|inr|₹)?\s*(\d{4,6})\b/i);
  if (lakhMatch && lakhMatch[1]) {
    req.budget_max = Math.round(parseFloat(lakhMatch[1]) * 1e5);
    budgetExplicitlyFound = true;
  } else if (kMatch && kMatch[1]) {
    req.budget_max = Math.round(parseFloat(kMatch[1]) * 1e3);
    budgetExplicitlyFound = true;
  } else if (numMatch && numMatch[1]) {
    const val = parseInt(numMatch[1], 10);
    if (val >= 1e3 && val <= 3e5) {
      req.budget_max = val;
      budgetExplicitlyFound = true;
    }
  }
  let usageExplicitlyFound = false;
  if (text.includes("photo") || text.includes("camera") || text.includes("video") || text.includes("portrait")) {
    req.intended_use?.push("photography");
    req.usage_priority = "camera";
    usageExplicitlyFound = true;
  }
  if (text.includes("battery") || text.includes("travel") || text.includes("long battery")) {
    req.intended_use?.push("endurance");
    req.must_have_features?.push("long_battery");
    req.usage_priority = "battery";
    usageExplicitlyFound = true;
  }
  if (text.includes("code") || text.includes("programm") || text.includes("develop") || text.includes("work") || text.includes("office")) {
    req.intended_use?.push("productivity");
    req.usage_priority = "performance";
    usageExplicitlyFound = true;
  }
  if (text.includes("gam") || text.includes("bgmi") || text.includes("fps")) {
    req.intended_use?.push("gaming");
    req.must_have_features?.push("gaming_mode");
    req.usage_priority = "gaming";
    usageExplicitlyFound = true;
  }
  if (text.includes("gym") || text.includes("run") || text.includes("workout") || text.includes("fitness")) {
    req.intended_use?.push("fitness");
    req.must_have_features?.push("water_resistance");
    req.usage_priority = "durability";
    usageExplicitlyFound = true;
  }
  const brands = ["apple", "samsung", "oneplus", "google", "xiaomi", "asus", "lenovo", "dell", "dyson", "sony", "bose", "logitech", "amazfit", "boat", "realme"];
  for (const b of brands) {
    if (text.includes(b)) {
      req.preferred_brands?.push(b);
    }
  }
  if (req.intended_use && req.intended_use.length === 0) {
    req.intended_use = ["daily_use"];
  }
  const clarifying = [];
  if (!budgetExplicitlyFound) {
    if (detectedCategory === "smartphones") {
      clarifying.push({
        id: "q_budget",
        dimension: "budget",
        question: "What is your target budget ceiling for a smartphone?",
        options: ["Under \u20B935,000 (Mid-Range)", "Under \u20B955,000 (Upper Mid-Range)", "Under \u20B975,000 (Flagship)", "Under \u20B91,30,000 (Ultra Flagship)"]
      });
    } else if (detectedCategory === "laptops") {
      clarifying.push({
        id: "q_budget",
        dimension: "budget",
        question: "What is your target budget ceiling for a laptop?",
        options: ["Under \u20B950,000 (Essential)", "Under \u20B980,000 (Mainstream)", "Under \u20B91,15,000 (Premium OLED)", "Under \u20B91,40,000 (MacBook / Pro)"]
      });
    } else {
      clarifying.push({
        id: "q_budget",
        dimension: "budget",
        question: "What is your maximum target budget?",
        options: ["Under \u20B95,000", "Under \u20B925,000", "Under \u20B960,000", "Over \u20B91,00,000"]
      });
    }
  }
  if (!usageExplicitlyFound) {
    clarifying.push({
      id: "q_use_case",
      dimension: "use_case",
      question: "What is your primary everyday priority?",
      options: ["Battery endurance & travel", "Camera & multimedia quality", "Heavy multitasking & performance", "Best value for money"]
    });
  }
  return {
    requirements: req,
    clarifying_questions: clarifying.slice(0, 3)
  };
}
export {
  SmartPickAIAgent
};
