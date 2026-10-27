/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = [
  path.resolve(process.cwd(), "backend", "data", "smartpick_store.json"),
  path.resolve(__dirname, "../data", "smartpick_store.json"),
  path.resolve(process.cwd(), "data", "smartpick_store.json"),
  path.resolve(__dirname, "../../data", "smartpick_store.json")
].find((p) => fs.existsSync(p)) || path.resolve(process.cwd(), "backend", "data", "smartpick_store.json");
class SmartPickDatabase {
  data = {
    users: [],
    products: [],
    product_specifications: [],
    product_pros_cons: [],
    retailer_offers: [],
    price_history: [],
    reviews_insights: [],
    user_preferences: [],
    wishlists: [],
    wishlist_items: [],
    price_alerts: [],
    recommendation_sessions: [],
    issue_reports: [],
    audit_logs: []
  };
  constructor() {
    this.init();
  }
  init() {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        this.data = JSON.parse(raw);
        if (!this.data.products || this.data.products.length === 0) {
          this.seedAll();
        }
      } else {
        this.seedAll();
      }
    } catch (err) {
      console.error("Error initializing database, seeding defaults:", err);
      this.seedAll();
    }
  }
  save() {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to persist database:", err);
    }
  }
  getState() {
    return this.data;
  }
  getProducts() {
    return this.data.products;
  }
  getProductById(id) {
    const product = this.data.products.find((p) => p.id === id);
    if (!product) return null;
    const specs = this.data.product_specifications.filter((s) => s.product_id === id);
    const prosCons = this.data.product_pros_cons.filter((pc) => pc.product_id === id);
    const offers = this.data.retailer_offers.filter((o) => o.product_id === id);
    const history = this.data.price_history.filter((h) => h.product_id === id);
    const reviews = this.data.reviews_insights.filter((r) => r.product_id === id);
    return {
      ...product,
      specifications: specs,
      pros_cons: prosCons,
      offers,
      price_history: history,
      reviews_insights: reviews
    };
  }
  getOffers(productId) {
    return this.data.retailer_offers.filter((o) => o.product_id === productId);
  }
  getPriceHistory(productId) {
    return this.data.price_history.filter((h) => h.product_id === productId).sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());
  }
  getReviewsInsights(productId) {
    return this.data.reviews_insights.filter((r) => r.product_id === productId);
  }
  addIssueReport(report) {
    const newReport = {
      ...report,
      id: "iss_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      status: "open",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.issue_reports.unshift(newReport);
    this.addAuditLog("system", "create_issue_report", "issue_report", newReport.id, { issue_type: report.issue_type });
    this.save();
    return newReport;
  }
  updateIssueReportStatus(id, status) {
    const item = this.data.issue_reports.find((r) => r.id === id);
    if (!item) return null;
    item.status = status;
    this.addAuditLog("admin", "update_issue_status", "issue_report", id, { new_status: status });
    this.save();
    return item;
  }
  updateProductStatus(id, status) {
    const p = this.data.products.find((prod) => prod.id === id);
    if (!p) return null;
    p.status = status;
    p.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    this.addAuditLog("admin", "update_product_status", "product", id, { new_status: status });
    this.save();
    return p;
  }
  addAuditLog(actor, action, entity_type, entity_id, metadata) {
    const log = {
      id: "aud_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      actor,
      action,
      entity_type,
      entity_id,
      metadata_json: JSON.stringify(metadata),
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.audit_logs.unshift(log);
    if (this.data.audit_logs.length > 500) {
      this.data.audit_logs.pop();
    }
  }
  // Recommendation sessions
  saveRecommendationSession(session) {
    const newSession = {
      ...session,
      id: "rec_" + Date.now(),
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.recommendation_sessions.unshift(newSession);
    this.save();
    return newSession;
  }
  getRecommendationSession(sessionId) {
    return this.data.recommendation_sessions.find((s) => s.session_id === sessionId) || null;
  }
  // Wishlists
  getOrCreateWishlist(userId) {
    let wishlist = this.data.wishlists.find((w) => w.user_id === userId);
    if (!wishlist) {
      wishlist = {
        id: "wl_" + Date.now(),
        user_id: userId,
        name: "My Saved Products",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.data.wishlists.push(wishlist);
      this.save();
    }
    return wishlist;
  }
  getWishlistItems(userId) {
    const wishlist = this.getOrCreateWishlist(userId);
    const items = this.data.wishlist_items.filter((i) => i.wishlist_id === wishlist.id);
    return items.map((item) => {
      const prod = this.getProductById(item.product_id);
      return {
        ...item,
        product: prod
      };
    });
  }
  addToWishlist(userId, productId) {
    const wishlist = this.getOrCreateWishlist(userId);
    const existing = this.data.wishlist_items.find((i) => i.wishlist_id === wishlist.id && i.product_id === productId);
    if (existing) return existing;
    const item = {
      id: "wli_" + Date.now(),
      wishlist_id: wishlist.id,
      product_id: productId,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.wishlist_items.push(item);
    this.save();
    return item;
  }
  removeFromWishlist(userId, productIdOrItemId) {
    const wishlist = this.getOrCreateWishlist(userId);
    const idx = this.data.wishlist_items.findIndex(
      (i) => i.wishlist_id === wishlist.id && (i.product_id === productIdOrItemId || i.id === productIdOrItemId)
    );
    if (idx !== -1) {
      this.data.wishlist_items.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }
  // Price alerts
  getPriceAlerts(userId) {
    const alerts = this.data.price_alerts.filter((a) => a.user_id === userId);
    return alerts.map((alert) => ({
      ...alert,
      product: this.getProductById(alert.product_id)
    }));
  }
  addPriceAlert(userId, productId, targetPrice) {
    const existing = this.data.price_alerts.find((a) => a.user_id === userId && a.product_id === productId);
    if (existing) {
      existing.target_price = targetPrice;
      existing.is_active = true;
      this.save();
      return existing;
    }
    const alert = {
      id: "alt_" + Date.now(),
      user_id: userId,
      product_id: productId,
      target_price: targetPrice,
      is_active: true,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.price_alerts.push(alert);
    this.save();
    return alert;
  }
  deletePriceAlert(userId, alertId) {
    const idx = this.data.price_alerts.findIndex((a) => a.id === alertId && a.user_id === userId);
    if (idx !== -1) {
      this.data.price_alerts.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }
  // User management
  findUserByEmail(email) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }
  findUserById(id) {
    return this.data.users.find((u) => u.id === id) || null;
  }
  createUser(user) {
    this.data.users.push(user);
    this.save();
    return user;
  }
  updateUserPreferences(userId, prefs) {
    let current = this.data.user_preferences.find((p) => p.user_id === userId);
    if (!current) {
      current = {
        id: "pref_" + Date.now(),
        user_id: userId,
        category: prefs.category || "earbuds",
        budget_min: prefs.budget_min || 500,
        budget_max: prefs.budget_max || 5e3,
        intended_use: prefs.intended_use || "calls",
        must_have_features_json: prefs.must_have_features_json || "[]",
        deal_breakers_json: prefs.deal_breakers_json || "[]",
        preferred_brands_json: prefs.preferred_brands_json || "[]",
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.data.user_preferences.push(current);
    } else {
      Object.assign(current, prefs);
      current.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    }
    this.save();
    return current;
  }
  getUserPreferences(userId) {
    return this.data.user_preferences.find((p) => p.user_id === userId) || null;
  }
  deleteUserAccount(userId) {
    this.data.users = this.data.users.filter((u) => u.id !== userId);
    this.data.wishlists = this.data.wishlists.filter((w) => w.user_id !== userId);
    this.data.price_alerts = this.data.price_alerts.filter((a) => a.user_id !== userId);
    this.data.user_preferences = this.data.user_preferences.filter((p) => p.user_id !== userId);
    this.addAuditLog(userId, "delete_account", "user", userId, { timestamp: (/* @__PURE__ */ new Date()).toISOString() });
    this.save();
    return true;
  }
  /**
   * Seed all 20 realistic earbuds under ₹5000 in India with complete specs,
   * offers, pros/cons, review themes, and price history
   */
  seedAll() {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const lastChecked = "2025-05-18T10:30:00.000Z";
    const seedEarbuds = [
      {
        id: "p_oneplus_nord_buds_2",
        name: "OnePlus Nord Buds 2",
        brand: "OnePlus",
        category: "earbuds",
        model_number: "OP-NB2-GRY",
        description: "True wireless earbuds with 12.4mm titanium drivers, active noise cancellation up to 25dB, and BassWave algorithm for punchy sound.",
        image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
        current_price: 2499,
        original_price: 2999,
        discount: 17,
        data_completeness: 98,
        status: "approved",
        best_for: ["music", "calls", "daily commute"],
        specs: [
          { key: "battery_life_buds", value: "7", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "36", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "12.4", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.3", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "25dB Active Noise Cancellation", unit: null, confidence: "verified" },
          { key: "enc_mic_quality", value: "4-mic AI call noise cancellation", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IP55 water and dust resistant", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "94ms Pro Gaming Mode", unit: null, confidence: "verified" },
          { key: "charging_case", value: "USB Type-C Fast Charging (10m = 5h)", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year Brand Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "AAC, SBC, Dolby Atmos support", unit: null, confidence: "verified" }
        ],
        pros: [
          "Effective 25dB ANC for cafe and office hum reduction",
          "Punchy bass response with BassWave equalizer tuning",
          "Durable IP55 rating protects against sweat and light rain",
          "Stable Bluetooth 5.3 connection with OnePlus fast pair"
        ],
        cons: [
          "Case does not have water resistance (earbuds only)",
          "Gaming latency at 94ms is slightly higher than 40ms competitors",
          "No dual-device multipoint pairing"
        ],
        review_insight: {
          positive: "Excellent vocal clarity during calls and punchy bass for regional & pop playlists.",
          negative: "Touch controls can occasionally be overly sensitive when adjusting fit in ear.",
          summary: "84% of verified buyers recommend for daily commute and Zoom calls in moderate ambient noise.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B0BY8MCQ9S",
            current_price: 2499,
            original_price: 2999,
            discount: 17,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B0BY8MCQ9S?tag=smartpick-21",
            is_affiliate: true
          },
          {
            retailer_name: "Flipkart",
            retailer_url: "https://www.flipkart.com/oneplus-nord-buds-2",
            current_price: 2599,
            original_price: 2999,
            discount: 13,
            availability: "in_stock",
            affiliate_url: "https://www.flipkart.com/oneplus-nord-buds-2?affid=smartpick",
            is_affiliate: true
          }
        ]
      },
      {
        id: "p_realme_buds_air_5",
        name: "Realme Buds Air 5",
        brand: "Realme",
        category: "earbuds",
        model_number: "RMA2301",
        description: "Class-leading 50dB deep active noise cancellation with 4000Hz ultra-wide band noise reduction and 45ms gaming mode.",
        image_url: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop&q=80",
        current_price: 3699,
        original_price: 4999,
        discount: 26,
        data_completeness: 97,
        status: "approved",
        best_for: ["calls", "gaming", "study", "metro commute"],
        specs: [
          { key: "battery_life_buds", value: "7", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "38", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "12.4", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.3", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "50dB Deep Active Noise Cancellation", unit: null, confidence: "verified" },
          { key: "enc_mic_quality", value: "6-mic Call Noise Cancellation with AI", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IPX5 water resistant", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "45ms Super Low Latency", unit: null, confidence: "verified" },
          { key: "charging_case", value: "USB Type-C Dart Charging (10m = 7h)", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year Domestic Brand Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "AAC, SBC", unit: null, confidence: "verified" }
        ],
        pros: [
          "Best-in-class 50dB ANC eliminates low engine hum and bus rumble",
          "6-microphone array delivers superior microphone clarity in windy outdoor conditions",
          "45ms low-latency mode delivers snappy audio sync in competitive mobile gaming",
          "Rich Realme Link companion app with custom 5-band equalizer"
        ],
        cons: [
          "Glossy case shows micro-scratches easily over time",
          "High volume levels (above 85%) introduce minor treble harshness"
        ],
        review_insight: {
          positive: "Exceptional ANC power rarely found under \u20B94,000; microphone performance is clear in traffic.",
          negative: "White glossy finish is prone to pocket lint and scratches.",
          summary: "89% positive sentiment across 1,200+ verified customer reviews.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Flipkart",
            retailer_url: "https://www.flipkart.com/realme-buds-air-5",
            current_price: 3699,
            original_price: 4999,
            discount: 26,
            availability: "in_stock",
            affiliate_url: "https://www.flipkart.com/realme-buds-air-5?affid=smartpick",
            is_affiliate: true
          },
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B0CGDRD589",
            current_price: 3799,
            original_price: 4999,
            discount: 24,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B0CGDRD589?tag=smartpick-21",
            is_affiliate: true
          }
        ]
      },
      {
        id: "p_boat_airdopes_141",
        name: "boAt Airdopes 141",
        brand: "boAt",
        category: "earbuds",
        model_number: "AD141-BLK",
        description: "Budget champion with 42 hours total playback, ENx environmental noise cancellation for calls, and 80ms BEAST gaming mode.",
        image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
        current_price: 1199,
        original_price: 4490,
        discount: 73,
        data_completeness: 95,
        status: "approved",
        best_for: ["budget buyers", "study", "casual music"],
        specs: [
          { key: "battery_life_buds", value: "6", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "42", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "8", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.1", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "Not available (Passive isolation only)", unit: null, confidence: "missing" },
          { key: "enc_mic_quality", value: "Quad mic with ENx environmental noise tech", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IPX4 sweat and splash resistant", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "80ms BEAST mode", unit: null, confidence: "verified" },
          { key: "charging_case", value: "USB Type-C ASAP Charge (5m = 75m)", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year boAt Replacement Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "SBC, AAC", unit: null, confidence: "verified" }
        ],
        pros: [
          "Remarkable 42-hour total battery life at an entry-level price",
          "Fast ASAP charge provides over an hour of music in 5 minutes",
          "Reliable boAt warranty service centers across Tier-1 and Tier-2 Indian cities",
          "Sturdy magnetic case latch"
        ],
        cons: [
          "No Active Noise Cancellation (ANC)",
          "Uses Bluetooth 5.1 instead of modern 5.3",
          "Sound signature is heavily bass-skewed with recessed mids"
        ],
        review_insight: {
          positive: "Incredible value for money for students who need reliable battery life for online lectures.",
          negative: "Bass can overpower classical vocals, not suitable for high-fidelity critical listening.",
          summary: "Over 200,000 ratings in India, proven durability for daily student usage.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B09N3ZNHTY",
            current_price: 1199,
            original_price: 4490,
            discount: 73,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B09N3ZNHTY?tag=smartpick-21",
            is_affiliate: true
          },
          {
            retailer_name: "Croma",
            retailer_url: "https://www.croma.com/boat-airdopes-141",
            current_price: 1299,
            original_price: 4490,
            discount: 71,
            availability: "in_stock",
            affiliate_url: "https://www.croma.com/boat-airdopes-141?utm_source=smartpick",
            is_affiliate: false
          }
        ]
      },
      {
        id: "p_oppo_enco_buds_2",
        name: "Oppo Enco Buds 2",
        brand: "Oppo",
        category: "earbuds",
        model_number: "ETE41",
        description: "Acoustically tuned wireless earbuds featuring 10mm large titanized composite drivers and AI deep call noise cancellation.",
        image_url: "https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=600&auto=format&fit=crop&q=80",
        current_price: 1799,
        original_price: 3999,
        discount: 55,
        data_completeness: 96,
        status: "approved",
        best_for: ["music", "study", "calls"],
        specs: [
          { key: "battery_life_buds", value: "7", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "28", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "10", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.2", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "Not available (Passive isolation only)", unit: null, confidence: "missing" },
          { key: "enc_mic_quality", value: "AI Deep Noise Cancellation for Calls", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IPX4 sweat and water resistant", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "94ms Low-Latency Game Mode", unit: null, confidence: "verified" },
          { key: "charging_case", value: "USB Type-C Quick Charge (10m = 1h)", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year Oppo Official Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "AAC, SBC, Enco Live Stereo Sound Effects", unit: null, confidence: "verified" }
        ],
        pros: [
          "Best acoustic balance and vocal reproduction under \u20B92,000",
          "Very lightweight ergonomic fit (only 4g per earbud)",
          "AI microphone algorithm does a solid job filtering indoor fan noise",
          "Enco Live presets (Original, Clear Vocals, Bass Boost)"
        ],
        cons: [
          "No ANC hardware module",
          "Case matte finish collects dust over time",
          "Battery life of 28 hours is moderate compared to boAt 42h"
        ],
        review_insight: {
          positive: "Widely praised by reviewers as the audiophile benchmark under \u20B92,000 for natural instrument separation.",
          negative: "Microphone struggles somewhat in heavy outdoor traffic.",
          summary: "Consistently rated 4.4/5 across major Indian e-commerce platforms.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Flipkart",
            retailer_url: "https://www.flipkart.com/oppo-enco-buds-2",
            current_price: 1799,
            original_price: 3999,
            discount: 55,
            availability: "in_stock",
            affiliate_url: "https://www.flipkart.com/oppo-enco-buds-2?affid=smartpick",
            is_affiliate: true
          },
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B0BBR46H16",
            current_price: 1799,
            original_price: 3999,
            discount: 55,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B0BBR46H16?tag=smartpick-21",
            is_affiliate: true
          }
        ]
      },
      {
        id: "p_cmf_by_nothing_buds",
        name: "CMF by Nothing Buds",
        brand: "CMF by Nothing",
        category: "earbuds",
        model_number: "B162",
        description: "Striking minimalist design with 42dB Active Noise Cancellation, Ultra Bass Technology 2.0, and 4 HD mics with Clear Voice.",
        image_url: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=600&auto=format&fit=crop&q=80",
        current_price: 2499,
        original_price: 3499,
        discount: 29,
        data_completeness: 99,
        status: "approved",
        best_for: ["music", "gym", "calls", "daily commute"],
        specs: [
          { key: "battery_life_buds", value: "8", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "35.5", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "12.4", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.3", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "42dB Active Noise Cancellation + Transparency", unit: null, confidence: "verified" },
          { key: "enc_mic_quality", value: "4 HD mics with Clear Voice Technology", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IP54 dust and splash resistant", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "Low Lag Mode via Nothing X app", unit: null, confidence: "verified" },
          { key: "charging_case", value: "USB Type-C Fast Charge (10m = 6.5h)", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year Nothing Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "AAC, SBC, Dirac Opteo audio tuning", unit: null, confidence: "verified" }
        ],
        pros: [
          "Effective 42dB ANC performance with transparent pass-through mode",
          "Nothing X mobile app allows granular 5-level Ultra Bass adjustment",
          "Distinctive industrial design with lanyard roller wheel aesthetic",
          "Dual-device connection support (multipoint)"
        ],
        cons: [
          "Square case is slightly chunkier in tighter jeans pockets",
          "Transparency mode has mild electronic hiss in dead silent rooms"
        ],
        review_insight: {
          positive: "App integration via Nothing X is top tier; dual device connection works seamlessly between laptop and phone.",
          negative: "Lanyard dial on the case is non-rotating on this version (aesthetic wheel).",
          summary: "High acclaim from tech critics for bringing premium design and multipoint under \u20B92,500.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Flipkart",
            retailer_url: "https://www.flipkart.com/cmf-nothing-buds",
            current_price: 2499,
            original_price: 3499,
            discount: 29,
            availability: "in_stock",
            affiliate_url: "https://www.flipkart.com/cmf-nothing-buds?affid=smartpick",
            is_affiliate: true
          },
          {
            retailer_name: "Croma",
            retailer_url: "https://www.croma.com/cmf-by-nothing-buds",
            current_price: 2499,
            original_price: 3499,
            discount: 29,
            availability: "in_stock",
            affiliate_url: "https://www.croma.com/cmf-by-nothing-buds?utm_source=smartpick",
            is_affiliate: false
          }
        ]
      },
      {
        id: "p_realme_buds_t300",
        name: "Realme Buds T300",
        brand: "Realme",
        category: "earbuds",
        model_number: "RMA2302",
        description: "Featuring 30dB ANC, 360-degree spatial audio effect, and 12.4mm dynamic bass boost driver with 40 hours total endurance.",
        image_url: "https://images.unsplash.com/photo-1574920162043-b872873f19c8?w=600&auto=format&fit=crop&q=80",
        current_price: 2299,
        original_price: 3999,
        discount: 43,
        data_completeness: 97,
        status: "approved",
        best_for: ["music", "gym", "calls"],
        specs: [
          { key: "battery_life_buds", value: "8", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "40", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "12.4", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.3", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "30dB Active Noise Cancellation", unit: null, confidence: "verified" },
          { key: "enc_mic_quality", value: "4-mic Call Noise Cancellation", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IP55 water and sweat resistant", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "50ms Game Mode", unit: null, confidence: "verified" },
          { key: "charging_case", value: "USB Type-C Fast Charging (10m = 7h)", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year Brand Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "AAC, SBC, 360 Spatial Audio Effect", unit: null, confidence: "verified" }
        ],
        pros: [
          "Solid 30dB ANC provides noticeable silence in air conditioned libraries and trains",
          "360\xB0 Spatial Audio adds immersion to movies and OTT streaming",
          "8 hours continuous earbud playback on a single charge",
          "IP55 rating resists heavy sweat during workouts"
        ],
        cons: [
          "Spatial audio feature is digital simulation, slightly alters treble naturalness",
          "Touch sensor area is slightly small"
        ],
        review_insight: {
          positive: "Excellent bass impact and very long battery endurance per charge.",
          negative: "Spatial audio is best for movies rather than acoustic tracks.",
          summary: "86% customer satisfaction rating on Indian marketplaces.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B0CFV87KCV",
            current_price: 2299,
            original_price: 3999,
            discount: 43,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B0CFV87KCV?tag=smartpick-21",
            is_affiliate: true
          },
          {
            retailer_name: "Flipkart",
            retailer_url: "https://www.flipkart.com/realme-buds-t300",
            current_price: 2299,
            original_price: 3999,
            discount: 43,
            availability: "in_stock",
            affiliate_url: "https://www.flipkart.com/realme-buds-t300?affid=smartpick",
            is_affiliate: true
          }
        ]
      },
      {
        id: "p_boat_nirvana_ion",
        name: "boAt Nirvana Ion",
        brand: "boAt",
        category: "earbuds",
        model_number: "NIRVANA-ION",
        description: "Marathon battery monster providing a record-breaking 24 hours playback on a single charge and 120 hours total with case.",
        image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        current_price: 1999,
        original_price: 7990,
        discount: 75,
        data_completeness: 97,
        status: "approved",
        best_for: ["travel", "long shifts", "study", "binge watching"],
        specs: [
          { key: "battery_life_buds", value: "24", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "120", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "10", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.2", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "Not available (Passive isolation only)", unit: null, confidence: "missing" },
          { key: "enc_mic_quality", value: "Quad Mics with ENx Technology", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IPX4 water and sweat resistant", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "60ms BEAST Mode", unit: null, confidence: "verified" },
          { key: "charging_case", value: "USB Type-C ASAP Charge", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year Brand Replacement Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "HiFi DSP, Crystal Bionic Sound Dual EQ", unit: null, confidence: "verified" }
        ],
        pros: [
          "Unrivaled 24 hours continuous earbud playback without needing the case",
          "120 hours total battery means you can travel for weeks without a wall charger",
          "In-ear detection automatically pauses music when an earbud is removed",
          "Premium dual-tone finish with ergonomic angled nozzles"
        ],
        cons: [
          "No Active Noise Cancellation",
          "Charging case is heavier and bulkier than standard 35h cases",
          "60ms gaming mode is decent but not top-tier for esports"
        ],
        review_insight: {
          positive: "Battery is truly mindblowing; users report charging the case only once every 3 weeks.",
          negative: "Case weight (around 62g) is felt in lightweight trousers.",
          summary: "Top pick for train travelers, security personnel, and long shift workers.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B0BY2TTRG2",
            current_price: 1999,
            original_price: 7990,
            discount: 75,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B0BY2TTRG2?tag=smartpick-21",
            is_affiliate: true
          },
          {
            retailer_name: "Flipkart",
            retailer_url: "https://www.flipkart.com/boat-nirvana-ion",
            current_price: 2199,
            original_price: 7990,
            discount: 72,
            availability: "in_stock",
            affiliate_url: "https://www.flipkart.com/boat-nirvana-ion?affid=smartpick",
            is_affiliate: true
          }
        ]
      },
      {
        id: "p_oneplus_nord_buds_2r",
        name: "OnePlus Nord Buds 2r",
        brand: "OnePlus",
        category: "earbuds",
        model_number: "OP-NB2R-BLU",
        description: "Budget-friendly iteration from OnePlus packing 12.4mm extra large drivers, dual microphones with AI noise reduction, and IP55 durability.",
        image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
        current_price: 1999,
        original_price: 2299,
        discount: 13,
        data_completeness: 96,
        status: "approved",
        best_for: ["gym", "music", "budget buyers", "calls"],
        specs: [
          { key: "battery_life_buds", value: "8", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "38", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "12.4", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.3", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "Not available (Passive isolation only)", unit: null, confidence: "missing" },
          { key: "enc_mic_quality", value: "Dual Mics with AI Clear Call algorithm", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IP55 water and dust resistant", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "94ms Low Latency Mode", unit: null, confidence: "verified" },
          { key: "charging_case", value: "USB Type-C Standard Charging", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year Brand Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "AAC, SBC, Sound Master Equalizer", unit: null, confidence: "verified" }
        ],
        pros: [
          "Same massive 12.4mm drivers as the Nord Buds 2 with rich soundstage",
          "IP55 water and dust resistance is exceptional at \u20B91,999",
          "Up to 8 hours playback per earbud charge",
          "Simple, reliable HeyMelody companion app"
        ],
        cons: [
          "Lacks Active Noise Cancellation (ANC)",
          "No in-ear detection sensor",
          "Case does not feature OnePlus Warp/Fast charge rate"
        ],
        review_insight: {
          positive: "Built like a tank for workouts, doesn\u2019t fall out during morning runs.",
          negative: "No ANC means ambient bus noise still creeps through.",
          summary: "87% recommendation rate for gym and sports enthusiasts on a budget.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B0C788YXZF",
            current_price: 1999,
            original_price: 2299,
            discount: 13,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B0C788YXZF?tag=smartpick-21",
            is_affiliate: true
          },
          {
            retailer_name: "Reliance Digital",
            retailer_url: "https://www.reliancedigital.in/oneplus-nord-buds-2r",
            current_price: 1999,
            original_price: 2299,
            discount: 13,
            availability: "in_stock",
            affiliate_url: "https://www.reliancedigital.in/oneplus-nord-buds-2r?ref=smartpick",
            is_affiliate: false
          }
        ]
      },
      {
        id: "p_noise_buds_vs104",
        name: "Noise Buds VS104",
        brand: "Noise",
        category: "earbuds",
        model_number: "VS104-MINT",
        description: "Vibrant true wireless earbuds offering 45 hours total playtime, 13mm driver, and Instacharge 10 min = 200 min technology.",
        image_url: "https://images.unsplash.com/photo-1628202926206-c63a34b1618f?w=600&auto=format&fit=crop&q=80",
        current_price: 1299,
        original_price: 3499,
        discount: 63,
        data_completeness: 94,
        status: "approved",
        best_for: ["budget buyers", "casual music", "study"],
        specs: [
          { key: "battery_life_buds", value: "7", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "45", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "13", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.2", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "Not available (Passive isolation only)", unit: null, confidence: "missing" },
          { key: "enc_mic_quality", value: "Quad Mic with Environmental Noise Cancellation", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IPX5 water resistance", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "50ms Low Latency Game Mode", unit: null, confidence: "verified" },
          { key: "charging_case", value: "USB Type-C Instacharge (10m = 200m)", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year Noise Domestic Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "AAC, SBC", unit: null, confidence: "verified" }
        ],
        pros: [
          "Generous 13mm drivers deliver punchy low-end energy",
          "Rapid 10-minute Instacharge gives over 3 hours of playback",
          "Good IPX5 water resistance rating at \u20B91,299",
          "Attractive pastel color variants"
        ],
        cons: [
          "No ANC",
          "Build feels somewhat lightweight and plastic",
          "Microphone can capture ambient wind hiss outdoors"
        ],
        review_insight: {
          positive: "Popular among college students for quick top-ups and loud volume levels.",
          negative: "High frequencies get slightly distorted at maximum 100% volume.",
          summary: "4.1/5 stars across 45,000+ ratings in India.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B0B1M9CG6X",
            current_price: 1299,
            original_price: 3499,
            discount: 63,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B0B1M9CG6X?tag=smartpick-21",
            is_affiliate: true
          },
          {
            retailer_name: "Flipkart",
            retailer_url: "https://www.flipkart.com/noise-buds-vs104",
            current_price: 1349,
            original_price: 3499,
            discount: 61,
            availability: "in_stock",
            affiliate_url: "https://www.flipkart.com/noise-buds-vs104?affid=smartpick",
            is_affiliate: true
          }
        ]
      },
      {
        id: "p_boult_audio_z40",
        name: "Boult Audio Z40",
        brand: "Boult",
        category: "earbuds",
        model_number: "Z40-WHT",
        description: "Marathon 60 hours total playtime, 10mm BoomX tech drivers, and Zen Environmental Noise Cancellation with 45ms combat mode.",
        image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
        current_price: 1199,
        original_price: 4999,
        discount: 76,
        data_completeness: 95,
        status: "approved",
        best_for: ["budget buyers", "travel", "calls", "bass lovers"],
        specs: [
          { key: "battery_life_buds", value: "8", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "60", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "10", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.3", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "Not available (Passive isolation only)", unit: null, confidence: "missing" },
          { key: "enc_mic_quality", value: "Zen ENC mic with AI voice filtering", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IPX5 water and sweat resistant", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "45ms Combat Gaming Mode", unit: null, confidence: "verified" },
          { key: "charging_case", value: "Lightning Bouncers Type-C (10m = 150m)", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year Boult Replacement Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "SBC, AAC BoomX Rich Bass", unit: null, confidence: "verified" }
        ],
        pros: [
          "Massive 60-hour total battery life under \u20B91,200",
          "Fast 45ms combat mode for gaming at a rock-bottom price",
          "Zen ENC microphone clarifies speech in indoor zoom meetings",
          "Comfortable stem ergonomic fit"
        ],
        cons: [
          "No Active Noise Cancellation",
          "Heavily bass-biased acoustic tuning"
        ],
        review_insight: {
          positive: "Exceptional battery backup and solid mic for indoor conference calls.",
          negative: "Treble can sound muffled on complex orchestral tracks.",
          summary: "85% positive reviews among budget buyers.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B0BTDPD3J1",
            current_price: 1199,
            original_price: 4999,
            discount: 76,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B0BTDPD3J1?tag=smartpick-21",
            is_affiliate: true
          },
          {
            retailer_name: "Flipkart",
            retailer_url: "https://www.flipkart.com/boult-audio-z40",
            current_price: 1199,
            original_price: 4999,
            discount: 76,
            availability: "in_stock",
            affiliate_url: "https://www.flipkart.com/boult-audio-z40?affid=smartpick",
            is_affiliate: true
          }
        ]
      },
      {
        id: "p_jbl_wave_beam",
        name: "JBL Wave Beam",
        brand: "JBL",
        category: "earbuds",
        model_number: "JBLWBEAMBLK",
        description: "Renowned JBL Deep Bass sound with Smart Ambient TalkThru technology, VoiceAware hands-free calls, and JBL Headphones App EQ.",
        image_url: "https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=600&auto=format&fit=crop&q=80",
        current_price: 3499,
        original_price: 4999,
        discount: 30,
        data_completeness: 98,
        status: "approved",
        best_for: ["music", "calls", "brand lovers"],
        specs: [
          { key: "battery_life_buds", value: "8", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "32", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "8", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.2", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "Not available (Smart Ambient & TalkThru instead)", unit: null, confidence: "missing" },
          { key: "enc_mic_quality", value: "VoiceAware mic technology with feedback control", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IP54 buds / IPX2 charging case", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "Smart Audio & Video Mode in App", unit: null, confidence: "verified" },
          { key: "charging_case", value: "USB Type-C Speed Charge (10m = 2h)", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year Harman India Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "AAC, SBC, JBL Signature Deep Bass", unit: null, confidence: "verified" }
        ],
        pros: [
          "Signature JBL Deep Bass sound has great punch without muddying instruments",
          "Dedicated JBL Headphones app allows customized parametric equalizer curves",
          "VoiceAware feature lets you hear your own voice during telephone calls naturally",
          "Smart Ambient lets you hear traffic without taking earbuds out"
        ],
        cons: [
          "No true Active Noise Cancellation (ANC)",
          "Higher price than domestic brands with fewer paper specs"
        ],
        review_insight: {
          positive: "Audio tuning is significantly more refined than budget bass-heavy earbuds; build quality is top shelf.",
          negative: "At \u20B93,500, users miss having full active noise cancellation.",
          summary: "Recommended for music enthusiasts who trust JBL audio pedigree over spec sheets.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B0BTP8N25C",
            current_price: 3499,
            original_price: 4999,
            discount: 30,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B0BTP8N25C?tag=smartpick-21",
            is_affiliate: true
          },
          {
            retailer_name: "Croma",
            retailer_url: "https://www.croma.com/jbl-wave-beam",
            current_price: 3699,
            original_price: 4999,
            discount: 26,
            availability: "in_stock",
            affiliate_url: "https://www.croma.com/jbl-wave-beam?utm_source=smartpick",
            is_affiliate: false
          }
        ]
      },
      {
        id: "p_sony_wf_c500",
        name: "Sony WF-C500",
        brand: "Sony",
        category: "earbuds",
        model_number: "WFC500B",
        description: "Compact wireless earbuds with Sony DSEE audio upscaling technology, 360 Reality Audio, 10 hours continuous battery on buds, and IPX4.",
        image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
        current_price: 4490,
        original_price: 8990,
        discount: 50,
        data_completeness: 99,
        status: "approved",
        best_for: ["music", "study", "audiophiles"],
        specs: [
          { key: "battery_life_buds", value: "10", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "20", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "5.8", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.0", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "Not available (Passive isolation only)", unit: null, confidence: "missing" },
          { key: "enc_mic_quality", value: "High-quality omni mic for voice calls", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IPX4 splash and sweat proof", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "Not available (Standard video sync)", unit: null, confidence: "missing" },
          { key: "charging_case", value: "USB Type-C Fast Charge (10m = 1h)", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year Sony India Official Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "SBC, AAC, Sony DSEE Sound Enhancement Engine", unit: null, confidence: "verified" }
        ],
        pros: [
          "DSEE sound engine restores high frequencies lost in digital compression",
          "Impressive 10 hours non-stop music playback per earbud charge",
          "Ultra-compact ergonomic cylindrical case and light ear fit",
          "Sony Headphones Connect app provides studio-grade EQ adjustments"
        ],
        cons: [
          "No Active Noise Cancellation",
          "Charging case only holds 1 extra full charge (20h total)",
          "Uses Bluetooth 5.0"
        ],
        review_insight: {
          positive: "Sound quality is unmatched under \u20B95,000 for classical, acoustic, and jazz fans.",
          negative: "Case capacity is only 10 extra hours.",
          summary: "91% score among audiophile reviewers looking for clean vocal separation.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B09CG5HW99",
            current_price: 4490,
            original_price: 8990,
            discount: 50,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B09CG5HW99?tag=smartpick-21",
            is_affiliate: true
          },
          {
            retailer_name: "Reliance Digital",
            retailer_url: "https://www.reliancedigital.in/sony-wf-c500",
            current_price: 4490,
            original_price: 8990,
            discount: 50,
            availability: "in_stock",
            affiliate_url: "https://www.reliancedigital.in/sony-wf-c500?ref=smartpick",
            is_affiliate: false
          }
        ]
      },
      {
        id: "p_realme_buds_air_5_pro",
        name: "Realme Buds Air 5 Pro",
        brand: "Realme",
        category: "earbuds",
        model_number: "RMA2120",
        description: "Flagship-grade acoustic architecture with coaxial dual drivers (11mm bass + 6mm planar tweeter), 50dB hybrid ANC, and LDAC Hi-Res Audio.",
        image_url: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop&q=80",
        current_price: 4999,
        original_price: 7999,
        discount: 37,
        data_completeness: 100,
        status: "approved",
        best_for: ["music", "calls", "audiophiles", "gaming", "study"],
        specs: [
          { key: "battery_life_buds", value: "11", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "40", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "11mm + 6mm dual coaxial", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.3", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "50dB Real-time Adaptive Active Noise Cancellation", unit: null, confidence: "verified" },
          { key: "enc_mic_quality", value: "6-Mic AI Deep Call Noise Reduction", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IPX5 water resistant", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "40ms Super Low Latency", unit: null, confidence: "verified" },
          { key: "charging_case", value: "USB Type-C Dart Charge (10m = 7h)", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year Domestic Brand Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "LDAC Hi-Res Wireless, AAC, SBC, 3D Spatial Audio", unit: null, confidence: "verified" }
        ],
        pros: [
          "Dual coaxial drivers deliver shimmering highs and deep sub-bass without crossover distortion",
          "LDAC Hi-Res wireless audio certification supports up to 990kbps streaming",
          "Massive 50dB adaptive ANC silences metro rail and flight cabin drone",
          "Seamless dual-device connection between laptop and smartphone"
        ],
        cons: [
          "Sits right at the ceiling of the \u20B95,000 budget",
          "Enabling LDAC and 50dB ANC reduces battery life to ~5.5 hours"
        ],
        review_insight: {
          positive: "Widely reviewed as the most technically advanced TWS under \u20B95,000 in India.",
          negative: "Battery drain is faster with LDAC hi-res codec enabled.",
          summary: "94% buyer satisfaction, regarded as the performance king in sub-5k category.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Flipkart",
            retailer_url: "https://www.flipkart.com/realme-buds-air-5-pro",
            current_price: 4999,
            original_price: 7999,
            discount: 37,
            availability: "in_stock",
            affiliate_url: "https://www.flipkart.com/realme-buds-air-5-pro?affid=smartpick",
            is_affiliate: true
          },
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B0CCNYJ74P",
            current_price: 4999,
            original_price: 7999,
            discount: 37,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B0CCNYJ74P?tag=smartpick-21",
            is_affiliate: true
          }
        ]
      },
      {
        id: "p_noise_buds_n1",
        name: "Noise Buds N1",
        brand: "Noise",
        category: "earbuds",
        model_number: "N1-CHR",
        description: "Premium chrome finish true wireless earbuds with 11mm drivers, 40 hours playtime, and ultra-low 43ms gaming latency.",
        image_url: "https://images.unsplash.com/photo-1628202926206-c63a34b1618f?w=600&auto=format&fit=crop&q=80",
        current_price: 1399,
        original_price: 3499,
        discount: 60,
        data_completeness: 95,
        status: "approved",
        best_for: ["budget buyers", "gaming", "study"],
        specs: [
          { key: "battery_life_buds", value: "7", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "40", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "11", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.3", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "Not available (Passive isolation only)", unit: null, confidence: "missing" },
          { key: "enc_mic_quality", value: "Quad mic with Environmental Noise Cancellation", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IPX5 water resistant", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "43ms Ultra-Low Latency", unit: null, confidence: "verified" },
          { key: "charging_case", value: "USB Type-C Instacharge (10m = 120m)", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year Brand Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "AAC, SBC", unit: null, confidence: "verified" }
        ],
        pros: [
          "Eye-catching chrome accent aesthetics look more expensive than \u20B91,399",
          "Fast 43ms latency makes it great for BGMI & FreeFire mobile gaming",
          "IPX5 sweat resistance handles gym sessions with ease",
          "Bluetooth 5.3 provides quick auto-connect"
        ],
        cons: [
          "No Active Noise Cancellation",
          "Chrome surface attracts fingerprints"
        ],
        review_insight: {
          positive: "Gaming latency is genuinely low with negligible audio lag in shooters.",
          negative: "Shiny chrome band gets oily with frequent fingertip touches.",
          summary: "83% positive score from young gamers and students.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B0CV3CYX2Y",
            current_price: 1399,
            original_price: 3499,
            discount: 60,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B0CV3CYX2Y?tag=smartpick-21",
            is_affiliate: true
          }
        ]
      },
      {
        id: "p_soundcore_life_p2i",
        name: "Soundcore by Anker Life P2i",
        brand: "Soundcore",
        category: "earbuds",
        model_number: "A3991",
        description: "Tuned by Anker audio engineers featuring 10mm drivers, dual EQ modes (Bass and Podcast), and 2 AI-enhanced beamforming microphones.",
        image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
        current_price: 1999,
        original_price: 3999,
        discount: 50,
        data_completeness: 97,
        status: "approved",
        best_for: ["calls", "study", "podcasts"],
        specs: [
          { key: "battery_life_buds", value: "8", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "28", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "10", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.2", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "Not available (Passive isolation only)", unit: null, confidence: "missing" },
          { key: "enc_mic_quality", value: "2 AI-enhanced mics with beamforming noise reduction", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IPX5 water resistant", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "Not available (Standard video sync)", unit: null, confidence: "missing" },
          { key: "charging_case", value: "USB Type-C Fast Charging (10m = 1h)", unit: null, confidence: "verified" },
          { key: "warranty", value: "18 Months Anker Brand Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "AAC, SBC, Dual EQ Hardware button switch", unit: null, confidence: "verified" }
        ],
        pros: [
          "Industry-best 18 months warranty coverage (6 months more than competitors)",
          "Physical button controls eliminate accidental touch triggers when adjusting",
          "Dedicated Podcast Mode enhances spoken voice clarity immensely",
          "Consistent microphone voice reproduction for online classes and remote work"
        ],
        cons: [
          "No Active Noise Cancellation",
          "Does not connect to Soundcore mobile app (hardware presets only)"
        ],
        review_insight: {
          positive: "Buttons prevent phantom touches; vocal EQ mode is stellar for audiobooks and online lectures.",
          negative: "Lack of app EQ means you rely on the two preset modes.",
          summary: "88% positive feedback, praised for long-term reliability and 18-month warranty.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Flipkart",
            retailer_url: "https://www.flipkart.com/soundcore-life-p2i",
            current_price: 1999,
            original_price: 3999,
            discount: 50,
            availability: "in_stock",
            affiliate_url: "https://www.flipkart.com/soundcore-life-p2i?affid=smartpick",
            is_affiliate: true
          },
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B09G3F3Q8Z",
            current_price: 2099,
            original_price: 3999,
            discount: 47,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B09G3F3Q8Z?tag=smartpick-21",
            is_affiliate: true
          }
        ]
      },
      {
        id: "p_wings_phantom_380",
        name: "Wings Phantom 380 Gaming",
        brand: "Wings",
        category: "earbuds",
        model_number: "WP-380",
        description: "Dedicated gamer TWS with 13mm high-fidelity drivers, 40ms ultra-low gaming latency, and dynamic RGB breathing light effects on case.",
        image_url: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=600&auto=format&fit=crop&q=80",
        current_price: 1499,
        original_price: 4999,
        discount: 70,
        data_completeness: 94,
        status: "approved",
        best_for: ["gaming", "budget buyers", "calls"],
        specs: [
          { key: "battery_life_buds", value: "8", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "50", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "13", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.3", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "Not available (Passive isolation only)", unit: null, confidence: "missing" },
          { key: "enc_mic_quality", value: "Quad Mic with ENC for clear in-game squad voice", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IPX5 water and sweat resistant", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "40ms Dedicated Game Mode", unit: null, confidence: "verified" },
          { key: "charging_case", value: "USB Type-C Bullet Charge", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year Wings Replacement Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "AAC, SBC", unit: null, confidence: "verified" }
        ],
        pros: [
          "Dedicated 40ms game mode delivers instant footstep and gunshot cues in battle royale games",
          "Futuristic open-case design with green breathing gaming LEDs",
          "Quad microphone allows clear squad communication on Discord and in-game chat",
          "Good 50 hours combined battery"
        ],
        cons: [
          "No Active Noise Cancellation",
          "Gamer design with LED lights may look informal in corporate office settings"
        ],
        review_insight: {
          positive: "Footstep detection in BGMI is pinpoint accurate; zero perceptible audio delay.",
          negative: "Case lights cannot be fully turned off while charging.",
          summary: "84% rating from mobile gaming streamers in India.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B0BYD8S380",
            current_price: 1499,
            original_price: 4999,
            discount: 70,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B0BYD8S380?tag=smartpick-21",
            is_affiliate: true
          }
        ]
      },
      {
        id: "p_crossbeats_revolt",
        name: "CrossBeats Revolt",
        brand: "CrossBeats",
        category: "earbuds",
        model_number: "CB-RVT",
        description: "Affordable hybrid active noise cancelling earbuds with 35dB noise attenuation, 6 microphones with environmental AI, and 10mm titanium drivers.",
        image_url: "https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=600&auto=format&fit=crop&q=80",
        current_price: 2199,
        original_price: 5999,
        discount: 63,
        data_completeness: 95,
        status: "approved",
        best_for: ["gym", "daily commute", "calls", "music"],
        specs: [
          { key: "battery_life_buds", value: "8", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "48", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "10", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.3", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "35dB Hybrid Active Noise Cancellation", unit: null, confidence: "verified" },
          { key: "enc_mic_quality", value: "6-mic array with AI Environmental Noise Cancellation", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IPX5 water resistant", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "40ms Low Latency Game Mode", unit: null, confidence: "verified" },
          { key: "charging_case", value: "USB Type-C Fast Charge (10m = 100m)", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year CrossBeats Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "AAC, SBC", unit: null, confidence: "verified" }
        ],
        pros: [
          "35dB Hybrid ANC at just \u20B92,199 is aggressive value",
          "6-mic setup isolates spoken voice well from background murmur",
          "IPX5 sweat resistance and secure in-ear lock wings",
          "Snappy 40ms low latency gaming mode"
        ],
        cons: [
          "Lacks companion smartphone app for firmware updates",
          "Earbud tips run slightly large in small ear canals"
        ],
        review_insight: {
          positive: "Great value for anyone wanting ANC under \u20B92,500 without sacrificing battery life.",
          negative: "No companion app to remap tap controls.",
          summary: "82% positive reviews from commuters.",
          confidence: "medium"
        },
        offers: [
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B0BTHY85X1",
            current_price: 2199,
            original_price: 5999,
            discount: 63,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B0BTHY85X1?tag=smartpick-21",
            is_affiliate: true
          }
        ]
      },
      {
        id: "p_mivi_duopods_k7",
        name: "Mivi DuoPods K7",
        brand: "Mivi",
        category: "earbuds",
        model_number: "TEDPK7-BLU",
        description: "Made in India true wireless earbuds featuring 13mm electro-dynamic drivers, AI-ENC dual microphones, and 50 hours of endurance.",
        image_url: "https://images.unsplash.com/photo-1574920162043-b872873f19c8?w=600&auto=format&fit=crop&q=80",
        current_price: 1099,
        original_price: 2999,
        discount: 63,
        data_completeness: 94,
        status: "approved",
        best_for: ["budget buyers", "study", "casual music"],
        specs: [
          { key: "battery_life_buds", value: "8.5", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "50", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "13", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.3", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "Not available (Passive isolation only)", unit: null, confidence: "missing" },
          { key: "enc_mic_quality", value: "AI-ENC Dual Microphones", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IPX4 splash proof", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "50ms Low Latency Mode", unit: null, confidence: "verified" },
          { key: "charging_case", value: "USB Type-C Fast Charge (10m = 500m)", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year Mivi Domestic Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "AAC, SBC", unit: null, confidence: "verified" }
        ],
        pros: [
          "Ultra-affordable entry price point of \u20B91,099",
          "Manufactured locally in India with reliable customer service",
          "Long 8.5 hours single charge battery life",
          "Decent vocal clarity for YouTube lectures and casual phone calls"
        ],
        cons: [
          "No Active Noise Cancellation",
          "Plastic hinge on the lid feels somewhat delicate if dropped"
        ],
        review_insight: {
          positive: "Superb for the price; users love supporting an Indian brand with solid battery performance.",
          negative: "Lid hinge has a slight wobble after several months of use.",
          summary: "80% customer approval across over 100,000 unit sales.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Flipkart",
            retailer_url: "https://www.flipkart.com/mivi-duopods-k7",
            current_price: 1099,
            original_price: 2999,
            discount: 63,
            availability: "in_stock",
            affiliate_url: "https://www.flipkart.com/mivi-duopods-k7?affid=smartpick",
            is_affiliate: true
          },
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B0BFBNV2TY",
            current_price: 1149,
            original_price: 2999,
            discount: 61,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B0BFBNV2TY?tag=smartpick-21",
            is_affiliate: true
          }
        ]
      },
      {
        id: "p_boat_airdopes_413_anc",
        name: "boAt Airdopes 413 ANC",
        brand: "boAt",
        category: "earbuds",
        model_number: "AD413-ANC-BLK",
        description: "Branded active noise cancelling earbuds with 25dB hybrid ANC, ENx dual mic technology, 10mm drivers, and signature boAt sound.",
        image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        current_price: 2499,
        original_price: 5990,
        discount: 58,
        data_completeness: 96,
        status: "approved",
        best_for: ["music", "study", "daily commute"],
        specs: [
          { key: "battery_life_buds", value: "6", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "20", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "10", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.2", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "25dB Hybrid Active Noise Cancellation", unit: null, confidence: "verified" },
          { key: "enc_mic_quality", value: "Dual mic with ENx technology", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IPX4 sweat and splash resistant", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "Not available (Standard video sync)", unit: null, confidence: "missing" },
          { key: "charging_case", value: "USB Type-C ASAP Charge (10m = 60m)", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year boAt Replacement Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "SBC, AAC", unit: null, confidence: "verified" }
        ],
        pros: [
          "Branded 25dB ANC dampens ceiling fan hum and road traffic murmur",
          "boAt Signature Sound provides deep, punchy Bollywood and EDM bass",
          "Touch gestures respond quickly for toggling ANC on/off and ambient mode",
          "Widespread service center network in India"
        ],
        cons: [
          "Total battery life of 20 hours is on the lower side when ANC is left enabled",
          "Case is somewhat bulky"
        ],
        review_insight: {
          positive: "Good entry ANC for study tables and library cubicles.",
          negative: "Battery drains noticeably quicker with ANC on (around 4.5h per charge).",
          summary: "81% positive ratings on Amazon India.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B0B7J4C3W9",
            current_price: 2499,
            original_price: 5990,
            discount: 58,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B0B7J4C3W9?tag=smartpick-21",
            is_affiliate: true
          },
          {
            retailer_name: "Croma",
            retailer_url: "https://www.croma.com/boat-airdopes-413-anc",
            current_price: 2599,
            original_price: 5990,
            discount: 56,
            availability: "in_stock",
            affiliate_url: "https://www.croma.com/boat-airdopes-413-anc?utm_source=smartpick",
            is_affiliate: false
          }
        ]
      },
      {
        id: "p_skullcandy_dime_2",
        name: "Skullcandy Dime 2",
        brand: "Skullcandy",
        category: "earbuds",
        model_number: "S2DBW-P740",
        description: "Ultra-compact true wireless earbuds with built-in Tile finding technology, microphone in each bud, and Skullcandy Supreme Sound.",
        image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
        current_price: 2799,
        original_price: 4999,
        discount: 44,
        data_completeness: 97,
        status: "approved",
        best_for: ["music", "travel", "street style"],
        specs: [
          { key: "battery_life_buds", value: "3.5", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "12", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "6", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.2", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "Not available (Noise-isolating fit only)", unit: null, confidence: "missing" },
          { key: "enc_mic_quality", value: "Standard omni mic in each bud", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IPX4 sweat and water resistant", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "Not available (Standard video sync)", unit: null, confidence: "missing" },
          { key: "charging_case", value: "Micro USB / Keychain case with integrated Tile finder", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year Skullcandy Domestic Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "SBC, AAC, Skullcandy Supreme Sound", unit: null, confidence: "verified" }
        ],
        pros: [
          "Built-in Tile tracker means you can ring your earbuds if misplaced anywhere",
          "Tiny car-key-sized case clips easily onto backpacks or keyrings",
          "Vibrant, expressive sound tuning with punchy percussion",
          "Use either bud solo independently"
        ],
        cons: [
          "Battery life is short (only 3.5h per charge, 12h total)",
          "No ANC",
          "Case uses Micro-USB instead of modern USB-C"
        ],
        review_insight: {
          positive: "The Tile tracking feature has saved countless users from losing their earbuds; tiny form factor is unbeatable.",
          negative: "Battery life is noticeably below modern 30-hour standards.",
          summary: "80% rating, highly recommended for commuters who frequently misplace small gadgets.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B09V7N86G7",
            current_price: 2799,
            original_price: 4999,
            discount: 44,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B09V7N86G7?tag=smartpick-21",
            is_affiliate: true
          }
        ]
      },
      {
        id: "p_jabra_elite_3",
        name: "Jabra Elite 3",
        brand: "Jabra",
        category: "earbuds",
        model_number: "100-99150000-40",
        description: "Engineered for rich sound and crystal-clear calls with 6mm speakers, 4-microphone call technology, HearThrough ambient listening, and IP55.",
        image_url: "https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=600&auto=format&fit=crop&q=80",
        current_price: 3999,
        original_price: 6999,
        discount: 42,
        data_completeness: 99,
        status: "approved",
        best_for: ["calls", "music", "gym", "work from home"],
        specs: [
          { key: "battery_life_buds", value: "7", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "28", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "6", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.2", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "Not available (Outstanding passive noise isolation + HearThrough)", unit: null, confidence: "missing" },
          { key: "enc_mic_quality", value: "4-Mic Call Technology with acoustic mesh", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IP55 water, dust, and rain resistant", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "Qualcomm aptX low-lag codec", unit: null, confidence: "verified" },
          { key: "charging_case", value: "USB Type-C Fast Charge (10m = 1h)", unit: null, confidence: "verified" },
          { key: "warranty", value: "2 Year Jabra Warranty against dust and water (via app)", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "Qualcomm aptX, SBC, Jabra Sound+ App", unit: null, confidence: "verified" }
        ],
        pros: [
          "Gold-standard 4-mic call clarity with wind protection mesh",
          "Qualcomm aptX codec provides CD-quality wireless audio reproduction",
          "Generous 2-year manufacturer warranty when registered in Jabra Sound+ app",
          "Danish ergonomic acoustic shape seals out passive noise exceptionally well"
        ],
        cons: [
          "No active noise cancellation (relies on snug passive seal)",
          "No AAC codec support (aptX and SBC only)"
        ],
        review_insight: {
          positive: "Best-in-class microphone quality for Microsoft Teams and business calling; 2-year warranty is peace of mind.",
          negative: "Apple iPhone users must stream on SBC codec as AAC is omitted.",
          summary: "89% score from business professionals and remote workers.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Amazon India",
            retailer_url: "https://www.amazon.in/dp/B09D15H64S",
            current_price: 3999,
            original_price: 6999,
            discount: 42,
            availability: "in_stock",
            affiliate_url: "https://www.amazon.in/dp/B09D15H64S?tag=smartpick-21",
            is_affiliate: true
          },
          {
            retailer_name: "Croma",
            retailer_url: "https://www.croma.com/jabra-elite-3",
            current_price: 4199,
            original_price: 6999,
            discount: 40,
            availability: "in_stock",
            affiliate_url: "https://www.croma.com/jabra-elite-3?utm_source=smartpick",
            is_affiliate: false
          }
        ]
      },
      {
        id: "p_noise_two_wireless",
        name: "Noise Buds VS204",
        brand: "Noise",
        category: "earbuds",
        model_number: "VS204-TRQ",
        description: "Everyday workhorse with 50 hours of total playtime, 13mm dynamic drivers, and full environmental noise cancellation with Tru Bass.",
        image_url: "https://images.unsplash.com/photo-1628202926206-c63a34b1618f?w=600&auto=format&fit=crop&q=80",
        current_price: 1349,
        original_price: 3999,
        discount: 66,
        data_completeness: 94,
        status: "approved",
        best_for: ["budget buyers", "calls", "study"],
        specs: [
          { key: "battery_life_buds", value: "10", unit: "hours", confidence: "verified" },
          { key: "total_battery_life", value: "50", unit: "hours", confidence: "verified" },
          { key: "driver_size", value: "13", unit: "mm", confidence: "verified" },
          { key: "bluetooth_version", value: "5.3", unit: null, confidence: "verified" },
          { key: "anc_rating", value: "Not available (Passive isolation only)", unit: null, confidence: "missing" },
          { key: "enc_mic_quality", value: "Dual mic with Environmental Noise Cancellation", unit: null, confidence: "verified" },
          { key: "water_resistance", value: "IPX5 water resistant", unit: null, confidence: "verified" },
          { key: "low_latency_gaming", value: "60ms Gaming Mode", unit: null, confidence: "verified" },
          { key: "charging_case", value: "USB Type-C Instacharge (10m = 120m)", unit: null, confidence: "verified" },
          { key: "warranty", value: "1 Year Domestic Brand Warranty", unit: null, confidence: "verified" },
          { key: "audio_codec", value: "AAC, SBC", unit: null, confidence: "verified" }
        ],
        pros: [
          "Up to 10 hours continuous playback from each earbud",
          "IPX5 water resistance protects against gym sweat and showers",
          "Fast Instacharge feature for hurried mornings",
          "Affordable price with modern Bluetooth 5.3"
        ],
        cons: [
          "No Active Noise Cancellation",
          "Microphone has slight robotic compression in loud wind"
        ],
        review_insight: {
          positive: "10 hours single-charge battery is ideal for night-owl study marathons.",
          negative: "Earbud stem is slightly on the longer side.",
          summary: "82% positive reviews across 12,000 verified buyers.",
          confidence: "high"
        },
        offers: [
          {
            retailer_name: "Flipkart",
            retailer_url: "https://www.flipkart.com/noise-buds-vs204",
            current_price: 1349,
            original_price: 3999,
            discount: 66,
            availability: "in_stock",
            affiliate_url: "https://www.flipkart.com/noise-buds-vs204?affid=smartpick",
            is_affiliate: true
          }
        ]
      }
    ];
    this.data.products = [];
    this.data.product_specifications = [];
    this.data.product_pros_cons = [];
    this.data.retailer_offers = [];
    this.data.price_history = [];
    this.data.reviews_insights = [];
    seedEarbuds.forEach((item, pIndex) => {
      const product = {
        id: item.id,
        name: item.name,
        brand: item.brand,
        category: item.category,
        model_number: item.model_number,
        description: item.description,
        image_url: item.image_url,
        created_at: now,
        updated_at: now,
        data_source: "Official brand spec sheet & authorized Indian retail catalogs",
        last_checked_at: lastChecked,
        data_completeness_score: item.data_completeness,
        status: item.status
      };
      this.data.products.push(product);
      item.specs.forEach((sp, sIdx) => {
        this.data.product_specifications.push({
          id: `spec_${item.id}_${sIdx}`,
          product_id: item.id,
          spec_key: sp.key,
          spec_value: sp.value,
          unit: sp.unit,
          source: "Brand Tech Specifications & Bureau of Indian Standards (BIS)",
          confidence: sp.confidence,
          created_at: now,
          updated_at: now
        });
      });
      item.pros.forEach((pro, prIdx) => {
        this.data.product_pros_cons.push({
          id: `pc_pro_${item.id}_${prIdx}`,
          product_id: item.id,
          type: "pro",
          text: pro,
          evidence_source: "Lab audio measurement & verified buyer reviews",
          confidence: "verified",
          created_at: now
        });
      });
      item.cons.forEach((con, cnIdx) => {
        this.data.product_pros_cons.push({
          id: `pc_con_${item.id}_${cnIdx}`,
          product_id: item.id,
          type: "con",
          text: con,
          evidence_source: "Independent testing & user feedback logs",
          confidence: "verified",
          created_at: now
        });
      });
      this.data.reviews_insights.push({
        id: `rev_${item.id}`,
        product_id: item.id,
        positive_theme: item.review_insight.positive,
        negative_theme: item.review_insight.negative,
        summary: item.review_insight.summary,
        evidence_source: "Aggregated from 500+ verified customer purchases across India",
        confidence: item.review_insight.confidence,
        generated_at: now
      });
      item.offers.forEach((off, oIdx) => {
        const offerId = `off_${item.id}_${oIdx}`;
        this.data.retailer_offers.push({
          id: offerId,
          product_id: item.id,
          retailer_name: off.retailer_name,
          retailer_url: off.retailer_url,
          current_price: off.current_price,
          original_price: off.original_price,
          discount_percentage: off.discount,
          availability_status: off.availability,
          affiliate_url: off.affiliate_url,
          is_affiliate: off.is_affiliate,
          last_checked_at: lastChecked,
          data_source: `${off.retailer_name} Store API Verified Partner`
        });
        const hist1 = Math.round(off.current_price * 1.08);
        const hist2 = Math.round(off.current_price * 1.15);
        const hist3 = Math.round(off.current_price * 0.98);
        this.data.price_history.push(
          {
            id: `ph_${offerId}_1`,
            offer_id: offerId,
            product_id: item.id,
            price: hist2,
            recorded_at: "2024-11-15T08:00:00.000Z",
            source: "Daily Price Crawler",
            notes: "Diwali Festival Sale"
          },
          {
            id: `ph_${offerId}_2`,
            offer_id: offerId,
            product_id: item.id,
            price: hist1,
            recorded_at: "2025-01-20T12:00:00.000Z",
            source: "Republic Day Sale Crawl",
            notes: "Republic Day Offers"
          },
          {
            id: `ph_${offerId}_3`,
            offer_id: offerId,
            product_id: item.id,
            price: hist3,
            recorded_at: "2025-03-10T14:30:00.000Z",
            source: "Holi Flash Sale Record",
            notes: "Holi Limited Deal"
          },
          {
            id: `ph_${offerId}_4`,
            offer_id: offerId,
            product_id: item.id,
            price: off.current_price,
            recorded_at: "2025-05-18T10:30:00.000Z",
            source: "Current Verified Price Snapshot",
            notes: "Current regular price"
          }
        );
      });
    });
    const defaultPasswordHash = "$2a$10$7Z8bU7Z8bU7Z8bU7Z8bU7e7qK9ZJ3pY2R5wK0l9iO8uP7aM3x1yZu";
    this.data.users = [
      {
        id: "usr_admin",
        email: "admin@smartpick.in",
        hashed_password: defaultPasswordHash,
        full_name: "SmartPick Admin",
        role: "admin",
        created_at: now,
        is_active: true,
        privacy_preferences_json: JSON.stringify({ allow_analytics: true, personalized_recommendations: true })
      },
      {
        id: "usr_demo",
        email: "shopper@smartpick.in",
        hashed_password: defaultPasswordHash,
        full_name: "Rahul Sharma",
        role: "user",
        created_at: now,
        is_active: true,
        privacy_preferences_json: JSON.stringify({ allow_analytics: true, personalized_recommendations: true })
      }
    ];
    this.data.wishlists = [
      {
        id: "wl_demo_1",
        user_id: "usr_demo",
        name: "My Saved Products",
        created_at: now
      }
    ];
    this.data.wishlist_items = [
      {
        id: "wli_demo_1",
        wishlist_id: "wl_demo_1",
        product_id: "p_oneplus_nord_buds_2",
        created_at: now
      },
      {
        id: "wli_demo_2",
        wishlist_id: "wl_demo_1",
        product_id: "p_cmf_by_nothing_buds",
        created_at: now
      }
    ];
    this.data.price_alerts = [
      {
        id: "alt_demo_1",
        user_id: "usr_demo",
        product_id: "p_realme_buds_air_5",
        target_price: 3200,
        is_active: true,
        created_at: now
      }
    ];
    this.data.issue_reports = [
      {
        id: "iss_seed_1",
        product_id: "p_boat_airdopes_141",
        offer_id: "off_p_boat_airdopes_141_0",
        user_id: "usr_demo",
        issue_type: "wrong_specification",
        description: "Previously listed Bluetooth 5.2, verified that boAt Airdopes 141 uses Bluetooth 5.1.",
        status: "resolved",
        created_at: "2025-04-10T11:20:00.000Z"
      }
    ];
    this.addAuditLog("system", "seed_database", "system", "all", { seeded_products_count: seedEarbuds.length });
    this.save();
    console.log(`SmartPick database seeded with ${seedEarbuds.length} realistic earbuds under \u20B95000.`);
  }
}
const db = new SmartPickDatabase();
export {
  db
};
