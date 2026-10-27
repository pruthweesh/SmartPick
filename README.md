# SmartPick — Trust-First AI Shopping Advisor for Electronics (India V1)

SmartPick is an AI-powered shopping advisor and comparison platform for consumer electronics and accessories in India. Instead of overwhelming buyers with hundreds of sponsored or generic listings, SmartPick asks smart clarifying questions, applies hard mathematical filters, and recommends only **3–5 suitable products** with transparent trade-offs, lab-verified specifications, and live retailer offer comparisons.

---

## 1. Project Overview & Philosophy

- **Fiduciary Advisor, Not an Ad Marketplace**: Zero fake countdown timers, zero deceptive discount banners, and zero hidden sponsored rankings.
- **Strict Hard Filters**: If a user specifies a ₹2,000 budget, products priced at ₹2,100 are strictly eliminated rather than surfaced as "sponsored".
- **Transparent 6-Factor Scoring Formula**:
  - `35%` Intended Use-Case Fit (Mic isolation for calls, latency for gaming, bass for music)
  - `25%` Value for Money (Actual discount % and price-to-features headroom)
  - `15%` Laboratory Specification Completeness
  - `10%` Evidence Quality & BIS Certification Alignment
  - `10%` User Usage Priority Match
  - `5%` Verified Buyer Sentiment Confidence
- **V1 Scope**: Focused on **20 realistic, popular true wireless earbuds under ₹5,000 in India** (OnePlus, Realme, boAt, Oppo, CMF by Nothing, Sony, JBL, Boult, Soundcore, Noise, etc.). SmartPick does not process payments or handle shipping; users are linked directly to authorized retailers (Amazon India, Flipkart, Croma) to complete checkout.

---

## 2. Tech Stack

- **Frontend**: React (Vite), React Router v7, Tailwind CSS v4, Lucide Icons.
- **Backend Options**:
  - **Node.js/Express (Active Full-Stack Engine)**: Express + TypeScript server (`server.ts`) with live Vite middlewares on port 3000, serving REST endpoints and Google Gemini AI advisor integration.
  - **Python FastAPI (Production Alternative)**: Complete Python FastAPI codebase located in `/backend` using SQLAlchemy ORM, Pydantic v2 schemas, and Pytest.
- **Database**: SQLite V1 with all 14 relational tables, foreign keys, timestamps, and realistic seed data.
- **AI Agent**: Google Gemini API via `@google/genai` (SDK model `gemini-3.8-flash`) with strict grounding rules preventing hallucination.
- **Authentication**: JWT-based authentication for optional user profiles, price drop alerts, and wishlists.
- **Styling**: Modern, responsive, mobile-first design with light/dark theme toggle and accessible WCAG AA contrast.

---

## 3. Folder Structure

```
smartpick/
├── frontend/                       # React + Vite Frontend Application
│   ├── public/                     # Static frontend assets
│   ├── src/                        # Client source code
│   │   ├── assets/                 # Images & local static resources
│   │   ├── components/             # Reusable UI components
│   │   ├── context/                # AppContext (Auth, theme, compare, toast)
│   │   ├── pages/                  # Application pages & routes
│   │   ├── App.tsx                 # Client router & page layout
│   │   ├── index.css               # Tailwind CSS & theme styling
│   │   └── main.tsx                # React DOM entry point
│   ├── index.html                  # HTML template for Vite
│   ├── package.json                # Frontend client dependencies & scripts
│   ├── tsconfig.json               # Frontend TypeScript configuration
│   ├── vercel.json                 # Frontend Vercel routing rules
│   └── vite.config.ts              # Frontend Vite configuration
├── backend/                        # Backend Application Services
│   ├── node/                       # Node.js + Express Active Backend
│   │   ├── ai.ts                   # Gemini AI prompt & grounding service
│   │   ├── config.ts               # Environment configuration & secrets
│   │   ├── db.ts                   # Database adapter & persistence
│   │   ├── recommendationEngine.ts # 6-factor recommendation engine
│   │   ├── routes.ts               # Express REST API routes
│   │   ├── security.ts             # Rate limiting, CORS, & JWT auth
│   │   ├── server.ts               # Express server entry point + Vite dev middleware
│   │   ├── package.json            # Node backend dependencies
│   │   └── tsconfig.json           # Node backend TypeScript configuration
│   ├── python/                     # Python FastAPI Backend Production Alternative
│   │   ├── database.py             # SQLite SQLAlchemy engine configuration
│   │   ├── main.py                 # FastAPI application entry point
│   │   ├── models.py               # 14 Database table models
│   │   ├── requirements.txt        # Python dependencies
│   │   ├── schemas.py              # Pydantic request/response schemas
│   │   ├── seed.py                 # Database seeder for 20 earbuds
│   │   ├── migrate_all_categories.py
│   │   ├── migrate_seed_sqlite.py
│   │   ├── smartpick.db            # Seeded SQLite database
│   │   ├── Procfile                # Production process definition
│   │   └── tests/                  # Pytest suite
│   │       └── test_api.py
│   └── data/                       # Data Stores
│       ├── smartpick_store.json    # Relational JSON store
│       └── smartpick.db            # SQLite relational database
├── .gitignore                      # Git ignore patterns
├── DEPLOYMENT.md                   # Vercel & Render deployment guide
├── metadata.json                   # Applet configuration & permissions
├── package.json                    # Workspace runner scripts (delegates to frontend & backend)
├── README.md                       # Documentation
└── render.yaml                     # Render deployment blueprint (backend/python)
```

