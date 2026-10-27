#!/usr/bin/env python3
"""
Multi-Category Migration & Seed Script for SmartPick
Expands catalog from earbuds-only to full e-commerce electronics & tech categories:
- Smartphones & Foldables
- Laptops & Ultrabooks
- Audio & Headphones (TWS + Over-Ear)
- Smartwatches & Wearables
- Tablets & Readers
- Smart Home & Lifestyle Tech
"""

import os
import json
import sqlite3
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)
DB_PATH = os.path.join(BASE_DIR, "smartpick.db")
ROOT_DB_PATH = os.path.join(ROOT_DIR, "smartpick.db")
STORE_JSON_PATH = os.path.join(ROOT_DIR, "data", "smartpick_store.json")

def create_connection(db_file):
    conn = sqlite3.connect(db_file)
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

# Comprehensive multi-category catalog
ALL_PRODUCTS = [
    # ==========================================
    # 1. SMARTPHONES & FOLDABLES
    # ==========================================
    {
        "id": "prod_phone_01",
        "name": "OnePlus 12 5G (16GB RAM, 512GB)",
        "brand": "OnePlus",
        "category": "smartphones",
        "model_number": "CPH2573",
        "description": "Flagship smartphone featuring Snapdragon 8 Gen 3, 2K 120Hz ProXDR display, 4th Gen Hasselblad Camera System, and 5400mAh battery with 100W SUPERVOOC charging.",
        "image_url": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600",
        "data_source": "OnePlus Official India / BIS Certified",
        "data_completeness_score": 96.0,
        "specs": [
            ("processor", "Qualcomm Snapdragon 8 Gen 3 (4nm)", None),
            ("ram_storage", "16GB LPDDR5X + 512GB UFS 4.0", None),
            ("display", "6.82-inch 2K 120Hz LTPO AMOLED, 4500 nits peak", None),
            ("rear_camera", "50MP Sony LYT-808 (OIS) + 64MP 3x Periscope + 48MP Ultrawide", None),
            ("battery_charging", "5400 mAh with 100W Wired + 50W Wireless AIRVOOC", None),
            ("os", "OxygenOS 14 based on Android 14", None),
            ("water_resistance", "IP65 Water and Dust Resistance", None),
            ("weight", "220", "g")
        ],
        "pros": [
            "Top-tier Snapdragon 8 Gen 3 performance with vapor cooling",
            "Exceptional battery endurance easily lasting 1.5 days",
            "Super-bright 4500 nits display with Aqua Touch technology",
            "Hasselblad telephoto 3x optical periscope lens with crisp portraits"
        ],
        "cons": [
            "IP65 rating instead of full submersible IP68",
            "Curved display edges may experience occasional palm touch sensitivity"
        ],
        "offers": [
            ("Amazon India", "https://www.amazon.in/dp/B0CQPNWJ34", 64999, 69999, 7.1, "https://amazon.in?tag=smartpick-21", True),
            ("Flipkart", "https://www.flipkart.com/oneplus-12", 65499, 69999, 6.4, "https://flipkart.com?affid=smartpick", True),
            ("OnePlus Store", "https://oneplus.in/12", 64999, 69999, 7.1, "https://oneplus.in", False)
        ],
        "reviews": {
            "summary": "Buyers praise the display brightness, rapid 100W charging (26 minutes to full), and high camera consistency in low light.",
            "pos": "Remarkable battery life and flagship-grade display fluidity",
            "neg": "Slightly bulky in hand compared to compact models",
            "confidence": "high"
        }
    },
    {
        "id": "prod_phone_02",
        "name": "Apple iPhone 15 (128GB)",
        "brand": "Apple",
        "category": "smartphones",
        "model_number": "A3090",
        "description": "Apple iPhone 15 with Dynamic Island, 48MP Main camera with 2x Telephoto, A16 Bionic chip, durable color-infused glass design, and USB-C connectivity.",
        "image_url": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600",
        "data_source": "Apple India / BIS R-41000000",
        "data_completeness_score": 98.0,
        "specs": [
            ("processor", "Apple A16 Bionic (5-core GPU)", None),
            ("ram_storage", "6GB RAM + 128GB NVMe", None),
            ("display", "6.1-inch Super Retina XDR OLED, 2000 nits peak", None),
            ("rear_camera", "48MP Main (Sensor-shift OIS) + 12MP Ultrawide", None),
            ("battery_charging", "3349 mAh, USB-C 20W Fast Charge, MagSafe 15W", None),
            ("os", "iOS 17 (Upgradable to iOS 18)", None),
            ("water_resistance", "IP68 Submersible (6m for 30 mins)", None),
            ("weight", "171", "g")
        ],
        "pros": [
            "Dynamic Island and universal USB-C transition",
            "Class-leading 48MP computational photography with automatic portrait capture",
            "Lightweight 171g contoured aluminum body",
            "Industry-leading 5+ years software support"
        ],
        "cons": [
            "Display refresh rate capped at standard 60Hz",
            "Charging speed limited to ~20W (approx 80 mins to full)"
        ],
        "offers": [
            ("Amazon India", "https://www.amazon.in/dp/B0CHX1W1XY", 70999, 79900, 11.1, "https://amazon.in?tag=smartpick-21", True),
            ("Flipkart", "https://www.flipkart.com/apple-iphone-15", 69999, 79900, 12.4, "https://flipkart.com?affid=smartpick", True),
            ("Croma", "https://www.croma.com/apple-iphone-15", 71490, 79900, 10.5, "https://croma.com", False)
        ],
        "reviews": {
            "summary": "Users admire the featherweight feel in hand, vibrant matte back glass, and seamless USB-C convenience.",
            "pos": "Effortless camera results and compact ergonomic footprint",
            "neg": "Lack of 120Hz ProMotion screen at this price tier",
            "confidence": "high"
        }
    },
    {
        "id": "prod_phone_03",
        "name": "Samsung Galaxy S24 Ultra 5G (12GB, 256GB)",
        "brand": "Samsung",
        "category": "smartphones",
        "model_number": "SM-S928B",
        "description": "Premium titanium flagship featuring Snapdragon 8 Gen 3 for Galaxy, Galaxy AI tools, built-in S-Pen, flat 120Hz Dynamic AMOLED 2X, and 200MP quad-camera.",
        "image_url": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600",
        "data_source": "Samsung India / BIS Certified",
        "data_completeness_score": 98.0,
        "specs": [
            ("processor", "Snapdragon 8 Gen 3 for Galaxy (Overclocked)", None),
            ("ram_storage", "12GB LPDDR5X + 256GB UFS 4.0", None),
            ("display", "6.8-inch QHD+ 120Hz Dynamic AMOLED 2X, Anti-reflective Gorilla Armor", None),
            ("rear_camera", "200MP Main + 50MP 5x Periscope + 10MP 3x + 12MP Ultrawide", None),
            ("battery_charging", "5000 mAh, 45W Wired, 15W Wireless", None),
            ("os", "One UI 6.1 with 7 Years OS Updates", None),
            ("water_resistance", "IP68 Water and Dust Resistance", None),
            ("weight", "232", "g")
        ],
        "pros": [
            "Best anti-reflective outdoor display on any smartphone",
            "Built-in stylus S-Pen for sketching and precision productivity",
            "7 years of committed Android OS and security upgrades",
            "Unrivaled 100x Space Zoom and low-light zoom versatility"
        ],
        "cons": [
            "Heavy 232g titanium chassis requires two-handed usage",
            "High investment price ceiling"
        ],
        "offers": [
            ("Amazon India", "https://www.amazon.in/dp/B0CS5X868Z", 129999, 134999, 3.7, "https://amazon.in?tag=smartpick-21", True),
            ("Samsung Store", "https://www.samsung.com/in/smartphones/galaxy-s24-ultra", 129999, 134999, 3.7, "https://samsung.com", False)
        ],
        "reviews": {
            "summary": "Power users praise the anti-glare display technology, productivity tools, and Galaxy AI live translation.",
            "pos": "Unmatched screen visibility under harsh Indian sunlight",
            "neg": "Square boxy corners can press against palms",
            "confidence": "high"
        }
    },
    {
        "id": "prod_phone_04",
        "name": "Google Pixel 8a (128GB)",
        "brand": "Google",
        "category": "smartphones",
        "model_number": "G8HH4",
        "description": "Google AI smartphone with Tensor G3 processor, 64MP camera with Best Take and Magic Editor, 120Hz Actua display, and 7 years of Pixel Feature Drops.",
        "image_url": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600",
        "data_source": "Google Store India / BIS Certified",
        "data_completeness_score": 95.0,
        "specs": [
            ("processor", "Google Tensor G3 + Titan M2 Security", None),
            ("ram_storage", "8GB LPDDR5X + 128GB UFS 3.1", None),
            ("display", "6.1-inch 120Hz Actua OLED, 2000 nits peak", None),
            ("rear_camera", "64MP Main (OIS) + 13MP Ultrawide", None),
            ("battery_charging", "4492 mAh with 18W Fast Charge, Qi Wireless", None),
            ("os", "Clean Stock Android 14 with 7 Years Updates", None),
            ("water_resistance", "IP67 Water Resistance", None),
            ("weight", "188", "g")
        ],
        "pros": [
            "Gold-standard still photography in any lighting scenario",
            "Clean bloatware-free Android with immediate feature updates",
            "7 full years of OS updates and security patches",
            "Handy 6.1-inch compact form factor"
        ],
        "cons": [
            "Modest 18W charging speed",
            "Thicker display bezels than competitors in this range"
        ],
        "offers": [
            ("Flipkart", "https://www.flipkart.com/google-pixel-8a", 49999, 52999, 5.7, "https://flipkart.com?affid=smartpick", True),
            ("Croma", "https://www.croma.com/google-pixel-8a", 50999, 52999, 3.8, "https://croma.com", False)
        ],
        "reviews": {
            "summary": "Acclaimed for natural skin tones in portraits, voice transcription accuracy, and reliable compact daily ergonomics.",
            "pos": "Benchmark computational photography under ₹55,000",
            "neg": "Tensor G3 warms slightly under sustained 3D gaming",
            "confidence": "high"
        }
    },
    {
        "id": "prod_phone_05",
        "name": "Redmi Note 13 Pro+ 5G (8GB, 256GB)",
        "brand": "Redmi",
        "category": "smartphones",
        "model_number": "23090RA98I",
        "description": "Upper mid-range phone featuring 200MP OIS camera, 3D Curved 120Hz AMOLED, MediaTek Dimensity 7200-Ultra, IP68 water resistance, and 120W HyperCharge.",
        "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=600",
        "data_source": "Xiaomi India / BIS Certified",
        "data_completeness_score": 94.0,
        "specs": [
            ("processor", "MediaTek Dimensity 7200-Ultra (4nm)", None),
            ("ram_storage", "8GB LPDDR5 + 256GB UFS 3.1", None),
            ("display", "6.67-inch 1.5K 120Hz Curved AMOLED, 1800 nits", None),
            ("rear_camera", "200MP Samsung ISOCELL HP3 (OIS) + 8MP Ultrawide + 2MP Macro", None),
            ("battery_charging", "5000 mAh with 120W in-box charger (19 mins full)", None),
            ("os", "MIUI 14 / HyperOS based on Android 13", None),
            ("water_resistance", "IP68 Flagship Water and Dust Rating", None),
            ("weight", "204", "g")
        ],
        "pros": [
            "Incredible 120W charger in the box (0 to 100% in 19 mins)",
            "Full IP68 water and dust ingress protection under ₹32,000",
            "Sharp 1.5K curved AMOLED with narrow borders"
        ],
        "cons": [
            "Some pre-installed promotional apps in software",
            "Secondary 8MP ultrawide is modest compared to 200MP main"
        ],
        "offers": [
            ("Amazon India", "https://www.amazon.in/dp/B0CQV4WXXY", 31999, 33999, 5.9, "https://amazon.in?tag=smartpick-21", True),
            ("Flipkart", "https://www.flipkart.com/redmi-note-13-pro-plus", 31999, 33999, 5.9, "https://flipkart.com?affid=smartpick", True)
        ],
        "reviews": {
            "summary": "Buyers love the premium curved leather back, rapid 120W charging, and reliable IP68 rain protection.",
            "pos": "Unmatched value-for-money specifications ratio",
            "neg": "HyperOS notifications require initial cleanup",
            "confidence": "high"
        }
    },

    # ==========================================
    # 2. LAPTOPS & ULTRABOOKS
    # ==========================================
    {
        "id": "prod_laptop_01",
        "name": "Apple MacBook Air 13.6-inch M3 (16GB, 512GB SSD)",
        "brand": "Apple",
        "category": "laptops",
        "model_number": "MRXV3HN/A",
        "description": "Ultra-thin laptop powered by Apple M3 8-core CPU and 10-core GPU, Liquid Retina display, MagSafe 3 charging, dual external display support, and 18-hour battery life.",
        "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
        "data_source": "Apple India / BIS Certified",
        "data_completeness_score": 98.0,
        "specs": [
            ("processor", "Apple M3 (8-core CPU, 10-core GPU, 16-core Neural Engine)", None),
            ("ram_storage", "16GB Unified Memory + 512GB SSD", None),
            ("display", "13.6-inch Liquid Retina (2560x1664), 500 nits, P3 Color", None),
            ("battery_life", "Up to 18 hours wireless web (52.6Wh Li-Polymer)", "hrs"),
            ("ports", "MagSafe 3, 2x Thunderbolt 4 / USB4, 3.5mm Headphone Jack", None),
            ("webcam_audio", "1080p FaceTime HD, 4-speaker sound system with Spatial Audio", None),
            ("os", "macOS Sonoma (Upgradable to macOS Sequoia)", None),
            ("weight", "1.24", "kg")
        ],
        "pros": [
            "Silent fanless operation with zero thermal throttling on daily workloads",
            "Extraordinary 16–18 hour real-world battery endurance",
            "Rigid, featherweight 1.24kg recycled aluminum chassis",
            "Dual external monitor support when display lid is closed"
        ],
        "cons": [
            "Unified memory and SSD cannot be upgraded after purchase",
            "Port selection limited to two USB-C ports on the left side"
        ],
        "offers": [
            ("Amazon India", "https://www.amazon.in/dp/B0CX23V6X8", 124990, 134900, 7.3, "https://amazon.in?tag=smartpick-21", True),
            ("Flipkart", "https://www.flipkart.com/apple-macbook-air-m3", 125990, 134900, 6.6, "https://flipkart.com?affid=smartpick", True),
            ("Croma", "https://www.croma.com/macbook-air-m3", 127900, 134900, 5.2, "https://croma.com", False)
        ],
        "reviews": {
            "summary": "Regarded by developers, students, and creative writers as the most well-rounded ultrabook on the global market.",
            "pos": "Battery easily survives 2 full working days between charges",
            "neg": "Midnight color finish shows occasional finger oils",
            "confidence": "high"
        }
    },
    {
        "id": "prod_laptop_02",
        "name": "ASUS Zenbook 14 OLED (Intel Core Ultra 7, 16GB, 1TB SSD)",
        "brand": "ASUS",
        "category": "laptops",
        "model_number": "UX3405MA",
        "description": "Intel Evo edition premium thin-and-light laptop with Core Ultra 7 155H NPU for AI, 14-inch 3K 120Hz Lumina OLED display, 75Wh battery, and Harman Kardon audio.",
        "image_url": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600",
        "data_source": "ASUS India / BIS Certified",
        "data_completeness_score": 96.0,
        "specs": [
            ("processor", "Intel Core Ultra 7 155H (16 Cores, 22 Threads, Intel AI Boost NPU)", None),
            ("ram_storage", "16GB LPDDR5X 7467MHz + 1TB PCIe 4.0 NVMe SSD", None),
            ("display", "14.0-inch 3K (2880 x 1800) 120Hz OLED, 600 nits HDR, 100% DCI-P3", None),
            ("battery_life", "Up to 15 hours (75Wh Battery, 65W Type-C Charge)", "hrs"),
            ("ports", "2x Thunderbolt 4, 1x USB 3.2 Gen 1 Type-A, 1x HDMI 2.1, Audio Jack", None),
            ("webcam_audio", "FHD IR camera with Windows Hello, Super-linear speakers", None),
            ("os", "Windows 11 Home + MS Office Home & Student 2021", None),
            ("weight", "1.28", "kg")
        ],
        "pros": [
            "Breathtaking 3K 120Hz OLED screen with infinite contrast and 100% DCI-P3",
            "Full port selection including traditional USB-A and full-size HDMI 2.1",
            "Substantial 75Wh battery offering 11–13 hours of real productivity",
            "Integrated Intel Arc GPU handles light 1080p gaming and photo editing"
        ],
        "cons": [
            "Glossy OLED panel reflects direct overhead fluorescent lighting",
            "Fans audible under continuous heavy multi-core CPU exports"
        ],
        "offers": [
            ("Amazon India", "https://www.amazon.in/dp/B0CTMS4X5W", 109990, 122990, 10.6, "https://amazon.in?tag=smartpick-21", True),
            ("Flipkart", "https://www.flipkart.com/asus-zenbook-14-oled", 111990, 122990, 8.9, "https://flipkart.com?affid=smartpick", True)
        ],
        "reviews": {
            "summary": "Users praise the vibrant OLED color accuracy for design work and the full assortment of ports without needing dongles.",
            "pos": "Sublime display quality combined with lightweight portability",
            "neg": "Trackpad NumberPad mode can occasionally trigger accidentally",
            "confidence": "high"
        }
    },
    {
        "id": "prod_laptop_03",
        "name": "Lenovo IdeaPad Slim 3 15 (16GB RAM, 512GB SSD)",
        "brand": "Lenovo",
        "category": "laptops",
        "model_number": "15IAH8",
        "description": "Mainstream student and office productivity laptop with Intel Core i5 12th Gen H-series processor, 15.6-inch FHD anti-glare display, and military-grade durability.",
        "image_url": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600",
        "data_source": "Lenovo India / BIS Certified",
        "data_completeness_score": 93.0,
        "specs": [
            ("processor", "Intel Core i5-12450H (8 Cores, 12 Threads)", None),
            ("ram_storage", "16GB LPDDR5 + 512GB PCIe 4.0 SSD", None),
            ("display", "15.6-inch FHD (1920x1080) Anti-glare IPS, 300 nits", None),
            ("battery_life", "Up to 7 hours (47Wh, Rapid Charge Boost: 2hr run on 15min)", "hrs"),
            ("ports", "1x USB-C 3.2, 2x USB 3.2 Gen 1, HDMI 1.4, SD Card Reader, Audio", None),
            ("webcam_audio", "HD 720p with Privacy Shutter, Dolby Audio stereo speakers", None),
            ("os", "Windows 11 Home + MS Office 2021", None),
            ("weight", "1.62", "kg")
        ],
        "pros": [
            "H-series Core i5 processor delivers snappy multi-tasking and spreadsheet processing",
            "Comes standard with 16GB RAM at an accessible budget tier",
            "Physical webcam privacy shutter and full numeric keypad"
        ],
        "cons": [
            "Display color gamut limited to 45% NTSC (standard office grade)",
            "Plastic chassis feels utilitarian compared to metal ultrabooks"
        ],
        "offers": [
            ("Amazon India", "https://www.amazon.in/dp/B0CL5N5D8G", 49990, 68290, 26.8, "https://amazon.in?tag=smartpick-21", True),
            ("Flipkart", "https://www.flipkart.com/lenovo-ideapad-slim-3", 50490, 68290, 26.1, "https://flipkart.com?affid=smartpick", True)
        ],
        "reviews": {
            "summary": "Highly recommended for students and office managers looking for reliable processing speed without paying premium ultrabook pricing.",
            "pos": "Speedy performance with 16GB RAM for everyday tasks",
            "neg": "Average battery life under heavy spreadsheet macros",
            "confidence": "high"
        }
    },

    # ==========================================
    # 3. OVER-EAR & FLAGSHIP AUDIO
    # ==========================================
    {
        "id": "prod_audio_01",
        "name": "Sony WH-1000XM5 Wireless ANC Headphones",
        "brand": "Sony",
        "category": "audio",
        "model_number": "WH1000XM5/B",
        "description": "Industry-leading noise cancelling over-ear headphones with Auto NC Optimizer, 8 microphones, 30mm carbon fiber drivers, LDAC Hi-Res Audio, and 30-hour battery.",
        "image_url": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600",
        "data_source": "Sony India / BIS Certified",
        "data_completeness_score": 97.0,
        "specs": [
            ("anc_rating", "Industry Benchmark (Dual Processor V1 + QN1, 8 Mics)", None),
            ("total_battery_life", "30", "hrs"),
            ("driver_size", "30.0", "mm"),
            ("audio_codec", "LDAC, AAC, SBC with DSEE Extreme Upscaling", None),
            ("multipoint_bluetooth", "Bluetooth 5.2 with 2-device simultaneous connection", None),
            ("charging_speed", "3 mins charge = 3 hours playback (USB-PD)", None),
            ("mic_enc_tech", "4 beamforming microphones with AI noise reduction algorithm", None),
            ("weight", "250", "g")
        ],
        "pros": [
            "Best high-frequency noise cancellation (voices, airplane cabin, AC hum)",
            "Featherweight 250g chassis with soft-fit synthetic leather headband",
            "Crystal-clear call quality even in windy outdoor traffic",
            "Audiophile LDAC wireless transmission with pristine instrument separation"
        ],
        "cons": [
            "Headband does not fold into a compact ball like the older XM4",
            "Touch gesture panel can occasionally register stray rain drops"
        ],
        "offers": [
            ("Amazon India", "https://www.amazon.in/dp/B09XS7JWHH", 26990, 34990, 22.9, "https://amazon.in?tag=smartpick-21", True),
            ("Flipkart", "https://www.flipkart.com/sony-wh-1000xm5", 27490, 34990, 21.4, "https://flipkart.com?affid=smartpick", True),
            ("Croma", "https://www.croma.com/sony-wh-1000xm5", 26990, 34990, 22.9, "https://croma.com", False)
        ],
        "reviews": {
            "summary": "Frequent flyers and remote workers cite this as their single most indispensable productivity accessory.",
            "pos": "Unparalleled silence on metro trains and open offices",
            "neg": "Carrying case footprint is relatively wide in backpacks",
            "confidence": "high"
        }
    },
    {
        "id": "prod_audio_02",
        "name": "Bose QuietComfort Ultra Headphones",
        "brand": "Bose",
        "category": "audio",
        "model_number": "880066-0100",
        "description": "World-class noise cancelling headphones featuring Bose Immersive Audio spatial sound, CustomTune acoustic calibration, and up to 24 hours of playback.",
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
        "data_source": "Bose India / BIS Certified",
        "data_completeness_score": 96.0,
        "specs": [
            ("anc_rating", "QuietComfort World-Class Active Noise Cancelling", None),
            ("total_battery_life", "24", "hrs"),
            ("spatial_audio", "Bose Immersive Audio (Still & Motion modes)", None),
            ("audio_codec", "Snapdragon Sound, aptX Adaptive, AAC, SBC", None),
            ("multipoint_bluetooth", "Bluetooth 5.3 with seamless device switching", None),
            ("comfort_design", "Foldable hinge design with cast aluminum yokes", None),
            ("weight", "252", "g")
        ],
        "pros": [
            "Supreme physical clamp comfort for all-day 8-hour wear",
            "Foldable hinges allow the headphones to collapse into a compact case",
            "CustomTune automatically tailors sound and cancellation to user's ear canal"
        ],
        "cons": [
            "Battery life (24h) is slightly shorter than Sony (30h) or Sennheiser (60h)",
            "Spatial audio mode reduces battery to ~18 hours"
        ],
        "offers": [
            ("Amazon India", "https://www.amazon.in/dp/B0CCZ26B5V", 35900, 39900, 10.0, "https://amazon.in?tag=smartpick-21", True),
            ("Croma", "https://www.croma.com/bose-quietcomfort-ultra", 35900, 39900, 10.0, "https://croma.com", False)
        ],
        "reviews": {
            "summary": "Travelers rate this as the absolute gold standard for comfort and natural transparency audio pass-through.",
            "pos": "Most comfortable ear cushions in the audio industry",
            "neg": "Premium price tier above typical consumer models",
            "confidence": "high"
        }
    },

    # ==========================================
    # 4. SMARTWATCHES & WEARABLES
    # ==========================================
    {
        "id": "prod_watch_01",
        "name": "Apple Watch Series 9 GPS (45mm)",
        "brand": "Apple",
        "category": "smartwatches",
        "model_number": "MR993HN/A",
        "description": "Advanced smartwatch featuring S9 SiP chip, double tap magic gesture, brighter 2000-nit Always-On display, on-device Siri, and comprehensive health monitoring.",
        "image_url": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600",
        "data_source": "Apple India / BIS Certified",
        "data_completeness_score": 97.0,
        "specs": [
            ("display", "45mm Always-On Retina LTPO OLED, 2000 nits peak, edge-to-edge", None),
            ("processor", "Apple S9 SiP (Dual-core, 4-core Neural Engine)", None),
            ("health_sensors", "ECG app, Blood Oxygen SpO2, Heart Rate, Temperature Sensing", None),
            ("safety_features", "Crash Detection, Fall Detection, Emergency SOS", None),
            ("battery_life", "Up to 18 hours normal / 36 hours Low Power Mode", "hrs"),
            ("water_resistance", "WR50 (50m Swimproof) + IP6X Dust Resistance", None),
            ("os", "watchOS 10 (Upgradable to watchOS 11)", None),
            ("compatibility", "Requires iPhone XS or later with iOS 17+", None)
        ],
        "pros": [
            "Seamless Double Tap gesture allows one-handed answering of calls and timers",
            "Clinically recognized ECG and heart rhythm alerts",
            "Unrivaled haptic feedback engine and fluid UI animations",
            "Deep ecosystem synergy with iPhone and Apple Health"
        ],
        "cons": [
            "Strictly incompatible with Android smartphones",
            "Requires daily charging (18–24 hours typical endurance)"
        ],
        "offers": [
            ("Amazon India", "https://www.amazon.in/dp/B0CHX5T46N", 41999, 44900, 6.5, "https://amazon.in?tag=smartpick-21", True),
            ("Flipkart", "https://www.flipkart.com/apple-watch-series-9", 42499, 44900, 5.3, "https://flipkart.com?affid=smartpick", True),
            ("Croma", "https://www.croma.com/apple-watch-s9", 42900, 44900, 4.5, "https://croma.com", False)
        ],
        "reviews": {
            "summary": "iPhone owners consider it the benchmark smartwatch for health tracking, fitness rings, and hands-free notifications.",
            "pos": "Double tap gesture is genuinely useful when carrying groceries",
            "neg": "Daily charging routine is necessary",
            "confidence": "high"
        }
    },
    {
        "id": "prod_watch_02",
        "name": "OnePlus Watch 2 (Wear OS by Google)",
        "brand": "OnePlus",
        "category": "smartwatches",
        "model_number": "OPWWE231",
        "description": "Dual-Engine architecture smartwatch running Wear OS 4 with Snapdragon W5 Gen 1 + BES2700 co-processor, military-grade titanium/sapphire crystal, and 100-hour battery life.",
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
        "data_source": "OnePlus India / BIS Certified",
        "data_completeness_score": 96.0,
        "specs": [
            ("display", "1.43-inch AMOLED (466x466), 2.5D Sapphire Crystal, 1000 nits", None),
            ("processor", "Snapdragon W5 Gen 1 + BES2700 Dual-Engine Chips", None),
            ("battery_life", "Up to 100 hours in Smart Mode / 12 days in Power Saver", "hrs"),
            ("os", "Wear OS 4 by Google (Full Google Maps, Wallet, Play Store)", None),
            ("health_sensors", "Optical Heart Rate, Pulse Oximeter SpO2, Sleep Tracking, Stress", None),
            ("gps", "Dual-Frequency L1 + L5 GPS for precision running tracking", None),
            ("durability", "MIL-STD-810H Certified + IP68 + 5ATM Water Resistance", None),
            ("weight", "49", "g (chassis)")
        ],
        "pros": [
            "Incredible 100-hour (4 full days) battery life running full Wear OS with apps",
            "Scratch-proof Sapphire Crystal glass and stainless steel chassis",
            "Dual-frequency GPS tracks city runs and marathon routes with meter-level precision",
            "Rapid 7.5W VOOC charging gives 24 hours of power in just 10 minutes"
        ],
        "cons": [
            "Large 47mm case size may look oversized on petite wrists",
            "No LTE cellular model available in Indian market"
        ],
        "offers": [
            ("Amazon India", "https://www.amazon.in/dp/B0CS5Y25R8", 22999, 27999, 17.9, "https://amazon.in?tag=smartpick-21", True),
            ("OnePlus Store", "https://oneplus.in/watch-2", 22999, 27999, 17.9, "https://oneplus.in", False)
        ],
        "reviews": {
            "summary": "Android users celebrate finally having a Wear OS smartwatch that doesn't need to be charged every single night.",
            "pos": "Legitimate 3-4 days battery with Google Maps navigation",
            "neg": "Rotating crown is cosmetic and does not scroll menus",
            "confidence": "high"
        }
    },
    {
        "id": "prod_watch_03",
        "name": "Amazfit Balance Smartwatch",
        "brand": "Amazfit",
        "category": "smartwatches",
        "model_number": "A2286",
        "description": "Lifestyle smartwatch with BioCharge body composition analysis, mental & physical readiness score, AI sleep coach, dual-band GPS, and 14-day battery life.",
        "image_url": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600",
        "data_source": "Amazfit India / BIS Certified",
        "data_completeness_score": 93.0,
        "specs": [
            ("display", "1.5-inch HD AMOLED (480x480), 1500 nits peak, Anti-glare bezel", None),
            ("battery_life", "Up to 14 days typical use / 25 days battery saver", "days"),
            ("health_sensors", "BioTracker 5.0 PPG, BIA Body Composition (Fat %, Muscle, Water)", None),
            ("gps", "Circularly-polarized Dual-band GPS (6 satellite systems)", None),
            ("calling_audio", "Bluetooth phone calls via built-in mic and speaker, Alexa built-in", None),
            ("os", "Zepp OS 3.5 with AI Zepp Flow", None),
            ("water_resistance", "5 ATM (50m water resistant)", None),
            ("weight", "35", "g")
        ],
        "pros": [
            "Outstanding 14-day battery life eliminates charging anxiety",
            "Measures body fat percentage and skeletal muscle from wrist sensors",
            "Works identically across both Android and iOS devices"
        ],
        "cons": [
            "Third-party app ecosystem is smaller than Wear OS or watchOS",
            "Cannot reply to notifications with rich keyboards on iOS"
        ],
        "offers": [
            ("Amazon India", "https://www.amazon.in/dp/B0CGVDX13Z", 19999, 24999, 20.0, "https://amazon.in?tag=smartpick-21", True),
            ("Flipkart", "https://www.flipkart.com/amazfit-balance", 20499, 24999, 18.0, "https://flipkart.com?affid=smartpick", True)
        ],
        "reviews": {
            "summary": "Fitness enthusiasts love the readiness score, body composition metrics, and two-week battery life.",
            "pos": "Battery longevity and fitness tracking accuracy",
            "neg": "NFC payments not supported in India",
            "confidence": "high"
        }
    },

    # ==========================================
    # 5. TABLETS & E-READERS
    # ==========================================
    {
        "id": "prod_tab_01",
        "name": "Apple iPad Air 11-inch M2 (Wi-Fi, 128GB)",
        "brand": "Apple",
        "category": "tablets",
        "model_number": "MU9D3HN/A",
        "description": "Redesigned iPad Air powered by the Apple M2 chip, 11-inch Liquid Retina display, landscape 12MP front camera with Center Stage, and support for Apple Pencil Pro.",
        "image_url": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600",
        "data_source": "Apple India / BIS Certified",
        "data_completeness_score": 97.0,
        "specs": [
            ("processor", "Apple M2 (8-core CPU, 9-core GPU, 16-core Neural Engine)", None),
            ("ram_storage", "8GB RAM + 128GB NVMe", None),
            ("display", "11-inch Liquid Retina (2360x1640), 500 nits, P3 Wide Color, True Tone", None),
            ("camera", "12MP Wide Rear + Landscape 12MP Ultra Wide with Center Stage", None),
            ("battery_life", "Up to 10 hours of web browsing on Wi-Fi (28.93Wh)", "hrs"),
            ("connectivity", "Wi-Fi 6E (802.11ax), Bluetooth 5.3, USB-C (10Gbps)", None),
            ("accessories", "Supports Apple Pencil Pro and Magic Keyboard", None),
            ("weight", "462", "g")
        ],
        "pros": [
            "M2 processor handles 4K video editing and 3D sculpting with desktop speed",
            "Landscape front camera is positioned naturally for Zoom & FaceTime calls",
            "Support for Apple Pencil Pro with barrel roll and squeeze haptic feedback",
            "Lightweight 462g unibody aluminum enclosure"
        ],
        "cons": [
            "Display refresh rate is standard 60Hz rather than 120Hz ProMotion",
            "Base storage of 128GB cannot be expanded via micro-SD"
        ],
        "offers": [
            ("Amazon India", "https://www.amazon.in/dp/B0D3J8X5C4", 57900, 59900, 3.3, "https://amazon.in?tag=smartpick-21", True),
            ("Flipkart", "https://www.flipkart.com/apple-ipad-air-m2", 58490, 59900, 2.4, "https://flipkart.com?affid=smartpick", True),
            ("Croma", "https://www.croma.com/apple-ipad-air-m2", 57900, 59900, 3.3, "https://croma.com", False)
        ],
        "reviews": {
            "summary": "Students and digital illustrators love the speed of M2 and the ergonomics of Apple Pencil Pro.",
            "pos": "Phenomenal drawing performance and app optimization",
            "neg": "Pencil Pro and keyboard accessories sold separately",
            "confidence": "high"
        }
    },
    {
        "id": "prod_tab_02",
        "name": "Xiaomi Pad 6 (8GB RAM, 256GB)",
        "brand": "Xiaomi",
        "category": "tablets",
        "model_number": "23043RP34G",
        "description": "High-performance Android tablet with Qualcomm Snapdragon 870, 11-inch 2.8K 144Hz 7-stage refresh display, quad speakers with Dolby Atmos, and 8840mAh battery.",
        "image_url": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600",
        "data_source": "Xiaomi India / BIS Certified",
        "data_completeness_score": 95.0,
        "specs": [
            ("processor", "Qualcomm Snapdragon 870 (7nm, up to 3.2GHz)", None),
            ("ram_storage", "8GB LPDDR5 + 256GB UFS 3.1", None),
            ("display", "11.0-inch 2.8K (2880 x 1800) 144Hz IPS, Dolby Vision, 550 nits", None),
            ("battery_life", "8840 mAh with 33W Fast Charge (Up to 16h video playback)", None),
            ("audio", "Quad Stereo Speakers with Dolby Atmos and Hi-Res Wireless", None),
            ("os", "MIUI for Pad / HyperOS based on Android 13", None),
            ("build", "Slim unibody metal chassis (6.51mm thin)", None),
            ("weight", "490", "g")
        ],
        "pros": [
            "Silky smooth 144Hz refresh rate with crisp 2.8K resolution",
            "Loud, immersive quad-speaker audio ideal for OTT streaming and movies",
            "Snapdragon 870 provides consistent gaming frame rates without overheating",
            "Outstanding value under ₹28,000"
        ],
        "cons": [
            "No cellular LTE option available (Wi-Fi only)",
            "No 3.5mm headphone jack or expandable micro-SD slot"
        ],
        "offers": [
            ("Amazon India", "https://www.amazon.in/dp/B0C6QR22ZS", 26999, 39999, 32.5, "https://amazon.in?tag=smartpick-21", True),
            ("Flipkart", "https://www.flipkart.com/xiaomi-pad-6", 27499, 39999, 31.3, "https://flipkart.com?affid=smartpick", True)
        ],
        "reviews": {
            "summary": "Universally regarded as the best budget Android multimedia tablet in India for streaming, reading, and casual gaming.",
            "pos": "Remarkable 144Hz screen and room-filling speakers",
            "neg": "Stylus pen latency is slightly behind Apple Pencil",
            "confidence": "high"
        }
    },
    {
        "id": "prod_tab_03",
        "name": "Amazon Kindle Paperwhite (16GB, 6.8-inch)",
        "brand": "Amazon",
        "category": "tablets",
        "model_number": "B08N3TCP2F",
        "description": "Dedicated e-reader with 6.8-inch 300 ppi glare-free Paperwhite display, adjustable warm light, up to 10 weeks of battery life, and IPX8 waterproof rating.",
        "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600",
        "data_source": "Amazon India / BIS Certified",
        "data_completeness_score": 96.0,
        "specs": [
            ("display", "6.8-inch Amazon Paperwhite 300 ppi glare-free E-ink, 17 LEDs", None),
            ("storage", "16GB (Holds thousands of books)", None),
            ("battery_life", "Up to 10 weeks on a single USB-C charge", "wks"),
            ("lighting", "Adjustable Warm Light (White to Amber) for bedtime reading", None),
            ("water_resistance", "IPX8 (Immersion in 2 meters of fresh water for 60 mins)", None),
            ("connectivity", "Wi-Fi (2.4GHz & 5.0GHz), Bluetooth for Audible audiobooks", None),
            ("weight", "205", "g")
        ],
        "pros": [
            "Reads like real paper in bright direct sunlight with zero reflection",
            "Battery lasts 10 weeks on a single USB-C charge",
            "Warm amber light prevents eye strain during nighttime reading",
            "Full IPX8 waterproofing for safe reading in bathtubs or pools"
        ],
        "cons": [
            "Monochrome display not designed for color magazines or comic books",
            "Dedicated strictly for reading books, no web browsing or apps"
        ],
        "offers": [
            ("Amazon India", "https://www.amazon.in/dp/B08N3TCP2F", 14999, 14999, 0.0, "https://amazon.in?tag=smartpick-21", True),
            ("Croma", "https://www.croma.com/kindle-paperwhite", 14999, 14999, 0.0, "https://croma.com", False)
        ],
        "reviews": {
            "summary": "Book lovers consider it the single best distraction-free investment for building a daily reading habit.",
            "pos": "Zero eye fatigue and weeks of battery life",
            "neg": "Page turn speed is electronic ink, not instant like tablets",
            "confidence": "high"
        }
    },

    # ==========================================
    # 6. SMART HOME & LIFESTYLE TECH
    # ==========================================
    {
        "id": "prod_home_01",
        "name": "Dyson V12 Detect Slim Total Clean Cordless Vacuum",
        "brand": "Dyson",
        "category": "smart-home",
        "model_number": "368340-01",
        "description": "Lightweight 2.2kg cordless vacuum with Fluffy Optic laser revealing invisible dust, acoustic piezo sensor measuring particle counts, and up to 60 mins runtime.",
        "image_url": "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600",
        "data_source": "Dyson India / BIS Certified",
        "data_completeness_score": 97.0,
        "specs": [
            ("suction_power", "150 Air Watts with Dyson Hyperdymium Motor (125,000 RPM)", None),
            ("weight", "2.2", "kg"),
            ("runtime", "Up to 60 minutes fade-free suction (Eco Mode)", "mins"),
            ("filtration", "Fully sealed whole-machine HEPA filtration (99.99% down to 0.3 microns)", None),
            ("technology", "Illumination cleaner head reveals micro-dust; Piezo sensor calculates particles", None),
            ("bin_capacity", "0.35 Liters with 'point and shoot' hygienic bin emptying", None),
            ("accessories", "Includes Motorbar cleaner head, Hair screw tool, Crevice tool, Combination tool", None)
        ],
        "pros": [
            "Illumination beam makes microscopic dust visible on hard tiled floors",
            "Single-button power control eliminates the need to hold down a trigger",
            "Featherweight 2.2kg balance makes cleaning high curtains and ceilings effortless",
            "Motorized anti-tangle hair screw tool cleans mattresses and pet hair without snagging"
        ],
        "cons": [
            "Compact 0.35L dustbin requires emptying every 2–3 rooms in dusty environments",
            "High initial purchase price compared to corded vacuums"
        ],
        "offers": [
            ("Amazon India", "https://www.amazon.in/dp/B0B7K2PXYZ", 49900, 55900, 10.7, "https://amazon.in?tag=smartpick-21", True),
            ("Dyson India", "https://www.dyson.in/v12-detect-slim", 49900, 55900, 10.7, "https://dyson.in", False),
            ("Croma", "https://www.croma.com/dyson-v12", 50900, 55900, 8.9, "https://croma.com", False)
        ],
        "reviews": {
            "summary": "Homeowners describe it as life-changing for apartment dust management and pet hair removal on sofas.",
            "pos": "Laser reveals dust you thought was already clean",
            "neg": "Dust canister fills quickly in large carpeted houses",
            "confidence": "high"
        }
    },
    {
        "id": "prod_home_02",
        "name": "Logitech MX Master 3S Wireless Performance Mouse",
        "brand": "Logitech",
        "category": "smart-home",
        "model_number": "910-006561",
        "description": "Ergonomic productivity mouse featuring Quiet Clicks, 8,000 DPI track-on-glass sensor, MagSpeed electromagnetic scrolling (1,000 lines/sec), and USB-C quick charge.",
        "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
        "data_source": "Logitech India / BIS Certified",
        "data_completeness_score": 96.0,
        "specs": [
            ("sensor", "Darkfield high precision 8000 DPI (Tracks on glass)", None),
            ("scroll_wheel", "MagSpeed Electromagnetic scroll wheel with Smartshift", None),
            ("clicks", "Quiet Click technology (90% noise reduction)", None),
            ("battery_life", "Up to 70 days on full charge; 1 min charge gives 3 hours", "days"),
            ("connectivity", "Bluetooth Low Energy + Logi Bolt USB Receiver (Pairs 3 devices)", None),
            ("customization", "Logi Options+ app with app-specific button macros", None),
            ("weight", "141", "g")
        ],
        "pros": [
            "Near-silent clicks allow work in library or shared bedrooms without disturbance",
            "MagSpeed scroll wheel effortlessly flies through 10,000-row Excel spreadsheets",
            "Ergonomic thumb rest with dedicated horizontal scroll wheel and gesture button",
            "Pairs with up to 3 computers simultaneously with cross-computer file copy-paste"
        ],
        "cons": [
            "Ergonomic contour is strictly designed for right-handed users",
            "Slightly heavy (141g) for fast-twitch FPS gaming"
        ],
        "offers": [
            ("Amazon India", "https://www.amazon.in/dp/B0B11DXZCG", 8995, 10995, 18.2, "https://amazon.in?tag=smartpick-21", True),
            ("Flipkart", "https://www.flipkart.com/logitech-mx-master-3s", 9199, 10995, 16.3, "https://flipkart.com?affid=smartpick", True)
        ],
        "reviews": {
            "summary": "Software engineers, financial analysts, and video editors call it the pinnacle of office productivity mice.",
            "pos": "Horizontal thumb wheel and silent click tactile feel",
            "neg": "Not suitable for left-handed ergonomics",
            "confidence": "high"
        }
    },
    {
        "id": "prod_home_03",
        "name": "Sony SRS-XE300 Wireless Portable Speaker",
        "brand": "Sony",
        "category": "smart-home",
        "model_number": "SRS-XE300/B",
        "description": "Portable Bluetooth speaker featuring Line-Shape Diffuser for wide sound coverage, X-Balanced Speaker Units, IP67 waterproof & shockproof rating, and 24h battery.",
        "image_url": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600",
        "data_source": "Sony India / BIS Certified",
        "data_completeness_score": 95.0,
        "specs": [
            ("battery_life", "24", "hrs"),
            ("water_resistance", "IP67 Waterproof, Dustproof, Saltwater proof, Shock tested", None),
            ("sound_dispersion", "Line-Shape Diffuser spreads sound evenly across open rooms", None),
            ("driver_type", "Dual X-Balanced full range drivers with dual passive radiators", None),
            ("calling_mic", "Echo Cancelling microphone with hardware mic mute button", None),
            ("charging", "10-minute quick charge yields 70 minutes playback (USB-C)", None),
            ("weight", "1.3", "kg")
        ],
        "pros": [
            "Line-shape acoustic diffuser distributes sound evenly without hot-spots",
            "Extreme durability: survived drop tests and IP67 submersion in water and dust",
            "24-hour battery easily powers multi-day camping or weekend getaways"
        ],
        "cons": [
            "Vertical tower shape requires a wide footprint on small tables",
            "No auxiliary 3.5mm analog audio input (Bluetooth only)"
        ],
        "offers": [
            ("Amazon India", "https://www.amazon.in/dp/B0B5LQ6H6Z", 14990, 19990, 25.0, "https://amazon.in?tag=smartpick-21", True),
            ("Croma", "https://www.croma.com/sony-srs-xe300", 15490, 19990, 22.5, "https://croma.com", False)
        ],
        "reviews": {
            "summary": "Outdoor adventurers and terrace party hosts praise the wide room-filling audio dispersion and rugged build.",
            "pos": "Rugged build withstands poolside splashes and outdoor dust",
            "neg": "Treble response is directional if placed horizontally",
            "confidence": "high"
        }
    }
]

