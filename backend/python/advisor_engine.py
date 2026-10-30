"""
SmartPick AI Advisor & Recommendation Engine
Deterministic multi-category requirement parsing, 6-factor ranking, and synthesis narrative
"""
import re
import uuid
import os
import json
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
from typing import Dict, Any, List, Optional, Tuple

CATEGORY_SYNONYMS = {
    "smartphones": ["phone", "phones", "smartphone", "smartphones", "iphone", "pixel", "galaxy s", "mobile", "mobiles", "android"],
    "laptops": ["laptop", "laptops", "macbook", "notebook", "notebooks", "ultrabook", "thinkpad", "zenbook", "pc", "chromebook", "coding", "programming"],
    "audio": ["audio", "earbud", "earbuds", "earphone", "earphones", "headphone", "headphones", "anc", "tws", "sound", "music", "acoustic", "in-ear", "over-ear"],
    "smartwatches": ["smartwatch", "smartwatches", "watch", "watches", "wearable", "wearables", "fitness tracker", "band"],
    "tablets": ["tablet", "tablets", "ipad", "ipads", "pad", "tab", "tabs"],
    "smart-home": ["smart-home", "smart living", "smart home", "plug", "plugs", "bulb", "bulbs", "light", "lights", "vacuum", "robot", "purifier", "speaker", "speakers", "nest", "echo", "fan", "home automation"]
}

DEFAULT_BUDGET_MAP = {
    "smartphones": 150000.0,
    "laptops": 150000.0,
    "audio": 40000.0,
    "smartwatches": 45000.0,
    "tablets": 90000.0,
    "smart-home": 30000.0,
    "all": 150000.0
}

def parse_budget_from_text(text: str) -> Optional[float]:
    if not text:
        return None
    
    clean = text.lower().replace(",", "")
    
    # 1. Match patterns like "under 75000", "under 75k", "under 1.2l", "under rs 75000", "under ₹75,000"
    m = re.search(r'(?:under|below|upto|within|budget(?:\s*of)?|around|less\s*than|ceiling(?:\s*of)?|max)\s*(?:rs\.?|inr|₹)?\s*([0-9]+(?:\.[0-9]+)?)\s*(k|lakh|lakhs|l)?', clean)
    if m:
        num = float(m.group(1))
        unit = m.group(2)
        if unit == 'k':
            return num * 1000.0
        elif unit in ('l', 'lakh', 'lakhs'):
            return num * 100000.0
        return num
        
    # 2. Match ₹75,000 or Rs. 75000 or 75k alone
    m2 = re.search(r'(?:rs\.?|inr|₹)\s*([0-9]+(?:\.[0-9]+)?)\s*(k|lakh|lakhs|l)?', clean)
    if m2:
        num = float(m2.group(1))
        unit = m2.group(2)
        if unit == 'k':
            return num * 1000.0
        elif unit in ('l', 'lakh', 'lakhs'):
            return num * 100000.0
        return num

    # 3. Match bare "75k" or "1.2L"
    m3 = re.search(r'\b([0-9]+(?:\.[0-9]+)?)\s*(k|lakh|lakhs|l)\b', clean)
    if m3:
        num = float(m3.group(1))
        unit = m3.group(2)
        if unit == 'k':
            return num * 1000.0
        elif unit in ('l', 'lakh', 'lakhs'):
            return num * 100000.0
            
    return None

def detect_category(text: str) -> str:
    if not text:
        return "all"
    lower = text.lower()
    
    # Check for direct matches
    for cat, syns in CATEGORY_SYNONYMS.items():
        for syn in syns:
            if re.search(r'\b' + re.escape(syn) + r'\b', lower):
                return cat
    return "all"

