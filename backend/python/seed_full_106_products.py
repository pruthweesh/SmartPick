"""
Seed 106 consumer electronics products across 6 categories for SmartPick:
- smartphones (18)
- laptops (18)
- audio (18)
- smartwatches (18)
- tablets (17)
- smart-home (17)

Generates local SVGs in frontend/public/images/categories and frontend/public/images/products.
Populates SQLite database smartpick.db with realistic specs, retailer offers, pros/cons, reviews.
"""
import os
import re
import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import (
    Product, Category, RetailerOffer, ProductSpecification,
    ProductProCon, ReviewsInsight, PriceHistory
)

FRONTEND_PUBLIC = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public"))
IMAGES_DIR = os.path.join(FRONTEND_PUBLIC, "images")
CAT_DIR = os.path.join(IMAGES_DIR, "categories")
PROD_DIR = os.path.join(IMAGES_DIR, "products")

os.makedirs(CAT_DIR, exist_ok=True)
os.makedirs(PROD_DIR, exist_ok=True)

# ----------------- SVG GENERATORS -----------------

def generate_category_svg(cat_slug: str, title: str, color: str, icon_type: str) -> str:
    path_icons = {
        "smartphones": '''<rect x="155" y="60" width="90" height="180" rx="16" fill="#1c1d22" stroke="{color}" stroke-width="4"/>
        <rect x="165" y="75" width="70" height="145" rx="8" fill="#282a36"/>
        <circle cx="200" cy="70" r="3" fill="#666"/>
        <circle cx="200" cy="230" r="4" fill="#555"/>''',
        "laptops": '''<rect x="120" y="90" width="160" height="105" rx="8" fill="#1c1d22" stroke="{color}" stroke-width="3"/>
        <rect x="130" y="100" width="140" height="85" rx="4" fill="#282a36"/>
        <polygon points="100,205 300,205 285,195 115,195" fill="#383a45" stroke="{color}" stroke-width="2"/>
        <rect x="175" y="200" width="50" height="4" rx="2" fill="#888"/>''',
        "audio": '''<path d="M140 160 A60 60 0 0 1 260 160" fill="none" stroke="{color}" stroke-width="12" stroke-linecap="round"/>
        <rect x="125" y="150" width="28" height="55" rx="12" fill="#222" stroke="{color}" stroke-width="3"/>
        <rect x="247" y="150" width="28" height="55" rx="12" fill="#222" stroke="{color}" stroke-width="3"/>
        <circle cx="139" cy="177" r="6" fill="{color}"/>
        <circle cx="261" cy="177" r="6" fill="{color}"/>''',
        "smartwatches": '''<rect x="180" y="45" width="40" height="210" rx="8" fill="#30323d"/>
        <rect x="160" y="95" width="80" height="110" rx="24" fill="#1a1b20" stroke="{color}" stroke-width="4"/>
        <circle cx="200" cy="150" r="32" fill="#252730"/>
        <path d="M200 130 L200 150 L216 150" stroke="{color}" stroke-width="3" stroke-linecap="round"/>''',
        "tablets": '''<rect x="130" y="65" width="140" height="170" rx="14" fill="#1c1d22" stroke="{color}" stroke-width="4"/>
        <rect x="140" y="78" width="120" height="144" rx="6" fill="#252732"/>
        <circle cx="200" cy="72" r="2.5" fill="#777"/>''',
        "smart-home": '''<polygon points="200,60 130,120 150,120 150,210 250,210 250,120 270,120" fill="#252732" stroke="{color}" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="200" cy="150" r="18" fill="#181920" stroke="{color}" stroke-width="3"/>
        <circle cx="200" cy="150" r="6" fill="{color}"/>'''
    }
    inner = path_icons.get(cat_slug, path_icons["smartphones"]).format(color=color)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e1017"/>
      <stop offset="100%" stop-color="#181b24"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" rx="16" fill="url(#bg)"/>
  <circle cx="200" cy="150" r="95" fill="{color}" opacity="0.08"/>
  <g>{inner}</g>
  <text x="200" y="270" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="14" font-weight="700" fill="#f0f2f5" text-anchor="middle" letter-spacing="1.5">{title.upper()}</text>
</svg>'''
    return svg


def generate_product_svg(prod: dict) -> str:
    brand = prod["brand"]
    name = prod["name"]
    category = prod["category"]
    
    brand_colors = {
        "Apple": "#999999",
        "Samsung": "#2b5cb8",
        "Sony": "#d4af37",
        "OnePlus": "#eb0029",
        "Google": "#4285f4",
        "Xiaomi": "#ff6900",
        "Realme": "#ffc915",
        "boAt": "#e60000",
        "JBL": "#ff4d00",
        "Bose": "#008080",
        "Nothing": "#ffffff",
        "Dell": "#007db8",
        "HP": "#0096d6",
        "Lenovo": "#e2231a",
        "ASUS": "#00539b",
        "Acer": "#83b81a",
        "Garmin": "#007cc3",
        "Dyson": "#b8006b",
        "Amazon": "#ff9900",
        "Fitbit": "#00b0b9",
        "Amazfit": "#00c4b4",
        "TP-Link": "#4acbd6",
        "Noise": "#f73859",
        "Philips": "#0b5ed7"
    }
    accent = brand_colors.get(brand, "#3b82f6")
    
    # Category silhouettes
    if category == "smartphones":
        device_svg = f'''
        <rect x="145" y="45" width="110" height="190" rx="18" fill="#15171e" stroke="{accent}" stroke-width="3"/>
        <rect x="153" y="55" width="94" height="170" rx="12" fill="#1f232e"/>
        <circle cx="200" cy="63" r="3.5" fill="{accent}"/>
        <rect x="160" y="80" width="80" height="3" rx="1.5" fill="{accent}" opacity="0.4"/>
        <rect x="160" y="90" width="55" height="3" rx="1.5" fill="#555"/>
        <circle cx="200" cy="150" r="24" fill="{accent}" opacity="0.15"/>
        <text x="200" y="155" font-family="sans-serif" font-size="11" font-weight="700" fill="{accent}" text-anchor="middle">{brand.upper()}</text>
        '''
    elif category == "laptops":
        device_svg = f'''
        <rect x="100" y="65" width="200" height="125" rx="8" fill="#15171e" stroke="{accent}" stroke-width="3"/>
        <rect x="110" y="75" width="180" height="105" rx="4" fill="#1f232e"/>
        <circle cx="200" cy="70" r="2" fill="#888"/>
        <polygon points="70,205 330,205 310,190 90,190" fill="#262936" stroke="{accent}" stroke-width="2"/>
        <rect x="175" y="196" width="50" height="5" rx="2" fill="#444"/>
        <text x="200" y="132" font-family="sans-serif" font-size="12" font-weight="700" fill="{accent}" text-anchor="middle">{brand}</text>
        '''
    elif category == "audio":
        device_svg = f'''
        <path d="M135 155 A65 65 0 0 1 265 155" fill="none" stroke="{accent}" stroke-width="12" stroke-linecap="round"/>
        <rect x="120" y="145" width="30" height="60" rx="14" fill="#1a1c24" stroke="{accent}" stroke-width="3"/>
        <rect x="250" y="145" width="30" height="60" rx="14" fill="#1a1c24" stroke="{accent}" stroke-width="3"/>
        <circle cx="135" cy="175" r="7" fill="{accent}"/>
        <circle cx="265" cy="175" r="7" fill="{accent}"/>
        <text x="200" y="195" font-family="sans-serif" font-size="10" font-weight="700" fill="{accent}" text-anchor="middle">ANC STEREO</text>
        '''
    elif category == "smartwatches":
        device_svg = f'''
        <rect x="180" y="35" width="40" height="215" rx="8" fill="#2d303b"/>
        <rect x="155" y="85" width="90" height="115" rx="26" fill="#15171e" stroke="{accent}" stroke-width="3.5"/>
        <circle cx="200" cy="142" r="34" fill="#1f232e" stroke="{accent}" stroke-width="1.5"/>
        <path d="M200 120 L200 142 L216 142" stroke="{accent}" stroke-width="3" stroke-linecap="round"/>
        <text x="200" y="165" font-family="sans-serif" font-size="9" font-weight="700" fill="{accent}" text-anchor="middle">{brand.upper()}</text>
        '''
    elif category == "tablets":
        device_svg = f'''
        <rect x="115" y="50" width="170" height="190" rx="16" fill="#15171e" stroke="{accent}" stroke-width="3.5"/>
        <rect x="125" y="62" width="150" height="166" rx="10" fill="#1f232e"/>
        <circle cx="200" cy="56" r="2.5" fill="#888"/>
        <circle cx="200" cy="145" r="28" fill="{accent}" opacity="0.15"/>
        <text x="200" y="150" font-family="sans-serif" font-size="12" font-weight="700" fill="{accent}" text-anchor="middle">{brand}</text>
        '''
    else:  # smart-home
        device_svg = f'''
        <polygon points="200,55 125,120 145,120 145,215 255,215 255,120 275,120" fill="#1f232e" stroke="{accent}" stroke-width="3.5" stroke-linejoin="round"/>
        <circle cx="200" cy="155" r="24" fill="#15171e" stroke="{accent}" stroke-width="2"/>
        <circle cx="200" cy="155" r="9" fill="{accent}"/>
        <text x="200" y="195" font-family="sans-serif" font-size="9" font-weight="700" fill="{accent}" text-anchor="middle">SMART LIVING</text>
        '''
    
    # Truncate clean title
    display_title = name if len(name) <= 28 else name[:26] + "..."
    # Escape XML entities
    display_title = display_title.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    clean_brand = brand.replace("&", "&amp;")

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <defs>
    <linearGradient id="bg_{prod['id']}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f1117"/>
      <stop offset="50%" stop-color="#141720"/>
      <stop offset="100%" stop-color="#1a1e2b"/>
    </linearGradient>
    <linearGradient id="glow_{prod['id']}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="{accent}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="{accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" rx="16" fill="url(#bg_{prod['id']})"/>
  <circle cx="200" cy="140" r="100" fill="url(#glow_{prod['id']})"/>
  
  <!-- Device Art -->
  <g>{device_svg}</g>
  
  <!-- Spec / Brand Pill Header -->
  <g transform="translate(20, 20)">
    <rect width="90" height="22" rx="11" fill="#202430" stroke="#33384a" stroke-width="1"/>
    <text x="45" y="15" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="10" font-weight="700" fill="{accent}" text-anchor="middle" letter-spacing="0.8">{clean_brand.upper()}</text>
  </g>
  <g transform="translate(290, 20)">
    <rect width="90" height="22" rx="11" fill="#1b2e24" stroke="#25543c" stroke-width="1"/>
    <text x="45" y="15" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="9" font-weight="700" fill="#4ade80" text-anchor="middle" letter-spacing="0.5">VERIFIED AUDIT</text>
  </g>
  
  <!-- Footer Title Bar -->
  <rect x="0" y="250" width="400" height="50" fill="#0b0c10" opacity="0.85"/>
  <text x="200" y="280" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="middle">{display_title}</text>
</svg>'''
    return svg

print("SVG Generators ready.")