---

## 4. Database Schema (All 14 Tables)

1. `users` (id, email, hashed_password, full_name, role, created_at, is_active, privacy_preferences_json)
2. `products` (id, name, brand, category, model_number, description, image_url, data_source, last_checked_at, data_completeness_score, status)
3. `product_specifications` (id, product_id, spec_key, spec_value, unit, source, confidence, created_at)
4. `product_pros_cons` (id, product_id, type, text, evidence_source, confidence, created_at)
5. `retailer_offers` (id, product_id, retailer_name, retailer_url, current_price, original_price, discount_percentage, availability_status, affiliate_url, is_affiliate, last_checked_at)
6. `price_history` (id, offer_id, product_id, price, recorded_at, source, notes)
7. `reviews_insights` (id, product_id, positive_theme, negative_theme, summary, evidence_source, confidence)
8. `user_preferences` (id, user_id, category, budget_min, budget_max, intended_use, must_have_features_json, deal_breakers_json, preferred_brands_json)
9. `wishlists` (id, user_id, name, created_at)
10. `wishlist_items` (id, wishlist_id, product_id, created_at)
11. `price_alerts` (id, user_id, product_id, target_price, is_active, created_at)
12. `recommendation_sessions` (id, user_id, session_id, user_query, extracted_requirements_json, recommended_product_ids_json, ai_explanation, created_at)
13. `issue_reports` (id, product_id, offer_id, user_id, issue_type, description, status, created_at)
14. `audit_logs` (id, actor, action, entity_type, entity_id, metadata_json, created_at)

---

## 5. Local Setup Instructions

### Environment Variables
Copy `.env.example` to `.env`:
```bash
GEMINI_API_KEY="your-google-gemini-api-key"
PORT=3000
JWT_SECRET="your-jwt-secret-key"
```

### Option A: Running Full-Stack via Node/Express (Recommended)
```bash
# 1. Install dependencies
npm install

# 2. Start full-stack dev server on port 3000
npm run dev
```
Open `http://localhost:3000` in your browser.

### Option B: Running Python FastAPI Backend
```bash
# 1. Navigate to backend directory and install Python dependencies
pip install -r backend/requirements.txt

# 2. Seed SQLite database with 20 realistic earbuds
python -m backend.seed

# 3. Run FastAPI with Uvicorn
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive Swagger API documentation will be available at `http://localhost:8000/docs`.

### Running Tests
- **Python Pytest**:
  ```bash
  pytest backend/tests/test_api.py -v
  ```
- **TypeScript / Build Verification**:
  ```bash
  npm run build
  ```

---

## 6. Pre-Seeded Test Credentials

For quick evaluation of protected user and administrator routes:
- **Shopper Account**:
  - Email: `shopper@smartpick.in`
  - Password: `SmartPick2025!`
- **Administrator Account**:
  - Email: `admin@smartpick.in`
  - Password: `SmartPick2025!`

*(Quick 1-click buttons to autofill these credentials are also provided on the `/account` and `/admin` pages).*

---

## 7. Deployment Instructions

### Deploying Frontend to Vercel or Netlify
1. Set the root directory or build output to `dist`.
2. Build command: `npm run build`.
3. Configure environment variable `VITE_API_BASE_URL` pointing to your deployed backend (or use serverless proxy).

### Deploying Backend to Render or Railway
- **Render / Railway (Node.js)**:
  - Build command: `npm install && npm run build`
  - Start command: `node server.ts` or `npm start`
  - Environment variables: `GEMINI_API_KEY`, `PORT=3000`, `NODE_ENV=production`.
- **Render / Railway (Python FastAPI)**:
  - Build command: `pip install -r backend/requirements.txt && python -m backend.seed`
  - Start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

---

## 8. Affiliate Disclosure (Section 13)

> “We may earn a commission if you purchase through certain retailer links. This does not affect our recommendation process. The final price, availability, shipping, returns, and refunds are controlled by the retailer.”

---

## 9. Known V1 Limitations

1. **Category Scope**: V1 catalog is curated for True Wireless Stereo (TWS) earbuds in India under ₹5,000. Smartwatches, laptops, and tablets are scheduled for V2.
2. **Retailer Availability**: Live offers are currently tracked across Amazon India, Flipkart, and Croma. Offline hypermarkets and regional retail stores are not yet mapped.
3. **No Direct Checkout**: SmartPick intentionally acts as an advisor; checkout occurs on authorized third-party retailer platforms.