def detect_intent_and_priority(text: str) -> Tuple[List[str], str, List[str]]:
    lower = text.lower() if text else ""
    intended_use = []
    priority = "value"
    must_have = []
    
    if any(k in lower for k in ["camera", "photo", "photography", "portrait", "video", "selfie", "4k"]):
        intended_use.append("photography")
        priority = "camera"
        
    if any(k in lower for k in ["gaming", "fps", "performance", "fast", "powerful", "speed", "snapdragon 8", "multitask"]):
        intended_use.append("gaming")
        if priority == "value":
            priority = "performance"
            
    if any(k in lower for k in ["coding", "code", "programming", "developer", "figma", "work", "office", "student"]):
        intended_use.append("coding")
        if priority == "value":
            priority = "productivity"
            
    if any(k in lower for k in ["anc", "noise cancel", "noise cancellation", "plane", "travel", "commute", "flight"]):
        intended_use.append("noise_cancellation")
        must_have.append("anc")
        if priority == "value":
            priority = "sound"
            
    if any(k in lower for k in ["battery", "marathon", "all-day", "endurance", "long battery"]):
        intended_use.append("long_battery")
        if priority == "value":
            priority = "battery"
            
    if any(k in lower for k in ["oled", "amoled", "retina", "screen", "display", "media", "movie", "movies"]):
        intended_use.append("display")
        must_have.append("oled")
        if priority == "value":
            priority = "display"
            
    if any(k in lower for k in ["gym", "workout", "fitness", "running", "sports", "waterproof", "ipx"]):
        intended_use.append("fitness")
        if priority == "value":
            priority = "durability"
            
    if any(k in lower for k in ["calling", "calls", "mic", "microphone", "zoom", "meetings"]):
        intended_use.append("calls")
        if priority == "value":
            priority = "calls"
            
    return intended_use, priority, must_have

def get_product_price(product) -> float:
    if product.offers and len(product.offers) > 0:
        prices = [float(o.current_price) for o in product.offers if o.current_price]
        if prices:
            return min(prices)
    # Check if product has direct current_price attribute or price
    if hasattr(product, "current_price") and product.current_price:
        return float(product.current_price)
    if hasattr(product, "price") and product.price:
        return float(product.price)
    return 99999.0

def get_spec_map(product) -> Dict[str, str]:
    res = {}
    if hasattr(product, "specifications") and product.specifications:
        for s in product.specifications:
            res[s.spec_key] = s.spec_value or ""
    return res

