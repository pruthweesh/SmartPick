# SmartPick Deployment Guide: Vercel (Frontend) & Render (FastAPI Backend)

This guide provides end-to-end instructions for deploying the **SmartPick** full-stack application with a decoupled production architecture:
- **Frontend**: React + Vite + TypeScript hosted on **Vercel**
- **Backend**: FastAPI + SQLAlchemy + Uvicorn hosted on **Render**

---

## Architecture Overview

```
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│     Vercel (React Frontend)     │           │     Render (FastAPI Backend)    │
│  https://smartpick.vercel.app   │ ────────> │ https://smartpick.onrender.com  │
│                                 │   CORS    │                                 │
│  - Static Assets (Vite dist)    │  Headers  │  - Uvicorn / FastAPI ASGI App   │
│  - Client Routing (vercel.json) │           │  - SQLAlchemy SQLite / Postgres │
└─────────────────────────────────┘           └─────────────────────────────────┘
```

---

## Part 1: Deploying the FastAPI Backend on Render

You can deploy the backend using either **Method A (Render Blueprint - Recommended)** or **Method B (Manual Web Service)**.

### Method A: 1-Click Render Blueprint (Recommended)
This repository includes a `render.yaml` blueprint file at the root.

1. Push your repository to **GitHub** or **GitLab**.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** → **Blueprint**.
4. Select your repository.
5. Render automatically reads `render.yaml` and configures:
   - Service Name: `smartpick-fastapi-backend`
   - Root Directory: `backend/python`
   - Build Command: `pip install -r requirements.txt && python seed.py`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Environment variables (auto-generates `JWT_SECRET`).
6. Click **Apply**.

---

### Method B: Manual Web Service Setup on Render

