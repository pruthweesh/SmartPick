"""
SmartPick FastAPI Application Entry Point - Complete Endpoints
"""
import os
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
import uuid
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, Query, Header, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.hash import pbkdf2_sha256, bcrypt
import jwt
from config import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRES_DELTA

from database import engine, Base, get_db
from models import (
    Product, Category, ProductSpecification, ProductProCon, RetailerOffer,
    PriceHistory, ReviewsInsight, IssueReport, User, Wishlist,
    WishlistItem, PriceAlert, RecommendationSession, AuditLog, UserPreference,
    Cart, CartItem
)
from schemas import (
    UserRegister, UserLogin, TokenResponse, ProductDetailSchema, UserPreferenceResponse, UserPreferenceBase,
    RecommendationRequest, ClarifyRequest, IssueCreate, PriceAlertCreate, CompareRequest,
    CartItemCreate, OrderCreate
)
import advisor_engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartPick API",
    description="Trust-first AI shopping advisor for electronics and accessories in India",
    version="1.0.0"
)



# CORS configuration supporting production Vercel frontend domains, custom origins, and localhost
cors_origins_env = os.getenv("CORS_ALLOWED_ORIGINS", "")
allowed_origins_list = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]

if not allowed_origins_list:
    allowed_origins_list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

# If explicit wildcard is requested, credentials must be disabled per W3C CORS spec
allow_all = "*" in allowed_origins_list

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all else allowed_origins_list,
    allow_origin_regex=None if allow_all else r"https://.*\.vercel\.app",
    allow_credentials=not allow_all,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=86400,
)

def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authentication token")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(User).filter(User.id == payload.get("id")).first()
        if not user or not user.is_active:
            raise HTTPException(status_code=401, detail="User not found or deactivated")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Token invalid or expired")

# Health
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SmartPick FastAPI Backend",
        "version": "1.0.0"
    }