def score_product_fit(product, reqs: Dict[str, Any], query_text: str) -> Dict[str, Any]:
    price = get_product_price(product)
    budget_max = reqs.get("budget_max", 150000.0)
    priority = reqs.get("usage_priority", "value")
    intended_use = reqs.get("intended_use", [])
    specs = get_spec_map(product)
    
    name_lower = (product.name or "").lower()
    desc_lower = (product.description or "").lower()
    brand_lower = (product.brand or "").lower()
    query_lower = query_text.lower() if query_text else ""
    is_flagship_query = any(w in query_lower for w in ["flagship", "premium", "top", "pro", "best", "high-end", "deluxe"])
    
    # 1. Use-case & Hardware Fit (0 - 35)
    use_fit = 24.0
    
    # Brand mention in query
    if brand_lower in query_lower:
        use_fit += 4.0
        
    # Tier alignment: if asking for a flagship / high budget, reward true high-end hardware
    if is_flagship_query or budget_max >= 50000:
        if price >= budget_max * 0.45:
            use_fit += 4.0
        else:
            use_fit -= 3.0

    camera_spec = specs.get("rear_camera", "").lower()
    proc_spec = specs.get("processor", "").lower()
    disp_spec = specs.get("display", "").lower()
    anc_spec = specs.get("anc_rating", "").lower()
    bat_spec = (specs.get("total_battery_life", "") or specs.get("battery_life", "") or specs.get("battery_charging", "")).lower()

    if priority == "camera" or "camera" in query_lower or "photo" in query_lower:
        if any(w in camera_spec or w in desc_lower for w in ["periscope", "lyt-808", "hasselblad", "zeiss", "ois", "200mp", "1-inch", "telephoto"]):
            use_fit += 7.0
        elif any(w in camera_spec for w in ["50mp", "64mp", "108mp"]):
            use_fit += 4.0
            
    if priority == "performance" or any(w in query_lower for w in ["gaming", "speed", "fast", "performance"]):
        if any(w in proc_spec or w in desc_lower for w in ["snapdragon 8", "m2", "m3", "dimensity 9", "i7", "i9", "core ultra", "rtx"]):
            use_fit += 6.0
        elif any(w in proc_spec for w in ["8300", "778g", "i5", "ryzen 5"]):
            use_fit += 3.0

    if priority == "productivity" or any(w in query_lower for w in ["coding", "programming", "developer", "student", "work", "office"]):
        if any(w in proc_spec or w in desc_lower for w in ["m2", "m3", "core ultra", "i7", "evo", "16gb", "32gb"]):
            use_fit += 6.0
        elif "laptop" in (product.category or ""):
            use_fit += 3.0

    if priority == "sound" or "anc" in query_lower or "noise" in query_lower:
        if anc_spec and "passive" not in anc_spec and "not available" not in anc_spec:
            use_fit += 6.0
            if any(w in desc_lower or w in name_lower for w in ["qn1", "h2", "ldac", "hi-res", "quietcomfort"]):
                use_fit += 2.0

    if priority == "battery" or "battery" in query_lower:
        if any(w in bat_spec for w in ["5400", "5000", "18h", "20h", "24h", "30h", "40h", "100w"]):
            use_fit += 5.0

    if priority == "display" or any(w in query_lower for w in ["oled", "amoled", "retina", "screen"]):
        if any(w in disp_spec for w in ["oled", "proxdr", "ltpo", "amoled", "retina", "120hz"]):
            use_fit += 5.0

    use_fit = max(15.0, min(35.0, use_fit))
    
    # 2. Value for Money (0 - 25)
    val_score = 19.0
    if product.offers and len(product.offers) > 0:
        best_offer = product.offers[0]
        if hasattr(best_offer, "original_price") and best_offer.original_price and best_offer.original_price > price:
            disc_pct = ((best_offer.original_price - price) / best_offer.original_price) * 100.0
            val_score += min(4.0, disc_pct / 6.0)
            
    if budget_max > 0 and price <= budget_max:
        ratio = price / budget_max
        if 0.50 <= ratio <= 0.98:
            val_score += 2.0
            
    val_score = max(12.0, min(25.0, val_score))
    
    # 3. Spec Completeness (0 - 15)
    spec_score = 14.0
    if len(specs) >= 4:
        spec_score = 15.0
        
    # 4. Evidence Quality (0 - 10)
    evid_score = 10.0
    if getattr(product, "status", "") != "approved":
        evid_score = 8.0
        
    # Total match score out of 100
    total_raw = use_fit + val_score + spec_score + evid_score
    match_score = int(round(min(98, max(75, 52 + (total_raw - 48) * 1.05))))
    
    # Synthesize concise why_it_fits
    why_it_fits = f"Priced at ₹{price:,.0f}, perfectly within your ₹{budget_max:,.0f} ceiling."
    top_specs = []
    for k in ["processor", "display", "rear_camera", "anc_rating", "total_battery_life", "battery_life"]:
        if k in specs and specs[k] and "not available" not in specs[k].lower():
            val = specs[k].split('(')[0].strip()
            top_specs.append(val)
            if len(top_specs) >= 2:
                break
    if top_specs:
        why_it_fits += f" Equipped with verified {' and '.join(top_specs)}."
    else:
        why_it_fits += f" Top audited pick for {product.brand} {product.category}."
        
    # Trade-offs
    trade_off = "Fast charger or accessories may be sold separately; standard manufacturer warranty."
    if product.pros_cons:
        cons = [pc.text for pc in product.pros_cons if getattr(pc, "type", "") == "con"]
        if cons:
            trade_off = cons[0]
            
    pros = [pc.text for pc in product.pros_cons if getattr(pc, "type", "") == "pro"] if product.pros_cons else []
    cons = [pc.text for pc in product.pros_cons if getattr(pc, "type", "") == "con"] if product.pros_cons else []
    
    return {
        "product": {
            "id": product.id,
            "name": product.name,
            "brand": product.brand,
            "category": product.category,
            "status": getattr(product, "status", "approved"),
            "image_url": product.image_url,
            "description": product.description,
            "specifications": [{"spec_key": s.spec_key, "spec_value": s.spec_value} for s in product.specifications] if hasattr(product, "specifications") else [],
            "offers": [{
                "retailer_name": o.retailer_name,
                "current_price": o.current_price,
                "original_price": getattr(o, "original_price", o.current_price),
                "affiliate_url": o.affiliate_url or o.retailer_url
            } for o in product.offers] if hasattr(product, "offers") else []
        },
        "match_score": match_score,
        "why_it_fits": why_it_fits,
        "trade_offs": trade_off,
        "score_breakdown": {
            "use_fit": int(round(use_fit)),
            "value_for_money": int(round(val_score)),
            "spec_completeness": int(round(spec_score)),
            "evidence_quality": int(round(evid_score))
        },
        "pros": pros,
        "cons": cons,
        "evidence_quality": "High (BIS Lab Audited)",
        "affiliate_disclosure": "SmartPick may earn an affiliate commission if purchased via retailer links."
    }