def seed_database(db_file):
    print(f"Connecting to SQLite: {db_file}")
    conn = create_connection(db_file)
    cursor = conn.cursor()

    now_iso = datetime.utcnow().isoformat() + "Z"

    # Insert products
    inserted = 0
    for p in ALL_PRODUCTS:
        cursor.execute("""
            INSERT OR REPLACE INTO products (
                id, name, brand, category, model_number, description, image_url,
                created_at, updated_at, data_source, last_checked_at, data_completeness_score, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            p["id"], p["name"], p["brand"], p["category"], p["model_number"],
            p["description"], p["image_url"], now_iso, now_iso, p["data_source"],
            now_iso, p["data_completeness_score"], "approved"
        ))
        inserted += 1

        # Specifications
        for spec_idx, (k, v, unit) in enumerate(p["specs"]):
            spec_id = f"spec_{p['id']}_{spec_idx}"
            cursor.execute("""
                INSERT OR REPLACE INTO product_specifications (
                    id, product_id, spec_key, spec_value, unit, source, confidence, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                spec_id, p["id"], k, str(v), unit, p["data_source"], "verified", now_iso, now_iso
            ))

        # Pros & Cons
        for pro_idx, pro_text in enumerate(p["pros"]):
            pro_id = f"pc_{p['id']}_pro_{pro_idx}"
            cursor.execute("""
                INSERT OR REPLACE INTO product_pros_cons (
                    id, product_id, type, text, evidence_source, confidence, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                pro_id, p["id"], "pro", pro_text, p["data_source"], "verified", now_iso
            ))

        for con_idx, con_text in enumerate(p["cons"]):
            con_id = f"pc_{p['id']}_con_{con_idx}"
            cursor.execute("""
                INSERT OR REPLACE INTO product_pros_cons (
                    id, product_id, type, text, evidence_source, confidence, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                con_id, p["id"], "con", con_text, p["data_source"], "verified", now_iso
            ))

        # Offers
        for off_idx, (r_name, r_url, cur_p, orig_p, disc, aff_url, is_aff) in enumerate(p["offers"]):
            off_id = f"off_{p['id']}_{off_idx}"
            cursor.execute("""
                INSERT OR REPLACE INTO retailer_offers (
                    id, product_id, retailer_name, retailer_url, current_price, original_price,
                    discount_percentage, availability_status, affiliate_url, is_affiliate,
                    last_checked_at, data_source
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                off_id, p["id"], r_name, r_url, cur_p, orig_p, disc, "in_stock",
                aff_url, 1 if is_aff else 0, now_iso, p["data_source"]
            ))

        # Reviews insight
        r = p["reviews"]
        r_id = f"rev_{p['id']}"
        cursor.execute("""
            INSERT OR REPLACE INTO reviews_insights (
                id, product_id, positive_theme, negative_theme, summary, evidence_source, confidence, generated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            r_id, p["id"], r["pos"], r["neg"], r["summary"], p["data_source"], r["confidence"], now_iso
        ))

    conn.commit()
    conn.close()
    print(f"Successfully inserted/updated {inserted} multi-category products in {db_file}")