# 1. Auth Endpoints
@app.post("/api/auth/register", response_model=TokenResponse)
def register_user(data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")
    
    hashed = pbkdf2_sha256.hash(data.password)
    user_id = f"usr_{uuid.uuid4().hex[:10]}"
    new_user = User(
        id=user_id,
        email=data.email,
        hashed_password=hashed,
        full_name=data.full_name,
        phone=data.phone,
        role="admin" if "admin" in data.email.lower() else "user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = jwt.encode({"id": new_user.id, "email": new_user.email, "role": new_user.role, "exp": int((datetime.utcnow() + JWT_EXPIRES_DELTA).timestamp())}, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {"token": token, "user": {"id": new_user.id, "email": new_user.email, "full_name": new_user.full_name, "role": new_user.role}}

@app.post("/api/auth/login", response_model=TokenResponse)
def login_user(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password (support both pbkdf2_sha256 and bcrypt hashes)
    try:
        password_ok = pbkdf2_sha256.verify(data.password, user.hashed_password)
    except Exception:
        password_ok = bcrypt.verify(data.password, user.hashed_password)
    if not password_ok:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = jwt.encode({"id": user.id, "email": user.email, "role": user.role, "exp": int((datetime.utcnow() + JWT_EXPIRES_DELTA).timestamp())}, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {"token": token, "user": {"id": user.id, "email": user.email, "full_name": user.full_name, "role": user.role}}

@app.get("/api/auth/me")
def get_me(user: User = Depends(get_current_user)):
    return {"id": user.id, "email": user.email, "full_name": user.full_name, "role": user.role}

@app.get("/api/user/preferences")
def get_preferences(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pref = db.query(UserPreference).filter(UserPreference.user_id == user.id).first()
    if not pref:
        pref = UserPreference(user_id=user.id)
        db.add(pref)
        db.commit()
        db.refresh(pref)
    return UserPreferenceResponse.from_orm(pref)

@app.put("/api/user/preferences")
def update_preferences(prefs: UserPreferenceBase, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pref = db.query(UserPreference).filter(UserPreference.user_id == user.id).first()
    if not pref:
        pref = UserPreference(user_id=user.id)
        db.add(pref)
    for field, value in prefs.dict().items():
        setattr(pref, field, value)
    db.commit()
    db.refresh(pref)
    return UserPreferenceResponse.from_orm(pref)

@app.post("/api/auth/logout")
def logout_user():
    return {"message": "Logged out successfully"}

# 2. Products Endpoints
@app.get("/api/products")
def list_products(
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    brand: Optional[str] = None,
    search: Optional[str] = None,
    anc: Optional[str] = None,
    water_resistance: Optional[str] = None,
    gaming_mode: Optional[str] = None,
    min_battery: Optional[str] = None,
    sort: Optional[str] = "price_asc",
    page: int = 1,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.status == "approved")
    if category and str(category).lower() != "all":
        cat_norm = str(category).lower().strip()
        if cat_norm in ("smartphones", "smartphone"):
            query = query.filter(Product.category.in_(["smartphones", "smartphone"]))
        elif cat_norm in ("laptops", "laptop"):
            query = query.filter(Product.category.in_(["laptops", "laptop"]))
        elif cat_norm in ("audio", "audio & anc", "earbuds", "headphones"):
            query = query.filter(Product.category.in_(["audio", "earbuds", "headphones"]))
        elif cat_norm in ("smartwatches", "smartwatch", "watches"):
            query = query.filter(Product.category.in_(["smartwatches", "smartwatch"]))
        elif cat_norm in ("tablets", "tablet"):
            query = query.filter(Product.category.in_(["tablets", "tablet"]))
        elif cat_norm in ("smart-home", "smart_home", "smart-living", "smart living"):
            query = query.filter(Product.category.in_(["smart-home", "smart_home", "smart-living"]))
        else:
            query = query.filter(Product.category.ilike(cat_norm))

    if brand and brand != "All Brands":
        query = query.filter(Product.brand.ilike(brand))

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            Product.name.ilike(search_term) |
            Product.brand.ilike(search_term) |
            Product.model_number.ilike(search_term) |
            Product.description.ilike(search_term)
        )
    
    products = query.all()

    # Hardware Criteria filters
    if anc in ("true", "1", True):
        products = [
            p for p in products
            if any(
                s.spec_key == "anc_rating" and s.spec_value and not any(neg in s.spec_value.lower() for neg in ["not available", "none", "passive", "no"])
                for s in p.specifications
            ) or "anc" in p.name.lower() or "active noise" in p.description.lower() or "anc" in p.description.lower()
        ]

    if water_resistance in ("true", "1", True):
        products = [
            p for p in products
            if any(
                s.spec_key == "water_resistance" and s.spec_value and not any(neg in s.spec_value.lower() for neg in ["none", "no", "not available"])
                for s in p.specifications
            ) or any(w in p.description.lower() for w in ["ipx", "ip5", "ip6", "water resist", "5atm", "swimproof", "100m"])
        ]

    if gaming_mode in ("true", "1", True):
        products = [
            p for p in products
            if any(
                s.spec_key in ("gaming_mode", "low_latency", "refresh_rate")
                for s in p.specifications
            ) or any(g in (p.name + " " + p.description).lower() for g in ["low latency", "gaming", "120hz", "144hz", "165hz", "240hz", "rtx", "beast mode"])
        ]

    if min_battery:
        try:
            min_b = float(min_battery)
            filtered = []
            for p in products:
                bat_found = False
                for s in p.specifications:
                    if s.spec_key in ("battery_life", "total_battery_life", "runtime", "battery_charging"):
                        import re
                        nums = re.findall(r'\d+', s.spec_value)
                        if nums and float(nums[0]) >= min_b:
                            bat_found = True
                            break
                if bat_found or (min_b <= 20 and p.category in ("smartphones", "smartwatches")):
                    filtered.append(p)
            products = filtered
        except Exception:
            pass

    results = []
    for p in products:
        offers_data = [
            {
                "id": o.id,
                "retailer_name": o.retailer_name,
                "current_price": o.current_price,
                "original_price": o.original_price,
                "discount_percentage": o.discount_percentage,
                "affiliate_url": o.affiliate_url or o.retailer_url,
                "is_affiliate": o.is_affiliate
            }
            for o in p.offers
        ]
        best_price = min([o["current_price"] for o in offers_data]) if offers_data else 99999
        if min_price and best_price < min_price:
            continue
        if max_price and best_price > max_price:
            continue

        results.append({
            "id": p.id,
            "name": p.name,
            "brand": p.brand,
            "category": p.category,
            "model_number": p.model_number,
            "description": p.description,
            "image_url": p.image_url,
            "data_completeness_score": p.data_completeness_score,
            "status": p.status,
            "specifications": [{"id": s.id, "spec_key": s.spec_key, "spec_value": s.spec_value, "unit": s.unit, "confidence": s.confidence} for s in p.specifications],
            "pros_cons": [{"id": pc.id, "type": pc.type, "text": pc.text} for pc in p.pros_cons],
            "offers": offers_data
        })

    if sort == "price_asc":
        results.sort(key=lambda x: min([o["current_price"] for o in x["offers"]]) if x["offers"] else 0)
    elif sort == "price_desc":
        results.sort(key=lambda x: min([o["current_price"] for o in x["offers"]]) if x["offers"] else 0, reverse=True)
    elif sort == "completeness":
        results.sort(key=lambda x: x["data_completeness_score"], reverse=True)

    total = len(results)
    paginated = results[(page - 1) * limit : page * limit]
    return {"data": paginated, "meta": {"total": total, "page": page, "limit": limit}}

@app.get("/api/products/{product_id}")
def get_product(product_id: str, db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    return {
        "id": p.id,
        "name": p.name,
        "brand": p.brand,
        "category": p.category,
        "model_number": p.model_number,
        "description": p.description,
        "image_url": p.image_url,
        "data_completeness_score": p.data_completeness_score,
        "status": p.status,
        "last_checked_at": p.last_checked_at.isoformat() if p.last_checked_at else None,
        "specifications": [{"id": s.id, "spec_key": s.spec_key, "spec_value": s.spec_value, "unit": s.unit, "confidence": s.confidence} for s in p.specifications],
        "pros_cons": [{"id": pc.id, "type": pc.type, "text": pc.text} for pc in p.pros_cons],
        "offers": [
            {
                "id": o.id,
                "retailer_name": o.retailer_name,
                "current_price": o.current_price,
                "original_price": o.original_price,
                "discount_percentage": o.discount_percentage,
                "affiliate_url": o.affiliate_url or o.retailer_url,
                "is_affiliate": o.is_affiliate
            }
            for o in p.offers
        ],
        "reviews_insights": [
            {
                "id": r.id,
                "positive_theme": r.positive_theme,
                "negative_theme": r.negative_theme,
                "summary": r.summary,
                "confidence": r.confidence
            }
            for r in p.reviews_insights
        ]
    }

@app.get("/api/products/category/{category}")
def get_products_by_category(category: str, db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.category == category.lower(), Product.status == "approved").all()
    return {"category": category, "count": len(products), "products": [p.id for p in products]}

@app.get("/api/products/search")
def search_products(q: str = Query(""), db: Session = Depends(get_db)):
    q_str = f"%{q}%"
    products = db.query(Product).filter(
        Product.status == "approved",
        (Product.name.ilike(q_str) | Product.brand.ilike(q_str) | Product.description.ilike(q_str))
    ).all()
    return {"query": q, "count": len(products), "products": [p.id for p in products]}

@app.get("/api/products/{product_id}/offers")
def get_product_offers(product_id: str, db: Session = Depends(get_db)):
    offers = db.query(RetailerOffer).filter(RetailerOffer.product_id == product_id).all()
    return offers

@app.get("/api/products/{product_id}/price-history")
def get_product_price_history(product_id: str, db: Session = Depends(get_db)):
    history = db.query(PriceHistory).join(RetailerOffer).filter(RetailerOffer.product_id == product_id).all()
    return history

@app.get("/api/products/{product_id}/reviews-insights")
def get_reviews_insights(product_id: str, db: Session = Depends(get_db)):
    return db.query(ReviewsInsight).filter(ReviewsInsight.product_id == product_id).all()

# 3. Recommendations
@app.post("/api/recommendations")
def get_recommendations(req: RecommendationRequest, db: Session = Depends(get_db)):
    query_str = (req.query or "").strip()
    custom_req = req.requirements or {}
    
    # 1. Category extraction & normalization
    extracted_cat = advisor_engine.detect_category(query_str) if query_str else "all"
    category = custom_req.get("category") or req.category or extracted_cat or "all"
    if category in ["earbuds", "earphone", "headphones", "earphones"]:
        category = "audio"
    elif category in ["phone", "phones"]:
        category = "smartphones"
    elif category in ["laptop"]:
        category = "laptops"
    elif category in ["watch", "watches"]:
        category = "smartwatches"
    elif category in ["tablet"]:
        category = "tablets"
    elif category in ["smart living", "smart home", "smarthome"]:
        category = "smart-home"

    # 2. Budget extraction
    parsed_budget = advisor_engine.parse_budget_from_text(query_str)
    budget_max = (
        custom_req.get("budget_max")
        or req.budget_max
        or parsed_budget
        or advisor_engine.DEFAULT_BUDGET_MAP.get(category, 150000.0)
    )
    budget_max = float(budget_max)

    # 3. Intent and priority
    parsed_uses, parsed_prio, parsed_must = advisor_engine.detect_intent_and_priority(query_str)
    intended_use = custom_req.get("intended_use") or req.intended_use or parsed_uses
    usage_priority = custom_req.get("usage_priority") or req.usage_priority or parsed_prio
    must_have_features = custom_req.get("must_have_features") or req.must_have_features or parsed_must

    final_requirements = {
        "budget_max": budget_max,
        "category": category,
        "intended_use": intended_use,
        "must_have_features": must_have_features,
        "usage_priority": usage_priority
    }

    # 4. Query DB
    query = db.query(Product).filter(Product.status == "approved")
    if category != "all":
        query = query.filter(Product.category.ilike(category))
    products = query.all()

    candidates = []
    near_matches = []
    
    for p in products:
        price = advisor_engine.get_product_price(p)
        scored = advisor_engine.score_product_fit(p, final_requirements, query_str)
        
        has_anc = True
        if "anc" in must_have_features:
            anc_val = ""
            for s in p.specifications:
                if s.spec_key == "anc_rating":
                    anc_val = s.spec_value or ""
                    break
            if not anc_val or "passive" in anc_val.lower() or "not available" in anc_val.lower():
                has_anc = False

        if price <= budget_max and has_anc:
            candidates.append(scored)
        elif price <= budget_max * 1.35:
            scored_near = dict(scored)
            scored_near["match_score"] = max(70, scored["match_score"] - 8)
            near_matches.append(scored_near)

    candidates.sort(key=lambda x: x["match_score"], reverse=True)
    near_matches.sort(key=lambda x: x["match_score"], reverse=True)
    top_picks = candidates[:5]

    conflict_explanation = None
    if len(top_picks) == 0:
        cat_disp = category.replace("-", " ") if category != "all" else "product"
        conflict_explanation = (
            f"No verified {cat_disp} found strictly matching your ceiling of ₹{budget_max:,.0f}."
        )

    ai_explanation, is_gemini = advisor_engine.generate_synthesis_narrative(
        category=category,
        budget_max=budget_max,
        top_picks=top_picks,
        total_eligible=len(candidates),
        priority=usage_priority,
        query_str=query_str
    )

    clarifying_questions = advisor_engine.generate_clarifying_questions(category, query_str)

    return {
        "session_id": f"ses_{uuid.uuid4().hex[:8]}",
        "extracted_requirements": final_requirements,
        "clarifying_questions": clarifying_questions,
        "recommendations": top_picks,
        "near_matches": near_matches[:3],
        "conflict_explanation": conflict_explanation,
        "total_eligible": len(candidates),
        "ai_explanation": ai_explanation,
        "ai_powered": is_gemini
    }

@app.post("/api/recommendations/clarify")
def clarify_recommendations(req: ClarifyRequest, db: Session = Depends(get_db)):
    current_reqs = req.current_requirements or {}
    answers = req.answers or {}

    category = current_reqs.get("category", "all")
    budget_max = float(current_reqs.get("budget_max", 150000.0))
    usage_priority = current_reqs.get("usage_priority", "value")
    intended_use = list(current_reqs.get("intended_use", []))
    must_have_features = list(current_reqs.get("must_have_features", []))

    for q_id, ans in answers.items():
        ans_lower = ans.lower()
        if "camera" in ans_lower or "photo" in ans_lower:
            usage_priority = "camera"
            if "photography" not in intended_use:
                intended_use.append("photography")
        elif "gaming" in ans_lower or "performance" in ans_lower:
            usage_priority = "performance"
            if "gaming" not in intended_use:
                intended_use.append("gaming")
        elif "battery" in ans_lower:
            usage_priority = "battery"
            if "battery" not in intended_use:
                intended_use.append("battery")
        elif "coding" in ans_lower or "development" in ans_lower:
            usage_priority = "productivity"
            if "coding" not in intended_use:
                intended_use.append("coding")
        elif "anc" in ans_lower:
            if "anc" not in must_have_features:
                must_have_features.append("anc")
        elif "health" in ans_lower or "gps" in ans_lower:
            usage_priority = "fitness"

    updated_reqs = {
        "budget_max": budget_max,
        "category": category,
        "intended_use": intended_use,
        "must_have_features": must_have_features,
        "usage_priority": usage_priority
    }

    query = db.query(Product).filter(Product.status == "approved")
    if category != "all":
        query = query.filter(Product.category.ilike(category))
    products = query.all()

    candidates = []
    near_matches = []
    
    for p in products:
        price = advisor_engine.get_product_price(p)
        scored = advisor_engine.score_product_fit(p, updated_reqs, "")
        
        has_anc = True
        if "anc" in must_have_features:
            anc_val = ""
            for s in p.specifications:
                if s.spec_key == "anc_rating":
                    anc_val = s.spec_value or ""
                    break
            if not anc_val or "passive" in anc_val.lower() or "not available" in anc_val.lower():
                has_anc = False

        if price <= budget_max and has_anc:
            candidates.append(scored)
        elif price <= budget_max * 1.35:
            scored_near = dict(scored)
            scored_near["match_score"] = max(70, scored["match_score"] - 8)
            near_matches.append(scored_near)

    candidates.sort(key=lambda x: x["match_score"], reverse=True)
    near_matches.sort(key=lambda x: x["match_score"], reverse=True)
    top_picks = candidates[:5]

    conflict_explanation = None
    if len(top_picks) == 0:
        cat_disp = category.replace("-", " ") if category != "all" else "product"
        conflict_explanation = (
            f"No verified {cat_disp} found strictly matching your refined ceiling of ₹{budget_max:,.0f}."
        )

    ai_explanation, is_gemini = advisor_engine.generate_synthesis_narrative(
        category=category,
        budget_max=budget_max,
        top_picks=top_picks,
        total_eligible=len(candidates),
        priority=usage_priority,
        query_str=f"Refined {category} prioritizing {usage_priority}"
    )

    return {
        "session_id": f"ses_{uuid.uuid4().hex[:8]}",
        "updated_requirements": updated_reqs,
        "clarifying_questions": [],
        "recommendations": top_picks,
        "near_matches": near_matches[:3],
        "conflict_explanation": conflict_explanation,
        "total_eligible": len(candidates),
        "ai_explanation": ai_explanation,
        "ai_powered": is_gemini
    }

# 4. Comparison
@app.post("/api/compare")
def compare_products(req: CompareRequest, db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.id.in_(req.product_ids)).all()
    results = []
    for p in products:
        results.append({
            "id": p.id,
            "name": p.name,
            "brand": p.brand,
            "image_url": p.image_url,
            "category": p.category,
            "specifications": [{"spec_key": s.spec_key, "spec_value": s.spec_value} for s in p.specifications],
            "offers": [{"retailer_name": o.retailer_name, "current_price": o.current_price, "affiliate_url": o.affiliate_url or o.retailer_url} for o in p.offers]
        })
    cats = list(set([p.category for p in products if p.category]))
    cat_str = ", ".join(cats) if cats else "hardware models"
    return {
        "products": results,
        "ai_comparison": f"Comparing {len(results)} {cat_str}: Observe technical variations in verified laboratory benchmarks, retail pricing, and certified battery endurance."
    }

# 5. Wishlists & Price Alerts
@app.get("/api/wishlists")
def get_wishlist(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    wishlist = db.query(Wishlist).filter(Wishlist.user_id == user.id).first()
    if not wishlist:
        return {"items": []}
    return {"items": [{"id": i.id, "product_id": i.product_id} for i in wishlist.items]}

@app.post("/api/wishlists")
@app.post("/api/wishlists/{wishlist_id}/items")
def add_to_wishlist(payload: Dict[str, Any], wishlist_id: Optional[str] = None, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    product_id = payload.get("product_id")
    if not product_id:
        raise HTTPException(status_code=400, detail="product_id is required")
    wishlist = db.query(Wishlist).filter(Wishlist.user_id == user.id).first()
    if not wishlist:
        wishlist = Wishlist(id=f"wl_{uuid.uuid4().hex[:8]}", user_id=user.id)
        db.add(wishlist)
        db.commit()
    
    item = WishlistItem(id=f"wli_{uuid.uuid4().hex[:8]}", wishlist_id=wishlist.id, product_id=product_id)
    db.add(item)
    db.commit()
    return {"item": {"id": item.id, "product_id": item.product_id}}

@app.delete("/api/wishlists/{wishlist_id}/items/{item_id}")
def delete_wishlist_item(wishlist_id: str, item_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(WishlistItem).join(Wishlist).filter(Wishlist.user_id == user.id, (WishlistItem.id == item_id) | (WishlistItem.product_id == item_id)).first()
    if item:
        db.delete(item)
        db.commit()
    return {"success": True}

@app.get("/api/price-alerts")
def get_alerts(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    alerts = db.query(PriceAlert).filter(PriceAlert.user_id == user.id).all()
    return {"alerts": [{"id": a.id, "product_id": a.product_id, "target_price": a.target_price} for a in alerts]}

@app.post("/api/price-alerts")
def create_alert(data: PriceAlertCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    alert = PriceAlert(id=f"alt_{uuid.uuid4().hex[:8]}", user_id=user.id, product_id=data.product_id, target_price=data.target_price)
    db.add(alert)
    db.commit()
    return {"id": alert.id, "product_id": alert.product_id, "target_price": alert.target_price}

@app.delete("/api/price-alerts/{alert_id}")
def delete_alert(alert_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    alert = db.query(PriceAlert).filter(PriceAlert.user_id == user.id, PriceAlert.id == alert_id).first()
    if alert:
        db.delete(alert)
        db.commit()
    return {"success": True}
# Cart Endpoints
@app.get("/api/cart")
def get_cart(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart = db.query(Cart).filter(Cart.user_id == user.id).first()
    if not cart:
        cart = Cart(id=f"cart_{uuid.uuid4().hex[:8]}", user_id=user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    items = []
    for ci in cart.items:
        items.append({
            "id": ci.id,
            "product_id": ci.product_id,
            "quantity": ci.quantity,
            "added_at": ci.added_at,
        })
    return {"id": cart.id, "user_id": cart.user_id, "items": items, "created_at": cart.created_at}

@app.post("/api/cart/items")
def add_cart_item(payload: CartItemCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart = db.query(Cart).filter(Cart.user_id == user.id).first()
    if not cart:
        cart = Cart(id=f"cart_{uuid.uuid4().hex[:8]}", user_id=user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    existing = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == payload.product_id).first()
    if existing:
        existing.quantity += payload.quantity
        db.commit()
        db.refresh(existing)
        item = existing
    else:
        item = CartItem(
            id=f"citi_{uuid.uuid4().hex[:8]}",
            cart_id=cart.id,
            product_id=payload.product_id,
            quantity=payload.quantity,
        )
        db.add(item)
        db.commit()
        db.refresh(item)
    return {"id": item.id, "product_id": item.product_id, "quantity": item.quantity, "added_at": item.added_at}

# Order Endpoints (demo payment flow)
@app.post("/api/orders")
def create_order(order_data: OrderCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    total = sum([i.unit_price * i.quantity for i in order_data.items])
    order = Order(
        id=f"ord_{uuid.uuid4().hex[:8]}",
        user_id=user.id,
        status="pending",
        payment_status="unpaid",
        total_amount=total,
        ship_name=order_data.ship_name,
        ship_phone=order_data.ship_phone,
        ship_address=order_data.ship_address,
        ship_city=order_data.ship_city,
        ship_state=order_data.ship_state,
        ship_postal_code=order_data.ship_postal_code,
        ship_country=order_data.ship_country,
        ship_instructions=order_data.ship_instructions,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    for it in order_data.items:
        oi = OrderItem(
            id=f"oit_{uuid.uuid4().hex[:8]}",
            order_id=order.id,
            product_id=it.product_id,
            product_name=it.product_name,
            product_image=it.product_image,
            unit_price=it.unit_price,
            quantity=it.quantity,
            subtotal=it.unit_price * it.quantity,
        )
        db.add(oi)
    db.commit()
    return {"order_id": order.id, "status": order.status, "payment_status": order.payment_status, "total_amount": total}

@app.get("/api/orders")
def list_orders(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_id == user.id).order_by(Order.created_at.desc()).all()
    result = []
    for o in orders:
        result.append({
            "id": o.id,
            "status": o.status,
            "payment_status": o.payment_status,
            "total_amount": o.total_amount,
            "currency": o.currency,
            "created_at": o.created_at,
        })
    return {"orders": result}

@app.get("/api/orders/{order_id}")
def get_order(order_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    items = []
    for i in order.items:
        items.append({
            "id": i.id,
            "product_id": i.product_id,
            "product_name": i.product_name,
            "product_image": i.product_image,
            "unit_price": i.unit_price,
            "quantity": i.quantity,
            "subtotal": i.subtotal,
        })
    return {
        "id": order.id,
        "status": order.status,
        "payment_status": order.payment_status,
        "total_amount": order.total_amount,
        "currency": order.currency,
        "created_at": order.created_at,
        "items": items,
    }

# Demo payment endpoint (no external gateway)
@app.post("/api/payments/{order_id}")
def mock_payment(order_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.payment_status = "paid"
    order.status = "completed"
    db.commit()
    return {"order_id": order.id, "payment_status": order.payment_status, "status": order.status}


# 6. Issues
@app.post("/api/issues")
def create_issue(issue: IssueCreate, db: Session = Depends(get_db)):
    new_issue = IssueReport(
        id=f"iss_{uuid.uuid4().hex[:8]}",
        product_id=issue.product_id,
        offer_id=issue.offer_id,
        issue_type=issue.issue_type,
        description=issue.description,
        status="open"
    )
    db.add(new_issue)
    db.commit()
    return {"message": "Issue recorded", "id": new_issue.id}

@app.get("/api/issues/{issue_id}")
def get_issue(issue_id: str, db: Session = Depends(get_db)):
    iss = db.query(IssueReport).filter(IssueReport.id == issue_id).first()
    if not iss:
        raise HTTPException(status_code=404, detail="Issue not found")
    return iss

# 7. Admin
@app.get("/api/admin/products")
def admin_get_products(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    products = db.query(Product).all()
    return {"products": [{"id": p.id, "name": p.name, "brand": p.brand, "status": p.status, "data_completeness_score": p.data_completeness_score} for p in products]}

@app.patch("/api/admin/products/{product_id}")
def admin_patch_product(product_id: str, payload: Dict[str, Any], user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    if "status" in payload:
        p.status = payload["status"]
        db.commit()
    return {"id": p.id, "status": p.status}

@app.get("/api/admin/issue-reports")
def admin_get_issues(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    issues = db.query(IssueReport).all()
    return {"reports": issues}

@app.patch("/api/admin/issue-reports/{issue_id}")
def admin_patch_issue(issue_id: str, payload: Dict[str, Any], user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    iss = db.query(IssueReport).filter(IssueReport.id == issue_id).first()
    if not iss:
        raise HTTPException(status_code=404, detail="Issue not found")
    if "status" in payload:
        iss.status = payload["status"]
        db.commit()
    return {"id": iss.id, "status": iss.status}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