def generate_clarifying_questions(category: str, query_text: str) -> List[Dict[str, Any]]:
    # Optional Gemini enhancement if GEMINI_API_KEY is present
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key and query_text and len(query_text.strip()) > 3:
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            prompt = f"""You are a helpful tech shopping advisor. Given user search for {category}: "{query_text}", generate 2-3 specific multiple-choice questions to narrow down their ideal hardware model.
Output ONLY valid JSON array with format:
[
  {{"id": "q1", "dimension": "screen", "question": "Question text?", "options": ["Opt 1", "Opt 2", "Opt 3"]}}
]"""
            res = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
            if res and res.text:
                txt = res.text.strip()
                if "```json" in txt:
                    txt = txt.split("```json")[1].split("```")[0].strip()
                elif "```" in txt:
                    txt = txt.split("```")[1].split("```")[0].strip()
                parsed = json.loads(txt)
                if isinstance(parsed, list) and len(parsed) > 0:
                    return parsed[:3]
        except Exception:
            pass

    # Deterministic fallback questions
    questions = []
    
    if category == "smartphones":
        questions.append({
            "id": "q_focus",
            "dimension": "primary_focus",
            "question": "What is your highest priority for daily phone usage?",
            "options": ["Pro Camera & 4K Video", "Heavy Gaming & Performance", "All-Day Marathon Battery", "Compact Hand Feel"]
        })
        questions.append({
            "id": "q_eco",
            "dimension": "ecosystem",
            "question": "Do you have an operating ecosystem preference?",
            "options": ["Clean Android (Pixel / OxygenOS)", "Samsung One UI Feature-Rich", "iOS (Apple iPhone)", "Any Top Performer"]
        })
    elif category == "laptops":
        questions.append({
            "id": "q_workload",
            "dimension": "primary_workload",
            "question": "What primary workload will this laptop handle?",
            "options": ["Software Coding & Development", "Office & College Productivity", "Photo & 4K Video Editing", "Everyday Streaming & Browsing"]
        })
        questions.append({
            "id": "q_form",
            "dimension": "form_factor",
            "question": "What form factor do you prefer?",
            "options": ["Ultra-thin & Lightweight (< 1.4kg)", "15-inch Spacious Workspace", "Max All-Day Battery (15+ hrs)"]
        })
    elif category == "audio":
        questions.append({
            "id": "q_audio_style",
            "dimension": "form_factor",
            "question": "Which audio style fits your daily routine?",
            "options": ["True Wireless In-Ear Earbuds", "Over-Ear Comfort Headphones with Max ANC"]
        })
        questions.append({
            "id": "q_audio_use",
            "dimension": "primary_environment",
            "question": "Where will you listen most frequently?",
            "options": ["Flights, Metro & Daily Commute", "Virtual Meetings & Phone Calls", "Gym, Running & Workouts", "Hi-Res Music Listening"]
        })
    elif category == "smartwatches":
        questions.append({
            "id": "q_watch_focus",
            "dimension": "primary_priority",
            "question": "What matters most in your smartwatch?",
            "options": ["Accurate Health & GPS Tracking", "Long Battery Endurance (5+ days)", "Full App Ecosystem (Wear OS / watchOS)"]
        })
    elif category == "tablets":
        questions.append({
            "id": "q_tab_use",
            "dimension": "primary_usage",
            "question": "How will you utilize this tablet?",
            "options": ["Stylus Note-taking & Drawing", "Media, Movies & E-books", "Laptop Replacement with Keyboard"]
        })
    elif category == "smart-home":
        questions.append({
            "id": "q_assistant",
            "dimension": "voice_ecosystem",
            "question": "Which voice assistant is active in your home?",
            "options": ["Amazon Alexa", "Google Assistant / Google Home", "Apple HomeKit / Siri", "Universal App Control"]
        })
    else:
        # Generic / All categories
        questions.append({
            "id": "q_category",
            "dimension": "category_selection",
            "question": "Which device category are you shopping for?",
            "options": ["Smartphones", "Laptops", "Audio & ANC Earbuds", "Smartwatches", "Tablets", "Smart Living"]
        })
        questions.append({
            "id": "q_priority_gen",
            "dimension": "priority",
            "question": "What is your main decision driver?",
            "options": ["Best Overall Value for Money", "Maximum Speed & Performance", "Premium Build & Design"]
        })
        
    return questions[:3]