1. Go to [Render Dashboard](https://dashboard.render.com) and click **New +** → **Web Service**.
2. Connect your Git repository.
3. Configure the service settings:

| Setting | Value |
|---|---|
| **Name** | `smartpick-fastapi-backend` (or your chosen name) |
| **Region** | Oregon (US West) or Singapore / Frankfurt (choose closest to target users) |
| **Branch** | `main` |
| **Root Directory** | `backend/python` *(CRITICAL: do not leave blank)* |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt && python seed.py` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | Free (or Starter for 24/7 uptime) |

4. Under **Advanced** → **Health Check Path**, set:
   ```
   /api/health
   ```

---

### Backend Environment Variables on Render

In your Render Web Service dashboard, go to the **Environment** tab and add the following variables:

| Variable Name | Required | Example / Recommended Value | Description |
|---|---|---|---|
| `PORT` | Auto | *(Auto-assigned by Render)* | Render automatically injects this. Do not hardcode 8000. |
| `PYTHON_VERSION` | Yes | `3.11.9` | Ensures consistent Python runtime version. |
| `ENVIRONMENT` | Yes | `production` | Sets server runtime mode. |
| `JWT_SECRET` | Yes | `32+ character random hex string` | Cryptographic secret for signing JWTs. Click **Generate** in Render. |
| `CORS_ALLOWED_ORIGINS` | Yes | `https://your-app.vercel.app,http://localhost:3000` | Comma-separated allowed frontend origins. |
| `DATABASE_URL` | Optional | `sqlite:///./smartpick.db` | Database URI. Use SQLite for free testing or Render Postgres URL for persistence. |
| `GEMINI_API_KEY` | Optional | `AIzaSy...` | Required for live Gemini AI query understanding & advice generation. |

---

### Database Persistence on Render

- **Default (SQLite)**: On Render's Free tier, the filesystem is ephemeral. If the service restarts or re-deploys, changes made after the initial seed script may reset.
- **For Production Data Persistence**:
  1. Click **New +** → **PostgreSQL** in Render.
  2. Copy the **Internal Database URL** (e.g. `postgresql://user:pass@dpg-xxx:5432/smartpick`).
  3. Set `DATABASE_URL` in your Web Service environment variables to this URL.

---

### Common Render Backend Errors & Solutions

#### 1. Port Binding Error (`Address already in use` or Web Service fails health check)
- **Symptom**: Service deploys but times out waiting for port or crashes immediately.
- **Cause**: Hardcoded port like `uvicorn main:app --port 8000`.
- **Fix**: Always bind to Render's dynamic `$PORT` environment variable:
  ```bash
  uvicorn main:app --host 0.0.0.0 --port $PORT
  ```

#### 2. Relative Import Error during Seed (`attempted relative import with no known parent package`)
- **Symptom**: `ImportError: attempted relative import with no known parent package` when running `python seed.py`.
- **Fix**: Ensure `backend/seed.py` uses fallback imports:
  ```python
  try:
      from .database import engine, SessionLocal, Base
  except ImportError:
      from database import engine, SessionLocal, Base
  ```
  *(Already fixed in this codebase)*.

#### 3. Starlette CORS Wildcard Assertion (`Cannot use allow_origins=['*'] with allow_credentials=True`)
- **Symptom**: Server crashes on startup with `AssertionError`.
- **Cause**: W3C CORS specifications disallow wildcard `*` origins when credentials (cookies/auth headers) are enabled.
- **Fix**: Use explicit origin matching and regex in `backend/main.py`:
  ```python
  app.add_middleware(
      CORSMiddleware,
      allow_origins=allowed_origins_list,
      allow_origin_regex=r"https://.*\.vercel\.app",
      allow_credentials=True,
      allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allow_headers=["*"],
  )
  ```
  *(Already implemented in this codebase)*.

#### 4. Free Tier Spin-Down / 50-Second Cold Starts
- **Symptom**: Initial request takes 30–50 seconds after inactivity.
- **Cause**: Render Free tier spins down web services after 15 minutes of inactivity.
- **Fix**:
  - Use a free uptime monitor (e.g., UptimeRobot, CronJob.org) to ping `https://your-backend.onrender.com/api/health` every 10 minutes, OR
  - Upgrade to Render Starter plan ($7/mo) for zero spin-down.

---

## Part 2: Deploying the React Frontend on Vercel

### Step 1: Import Project to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** → **Project**.
2. Select your GitHub repository.

### Step 2: Configure Project Settings

| Setting | Value |
|---|---|
| **Framework Preset** | `Vite` (Vercel automatically detects this) |
| **Root Directory** | `frontend` (or `./` with root vercel.json) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` (or `frontend/dist` if building from workspace root) |
| **Install Command** | `npm install` |

---

### Step 3: Configure Frontend API Routing (Choose Option A or Option B)

#### Option A: Vercel Reverse Proxy Rewrites (Recommended - Zero CORS Hassle)
By using `vercel.json` rewrites, all `/api/*` browser calls stay on your Vercel domain (`https://smartpick.vercel.app/api/...`), and Vercel transparently proxies them to Render over server-side HTTPS. This eliminates browser CORS issues entirely!

Update your `vercel.json` rewrites:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://smartpick-fastapi-backend.onrender.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
*(Replace `https://smartpick-fastapi-backend.onrender.com` with your actual Render service URL).*

#### Option B: Direct API Base URL via Environment Variable
If you prefer direct cross-origin calls:
1. In Vercel Project Settings → **Environment Variables**, add:
   ```
   VITE_API_BASE_URL = https://smartpick-fastapi-backend.onrender.com
   ```
2. In your Render backend, make sure `CORS_ALLOWED_ORIGINS` includes your Vercel URL (e.g. `https://smartpick.vercel.app`).

---

### Step 4: Environment Variables on Vercel

In Vercel **Project Settings** → **Environment Variables**:

| Variable Name | Required | Example Value | Purpose |
|---|---|---|---|
| `VITE_API_BASE_URL` | Optional (if using direct calls) | `https://smartpick-fastapi-backend.onrender.com` | Base URL for API requests. Leave blank if using `vercel.json` proxy rewrites. |
| `NODE_ENV` | Optional | `production` | Vite build mode. |

---

### Common Vercel Frontend Errors & Solutions

#### 1. 404 Not Found on Page Refresh (`/products`, `/advisor`, `/compare`)
- **Symptom**: Navigating inside the app works, but pressing Refresh (F5) or typing a URL gives a Vercel 404 page.
- **Cause**: Single Page Applications (SPAs) use client-side routing. Vercel looks for a physical file like `/products/index.html` which does not exist.
- **Fix**: The included `vercel.json` routes all non-asset requests back to `/index.html`:
  ```json
  {
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```

#### 2. Mixed Content Warning (`Blocked loading mixed active content`)
- **Symptom**: API calls fail in production with browser console error `Mixed Content: The page was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 'http://...'`.
- **Cause**: Vercel serves the app over `https://`, but the backend was configured with `http://`.
- **Fix**: Always specify `https://` in your Render backend URL (e.g. `https://your-backend.onrender.com`).

#### 3. CORS Error: `No 'Access-Control-Allow-Origin' header is present`
- **Symptom**: Red error in browser console blocking API fetch requests.
- **Causes**:
  1. The Render backend does not list your Vercel URL in `CORS_ALLOWED_ORIGINS`.
  2. Preflight `OPTIONS` request returned a 4xx or 5xx code.
- **Fixes**:
  1. Add your Vercel domain to `CORS_ALLOWED_ORIGINS` on Render (e.g. `https://smartpick.vercel.app`).
  2. In `backend/main.py`, the `allow_origin_regex=r"https://.*\.vercel\.app"` pattern automatically accepts all Vercel production and preview deploy URLs.

#### 4. Environment Variables Not Available in React
- **Symptom**: `import.meta.env.API_URL` is undefined.
- **Cause**: Vite only exposes variables prefixed with `VITE_` to the client-side bundle.
- **Fix**: Rename variables to start with `VITE_` (e.g., `VITE_API_BASE_URL`).

---

## Part 3: Post-Deployment Verification Checklist

Once both services are deployed, verify system integrity with these test steps:

- [ ] **1. Backend Health Check**:
  Visit `https://your-backend.onrender.com/api/health` in your browser. Expected response:
  ```json
  {"status":"healthy","service":"SmartPick FastAPI Backend","version":"1.0.0"}
  ```
- [ ] **2. Catalog Products Query**:
  Visit `https://your-backend.onrender.com/api/products`. Verify it returns seeded products under ₹5,000.
- [ ] **3. Frontend Homepage & Deep Link Navigation**:
  Open `https://your-app.vercel.app`. Click into a product card, copy the URL (`/products/p_oneplus_nord_buds_2`), paste it into a new incognito window, and refresh. Verify the product details load without a 404.
- [ ] **4. User Authentication**:
  - Sign in using the seeded test account:
    - **Email**: `shopper@smartpick.in`
    - **Password**: `SmartPick2025!`
  - Verify the user greeting displays and the JWT token is stored.
- [ ] **5. Admin Role Access**:
  - Sign in using the admin account:
    - **Email**: `admin@smartpick.in`
    - **Password**: `SmartPick2025!`
  - Navigate to `/admin`. Verify catalog metrics, crawler feed status, and audit logs are accessible.
- [ ] **6. AI Advisor Recommendations**:
  - Go to `/advisor`, enter a natural language prompt (e.g., *"Earbuds under ₹3000 with ANC for daily office calls"*).
  - Verify that matching products and transparent score breakdowns are returned.


### backend cmd

cd C:\Users\PRUTHWEESH\Downloads\smartpick\backend\python
.\.venv\Scripts\Activate
.\.venv\Scripts\uvicorn.exe main:app --host 127.0.0.1 --port 8000 --reload