def update_store_json():
    print(f"Syncing all products to JSON store: {STORE_JSON_PATH}")
    if os.path.exists(STORE_JSON_PATH):
        with open(STORE_JSON_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    else:
        data = {
            "users": [], "products": [], "product_specifications": [],
            "product_pros_cons": [], "retailer_offers": [], "price_history": [],
            "reviews_insights": [], "user_preferences": [], "wishlists": [],
            "wishlist_items": [], "price_alerts": [], "recommendation_sessions": [],
            "issue_reports": [], "audit_logs": []
        }

    now_iso = datetime.utcnow().isoformat() + "Z"

    # Merge products
    existing_p_ids = {p["id"] for p in data["products"]}
    for p in ALL_PRODUCTS:
        p_obj = {
            "id": p["id"],
            "name": p["name"],
            "brand": p["brand"],
            "category": p["category"],
            "model_number": p["model_number"],
            "description": p["description"],
            "image_url": p["image_url"],
            "created_at": now_iso,
            "updated_at": now_iso,
            "data_source": p["data_source"],
            "last_checked_at": now_iso,
            "data_completeness_score": p["data_completeness_score"],
            "status": "approved"
        }
        if p["id"] in existing_p_ids:
            # update
            for i, ex in enumerate(data["products"]):
                if ex["id"] == p["id"]:
                    data["products"][i] = p_obj
                    break
        else:
            data["products"].append(p_obj)

        # Specs
        for spec_idx, (k, v, unit) in enumerate(p["specs"]):
            spec_id = f"spec_{p['id']}_{spec_idx}"
            s_obj = {
                "id": spec_id,
                "product_id": p["id"],
                "spec_key": k,
                "spec_value": str(v),
                "unit": unit,
                "source": p["data_source"],
                "confidence": "verified",
                "created_at": now_iso,
                "updated_at": now_iso
            }
            # replace or append
            data["product_specifications"] = [x for x in data["product_specifications"] if x["id"] != spec_id]
            data["product_specifications"].append(s_obj)

        # Pros and Cons
        for pro_idx, pro_text in enumerate(p["pros"]):
            pro_id = f"pc_{p['id']}_pro_{pro_idx}"
            pc_obj = {
                "id": pro_id, "product_id": p["id"], "type": "pro", "text": pro_text,
                "evidence_source": p["data_source"], "confidence": "verified", "created_at": now_iso
            }
            data["product_pros_cons"] = [x for x in data["product_pros_cons"] if x["id"] != pro_id]
            data["product_pros_cons"].append(pc_obj)

        for con_idx, con_text in enumerate(p["cons"]):
            con_id = f"pc_{p['id']}_con_{con_idx}"
            pc_obj = {
                "id": con_id, "product_id": p["id"], "type": "con", "text": con_text,
                "evidence_source": p["data_source"], "confidence": "verified", "created_at": now_iso
            }
            data["product_pros_cons"] = [x for x in data["product_pros_cons"] if x["id"] != con_id]
            data["product_pros_cons"].append(pc_obj)

        # Offers
        for off_idx, (r_name, r_url, cur_p, orig_p, disc, aff_url, is_aff) in enumerate(p["offers"]):
            off_id = f"off_{p['id']}_{off_idx}"
            off_obj = {
                "id": off_id, "product_id": p["id"], "retailer_name": r_name,
                "retailer_url": r_url, "current_price": cur_p, "original_price": orig_p,
                "discount_percentage": disc, "availability_status": "in_stock",
                "affiliate_url": aff_url, "is_affiliate": is_aff,
                "last_checked_at": now_iso, "data_source": p["data_source"]
            }
            data["retailer_offers"] = [x for x in data["retailer_offers"] if x["id"] != off_id]
            data["retailer_offers"].append(off_obj)

        # Reviews
        r = p["reviews"]
        r_id = f"rev_{p['id']}"
        rev_obj = {
            "id": r_id, "product_id": p["id"], "positive_theme": r["pos"],
            "negative_theme": r["neg"], "summary": r["summary"],
            "evidence_source": p["data_source"], "confidence": r["confidence"], "generated_at": now_iso
        }
        data["reviews_insights"] = [x for x in data["reviews_insights"] if x["id"] != r_id]
        data["reviews_insights"].append(rev_obj)

    with open(STORE_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Store JSON updated with {len(data['products'])} total products across all categories.")

if __name__ == "__main__":
    if os.path.exists(DB_PATH):
        seed_database(DB_PATH)
    if os.path.exists(ROOT_DB_PATH):
        seed_database(ROOT_DB_PATH)
    update_store_json()
    print("Multi-category migration completed successfully.")