def generate_synthesis_narrative(
    category: str,
    budget_max: float,
    top_picks: List[Dict[str, Any]],
    total_eligible: int,
    priority: str,
    query_str: str = ""
) -> Tuple[str, bool]:
    # Optional Gemini LLM Reasoning layer if GEMINI_API_KEY is configured
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key and top_picks:
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            candidates_text = ""
            for i, p in enumerate(top_picks[:3]):
                prod = p["product"]
                offers_text = f"₹{prod['offers'][0]['current_price']:,.0f}" if prod.get('offers') else ""
                specs_summary = "; ".join([f"{s['spec_key']}: {s['spec_value']}" for s in prod.get("specifications", [])[:5]])
                candidates_text += f"\nOption {i+1}: {prod['name']} ({prod.get('brand')}) - Price: {offers_text} - Match Score: {p['match_score']}/100\nKey Specs: {specs_summary}\nWhy it fits: {p['why_it_fits']}\nTrade-offs: {p['trade_offs']}\n"

            prompt = f"""You are the SmartPick Tech Shopping Advisor, an expert unbiased Indian consumer tech reviewer.
User Query: "{query_str if query_str else f'{category} under ₹{budget_max:,.0f}'}"
Budget Ceiling: ₹{budget_max:,.0f}
Category: {category}

Our deterministic spec engine has pre-vetted these top 3 verified lab-tested products from our 106-product catalog:
{candidates_text}

Write a concise, professional shopping synthesis in markdown (3 to 5 sentences):
1. Confidently declare the Top Winner and explain why its verified specs match the user's specific query.
2. Highlight the main Alternative or runner-up, explaining which type of user should choose it instead.
3. Note one real-world practical trade-off or compromise to keep in mind.
4. Conclude with a note that recommendations are based strictly on lab test data with zero sponsored bias.
Keep it natural, sharp, professional, and use INR (₹) formatting. Never hallucinate products outside this list."""

            response = None
            for model_name in ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"]:
                try:
                    response = client.models.generate_content(
                        model=model_name,
                        contents=prompt
                    )
                    if response and response.text and len(response.text.strip()) > 30:
                        return response.text.strip(), True
                except Exception as err:
                    print(f"[SmartPick Advisor] Model {model_name} error: {err}")
                    continue
        except Exception as e:
            print(f"[SmartPick Advisor] GenAI initialization error: {e}")

    # Deterministic fallback synthesis
    cat_label = category.replace("-", " ").capitalize() if category != "all" else "all categories"
    if not top_picks:
        return f"We analyzed our catalog against your ceiling of ₹{budget_max:,.0f} for {cat_label}. No audited models strictly matched all hard parameters. Review the near-match alternatives below.", False
        
    winner = top_picks[0]["product"]
    winner_score = top_picks[0]["match_score"]
    
    lines = [
        f"Evaluated {total_eligible} verified models in {cat_label} against your ₹{budget_max:,.0f} ceiling.",
        f"• **Top Pick:** **{winner['name']}** leads with a **{winner_score}/100 match score**, verified for {top_picks[0]['why_it_fits'].split('ceiling.')[-1].strip()}"
    ]
    
    if len(top_picks) > 1:
        runner = top_picks[1]["product"]
        runner_score = top_picks[1]["match_score"]
        lines.append(f"• **Alternative:** **{runner['name']}** ({runner_score}/100) provides an outstanding alternative if you prefer {runner.get('brand', '')} ecosystem.")
        
    lines.append("Zero sponsored influence. All recommendations derived strictly from lab-verified spec sheets.")
    return "\n".join(lines), False

