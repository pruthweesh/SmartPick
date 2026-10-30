"""
Seed Data Part 1: Smartphones (18) and Laptops (18)
"""

SMARTPHONES = [
    {
        "id": "prd_sp_iphone15pm",
        "name": "Apple iPhone 15 Pro Max",
        "brand": "Apple",
        "category": "smartphones",
        "model_number": "A3106",
        "description": "Apple iPhone 15 Pro Max with Aerospace-grade titanium design, A17 Pro chip with 6-core GPU, 48MP main camera with 5x optical zoom telephoto, Action button, and USB-C with 10Gbps USB 3 speeds.",
        "price": 149900.0,
        "original_price": 159900.0,
        "retailers": [
            {"name": "Apple Store India", "price": 159900.0, "original": 159900.0, "url": "https://www.apple.com/in/shop/buy-iphone/iphone-15-pro"},
            {"name": "Amazon India", "price": 149900.0, "original": 159900.0, "url": "https://www.amazon.in/dp/B0CHX1W1XY"},
            {"name": "Flipkart", "price": 151900.0, "original": 159900.0, "url": "https://www.flipkart.com/apple-iphone-15-pro-max"}
        ],
        "specs": [
            ("processor", "Apple A17 Pro (3nm Silicon)", None),
            ("display", "6.7-inch Super Retina XDR OLED, 120Hz ProMotion, 2000 nits", None),
            ("rear_camera", "48MP Main + 12MP Ultra-Wide + 12MP 5x Telephoto", None),
            ("battery_charging", "4441mAh, 29W Fast Charging + 15W MagSafe", None),
            ("water_resistance", "IP68 (6m up to 30 mins)", None),
            ("refresh_rate", "120Hz ProMotion", None)
        ],
        "pros": ["Aerospace-grade titanium frame is lighter and durable", "A17 Pro console-class gaming with hardware ray tracing", "5x optical zoom telephoto camera", "USB 3 transfer speeds up to 10Gbps"],
        "cons": ["Premium flagship pricing", "20W adapter not included in the box", "Fast charging capped at ~27W"],
        "reviews": ("Exceptional camera and titanium build", "Slow charging compared to Android flagships", "The premier smartphone for creators and iOS enthusiasts.")
    },
    {
        "id": "prd_sp_iphone15",
        "name": "Apple iPhone 15",
        "brand": "Apple",
        "category": "smartphones",
        "model_number": "A3090",
        "description": "Apple iPhone 15 with Dynamic Island, 48MP Main camera with 2x Telephoto, color-infused glass and aluminum design, A16 Bionic chip, and USB-C connectivity.",
        "price": 70999.0,
        "original_price": 79900.0,
        "retailers": [
            {"name": "Amazon India", "price": 70999.0, "original": 79900.0, "url": "https://www.amazon.in/dp/B0CHX2F5QT"},
            {"name": "Flipkart", "price": 71999.0, "original": 79900.0, "url": "https://www.flipkart.com/apple-iphone-15"}
        ],
        "specs": [
            ("processor", "Apple A16 Bionic (4nm)", None),
            ("display", "6.1-inch Super Retina XDR OLED, 2000 nits peak", None),
            ("rear_camera", "48MP Main + 12MP Ultra-Wide", None),
            ("battery_charging", "3349mAh, 20W Fast Charging", None),
            ("water_resistance", "IP68", None)
        ],
        "pros": ["Dynamic Island brought to non-Pro line", "48MP sensor with crisp 2x lossless crop", "Universal USB-C port"],
        "cons": ["Display is 60Hz only", "No telephoto optical lens"],
        "reviews": ("Great all-round iPhone value", "Lack of 120Hz at 70k is noticeable", "The most balanced everyday iPhone for most consumers.")
    },
    {
        "id": "prd_sp_s24ultra",
        "name": "Samsung Galaxy S24 Ultra",
        "brand": "Samsung",
        "category": "smartphones",
        "model_number": "SM-S928B",
        "description": "Samsung Galaxy S24 Ultra with Galaxy AI, Titanium exterior, built-in S Pen, 200MP Quad Telephoto camera with 5x optical zoom, and flat Corning Gorilla Armor anti-reflective display.",
        "price": 129999.0,
        "original_price": 134999.0,
        "retailers": [
            {"name": "Samsung India", "price": 129999.0, "original": 134999.0, "url": "https://www.samsung.com/in/smartphones/galaxy-s24-ultra/"},
            {"name": "Amazon India", "price": 128999.0, "original": 134999.0, "url": "https://www.amazon.in/dp/B0CQ2B3XNL"}
        ],
        "specs": [
            ("processor", "Snapdragon 8 Gen 3 for Galaxy (4nm)", None),
            ("display", "6.8-inch Dynamic AMOLED 2X, QHD+, 120Hz, 2600 nits, Anti-Reflective", None),
            ("rear_camera", "200MP Main + 50MP 5x Periscope + 10MP 3x + 12MP Ultra-Wide", None),
            ("battery_charging", "5000mAh, 45W Fast Charging", None),
            ("water_resistance", "IP68", None),
            ("refresh_rate", "120Hz LTPO", None)
        ],
        "pros": ["Gorilla Armor display eliminates 75% reflections", "Galaxy AI suite with Live Translate and Circle to Search", "7 years of full OS upgrades promised", "Built-in S Pen stylus"],
        "cons": ["Heavy 232g chassis", "Box excludes charging brick"],
        "reviews": ("The ultimate Android powerhouse", "Large size can feel sharp in small pockets", "Benchmark display clarity and zoom capabilities.")
    },
    {
        "id": "prd_sp_s24",
        "name": "Samsung Galaxy S24",
        "brand": "Samsung",
        "category": "smartphones",
        "model_number": "SM-S921B",
        "description": "Samsung Galaxy S24 featuring Galaxy AI, compact 6.2-inch Dynamic AMOLED 2X display with 2600 nits peak brightness, Armor Aluminum frame, and 50MP triple camera system.",
        "price": 64999.0,
        "original_price": 74999.0,
        "retailers": [
            {"name": "Amazon India", "price": 64999.0, "original": 74999.0, "url": "https://www.amazon.in/dp/B0CS5XQ1Z3"},
            {"name": "Samsung Store", "price": 67999.0, "original": 74999.0, "url": "https://www.samsung.com/in/smartphones/galaxy-s24/"}
        ],
        "specs": [
            ("processor", "Exynos 2400 (4nm)", None),
            ("display", "6.2-inch Dynamic AMOLED 2X, 120Hz LTPO, 2600 nits", None),
            ("rear_camera", "50MP Main + 12MP Ultra-Wide + 10MP 3x Telephoto", None),
            ("battery_charging", "4000mAh, 25W Fast Charging", None),
            ("water_resistance", "IP68", None),
            ("refresh_rate", "120Hz", None)
        ],
        "pros": ["Comfortable lightweight compact form factor", "Full Galaxy AI capabilities", "7 years of software support"],
        "cons": ["25W charging speed is modest", "Exynos 2400 in Indian market"],
        "reviews": ("Best compact flagship on Android", "Battery life is average during heavy gaming", "Delivers premium ergonomics and stellar display.")
    },
    {
        "id": "prd_sp_pixel8pro",
        "name": "Google Pixel 8 Pro",
        "brand": "Google",
        "category": "smartphones",
        "model_number": "GC3VE",
        "description": "Google Pixel 8 Pro with Google Tensor G3 silicon, pro-grade triple rear camera with Best Take and Magic Editor, 6.7-inch Super Actua display, and 7 years of Pixel Feature Drops.",
        "price": 89999.0,
        "original_price": 106999.0,
        "retailers": [
            {"name": "Flipkart", "price": 89999.0, "original": 106999.0, "url": "https://www.flipkart.com/google-pixel-8-pro"}
        ],
        "specs": [
            ("processor", "Google Tensor G3 (Titan M2)", None),
            ("display", "6.7-inch Super Actua LTPO OLED, 120Hz, 2400 nits", None),
            ("rear_camera", "50MP Main + 48MP Ultra-Wide + 48MP 5x Telephoto", None),
            ("battery_charging", "5050mAh, 30W Fast Charging", None),
            ("water_resistance", "IP68", None),
            ("refresh_rate", "120Hz", None)
        ],
        "pros": ["Best-in-class computational photography", "Clean Pixel Android with exclusive AI features", "Super Actua display is stunning in sunlight"],
        "cons": ["Tensor G3 runs warm under extended gaming load", "Fingerprint scanner can be sluggish"],
        "reviews": ("Camera wizardry and clean software", "Thermal throttling in Indian summers", "The gold standard for mobile portrait and night photography.")
    },
    {
        "id": "prd_sp_oneplus12",
        "name": "OnePlus 12",
        "brand": "OnePlus",
        "category": "smartphones",
        "model_number": "CPH2573",
        "description": "OnePlus 12 powered by Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera System with 64MP 3x periscope lens, 5400mAh battery with 100W SUPERVOOC and 50W AIRVOOC wireless charging.",
        "price": 64999.0,
        "original_price": 69999.0,
        "retailers": [
            {"name": "Amazon India", "price": 64999.0, "original": 69999.0, "url": "https://www.amazon.in/dp/B0CQ7V31NL"},
            {"name": "OnePlus Store", "price": 64999.0, "original": 69999.0, "url": "https://www.oneplus.in/12"}
        ],
        "specs": [
            ("processor", "Snapdragon 8 Gen 3 (4nm)", None),
            ("display", "6.82-inch 2K ProXDR 120Hz LTPO, 4500 nits peak, Aqua Touch", None),
            ("rear_camera", "50MP LYT-808 + 64MP 3x Periscope + 48MP Ultra-Wide", None),
            ("battery_charging", "5400mAh, 100W SUPERVOOC (0-100% in 26m)", None),
            ("water_resistance", "IP65", None),
            ("refresh_rate", "120Hz LTPO", None)
        ],
        "pros": ["Blistering 100W wired and 50W wireless charging", "Superb 5400mAh battery runtime", "Hasselblad periscope zoom is tack sharp", "Aqua Touch lets you type in rain"],
        "cons": ["IP65 instead of full IP68 submersible rating", "Curved screen edges not preferred by all"],
        "reviews": ("Battery and charging monster", "Curved edges cause occasional accidental touches", "Unbeatable value compared to 1L+ competitors.")
    },
    {
        "id": "prd_sp_oneplus12r",
        "name": "OnePlus 12R",
        "brand": "OnePlus",
        "category": "smartphones",
        "model_number": "CPH2585",
        "description": "OnePlus 12R flagship killer with Snapdragon 8 Gen 2, 4th Gen LTPO 120Hz ProXDR display, 5500mAh battery, 100W SUPERVOOC charging, and 50MP Sony IMX890 OIS camera.",
        "price": 39999.0,
        "original_price": 42999.0,
        "retailers": [
            {"name": "Amazon India", "price": 39999.0, "original": 42999.0, "url": "https://www.amazon.in/dp/B0CQ7V64NL"},
            {"name": "OnePlus Store", "price": 39999.0, "original": 42999.0, "url": "https://www.oneplus.in/12r"}
        ],
        "specs": [
            ("processor", "Snapdragon 8 Gen 2 (4nm)", None),
            ("display", "6.78-inch 1.5K ProXDR LTPO4 120Hz, 4500 nits peak", None),
            ("rear_camera", "50MP Sony IMX890 OIS + 8MP Ultra-Wide + 2MP Macro", None),
            ("battery_charging", "5500mAh, 100W SUPERVOOC", None),
            ("water_resistance", "IP64", None),
            ("refresh_rate", "120Hz LTPO", None)
        ],
        "pros": ["Tremendous 5500mAh 2-day battery life", "Flagship tier LTPO4 ProXDR display", "Super smooth 120fps gaming support"],
        "cons": ["Secondary 8MP ultra-wide and 2MP macro are average", "No wireless charging"],
        "reviews": ("Definitive performance champ under 40k", "Auxiliary cameras are weak", "Top tier display, battery, and gaming performance.")
    },
    {
        "id": "prd_sp_xiaomi14",
        "name": "Xiaomi 14",
        "brand": "Xiaomi",
        "category": "smartphones",
        "model_number": "23127PN0CG",
        "description": "Xiaomi 14 with Leica Summilux optical lenses, Light Fusion 900 sensor, 75mm floating telephoto camera, Snapdragon 8 Gen 3, compact 6.36-inch 1.5K 120Hz LTPO display, and IP68 rating.",
        "price": 69999.0,
        "original_price": 79999.0,
        "retailers": [
            {"name": "Amazon India", "price": 69999.0, "original": 79999.0, "url": "https://www.amazon.in/dp/B0CW1M2XG4"},
            {"name": "Mi Store", "price": 69999.0, "original": 79999.0, "url": "https://store.mi.com/in/item/3241000007"}
        ],
        "specs": [
            ("processor", "Snapdragon 8 Gen 3 (4nm)", None),
            ("display", "6.36-inch 1.5K LTPO OLED, 120Hz, 3000 nits, Dolby Vision", None),
            ("rear_camera", "50MP Leica Main + 50MP Leica 75mm Floating Telephoto + 50MP Ultra-Wide", None),
            ("battery_charging", "4610mAh, 90W HyperCharge + 50W Wireless", None),
            ("water_resistance", "IP68", None),
            ("refresh_rate", "120Hz", None)
        ],
        "pros": ["Co-engineered Leica optics across all three lenses", "Compact flat display ergonomics", "90W wired + 50W wireless speeds"],
        "cons": ["HyperOS has occasional bloatware notifications", "Compact body warms up under heavy 4K 60fps recording"],
        "reviews": ("Sensational camera rendering and color tones", "HyperOS needs minor debloating", "Pocket-sized camera powerhouse.")
    },
    {
        "id": "prd_sp_iqoo12",
        "name": "iQOO 12 5G",
        "brand": "iQOO",
        "category": "smartphones",
        "model_number": "I2220",
        "description": "iQOO 12 powered by Snapdragon 8 Gen 3 and dedicated Q1 Supercomputing chip, 64MP 3x periscope telephoto camera, 144Hz 1.5K AMOLED display, and 120W FlashCharge.",
        "price": 52999.0,
        "original_price": 59999.0,
        "retailers": [
            {"name": "Amazon India", "price": 52999.0, "original": 59999.0, "url": "https://www.amazon.in/dp/B07WGPK6C2"}
        ],
        "specs": [
            ("processor", "Snapdragon 8 Gen 3 + Q1 Display Chip", None),
            ("display", "6.78-inch 1.5K LTPO AMOLED, 144Hz, 3000 nits", None),
            ("rear_camera", "50MP Main + 64MP 3x Periscope + 50MP Ultra-Wide", None),
            ("battery_charging", "5000mAh, 120W FlashCharge", None),
            ("water_resistance", "IP64", None),
            ("refresh_rate", "144Hz", None)
        ],
        "pros": ["Raw Snapdragon 8 Gen 3 speed for ₹53,000", "Dedicated 64MP periscope camera at this price point", "144Hz gaming display with frame interpolation"],
        "cons": ["Funtouch OS has notification spam out of box", "No wireless charging"],
        "reviews": ("Peak benchmark-shattering performance", "UI feels dated compared to clean Android", "Exceptional gaming and periscope camera value.")
    },
    {
        "id": "prd_sp_vivox100pro",
        "name": "Vivo X100 Pro",
        "brand": "Vivo",
        "category": "smartphones",
        "model_number": "V2324A",
        "description": "Vivo X100 Pro with ZEISS APO 1-inch 50MP Main sensor, ZEISS Multifocal portrait lens, MediaTek Dimensity 9300 chipset, V3 Imaging chip, 5400mAh battery, and 100W FlashCharge.",
        "price": 89999.0,
        "original_price": 96999.0,
        "retailers": [
            {"name": "Flipkart", "price": 89999.0, "original": 96999.0, "url": "https://www.flipkart.com/vivo-x100-pro"}
        ],
        "specs": [
            ("processor", "MediaTek Dimensity 9300 (4nm) + Vivo V3 Chip", None),
            ("display", "6.78-inch 1.5K LTPO AMOLED, 120Hz, 3000 nits", None),
            ("rear_camera", "50MP 1-inch Sony IMX989 + 50MP ZEISS APO Telephoto + 50MP Ultra-Wide", None),
            ("battery_charging", "5400mAh, 100W Wired + 50W Wireless", None),
            ("water_resistance", "IP68", None),
            ("refresh_rate", "120Hz", None)
        ],
        "pros": ["Industry-leading telephoto macro and portraiture", "Genuine 1-inch main sensor with ZEISS T* coating", "Massive 5400mAh battery"],
        "cons": ["Camera bump is substantial", "Funtouch OS aesthetic"],
        "reviews": ("King of mobile portrait photography", "Chunky camera island", "Produces studio-quality images with authentic bokeh.")
    },
    {
        "id": "prd_sp_nothingphone2",
        "name": "Nothing Phone (2)",
        "brand": "Nothing",
        "category": "smartphones",
        "model_number": "AIN065",
        "description": "Nothing Phone (2) with Glyph Interface 2.0, Snapdragon 8+ Gen 1, clean Nothing OS 2.5, 6.7-inch 120Hz LTPO OLED display, and dual 50MP Sony IMX890 cameras.",
        "price": 36999.0,
        "original_price": 44999.0,
        "retailers": [
            {"name": "Flipkart", "price": 36999.0, "original": 44999.0, "url": "https://www.flipkart.com/nothing-phone-2"}
        ],
        "specs": [
            ("processor", "Snapdragon 8+ Gen 1 (4nm)", None),
            ("display", "6.7-inch Flexible LTPO OLED, 1-120Hz, 1600 nits", None),
            ("rear_camera", "50MP Sony IMX890 OIS + 50MP Samsung JN1 Ultra-Wide", None),
            ("battery_charging", "4700mAh, 45W Fast Charging + 15W Qi Wireless", None),
            ("water_resistance", "IP54", None),
            ("refresh_rate", "120Hz LTPO", None)
        ],
        "pros": ["Unique Glyph light notification system", "Bloatware-free Nothing OS software experience", "Smooth LTPO display with symmetrical bezels"],
        "cons": ["No dedicated telephoto zoom lens", "IP54 splash resistance only"],
        "reviews": ("Design masterpiece with clean OS", "Cameras are good but not class-leading", "A breath of fresh air in generic smartphone design.")
    },
    {
        "id": "prd_sp_motoedge50pro",
        "name": "Motorola Edge 50 Pro",
        "brand": "Motorola",
        "category": "smartphones",
        "model_number": "XT2403-1",
        "description": "Motorola Edge 50 Pro with world's first Pantone validated camera and display, Snapdragon 7 Gen 3, 144Hz 1.5K pOLED curved display, 125W TurboPower charging, 50W wireless charging, and IP68.",
        "price": 31999.0,
        "original_price": 36999.0,
        "retailers": [
            {"name": "Flipkart", "price": 31999.0, "original": 36999.0, "url": "https://www.flipkart.com/motorola-edge-50-pro"}
        ],
        "specs": [
            ("processor", "Snapdragon 7 Gen 3 (4nm)", None),
            ("display", "6.7-inch 1.5K pOLED, 144Hz, 2000 nits, Pantone Validated", None),
            ("rear_camera", "50MP OIS + 10MP 3x Telephoto + 13MP Ultra-Wide Macro", None),
            ("battery_charging", "4500mAh, 125W TurboPower + 50W Wireless", None),
            ("water_resistance", "IP68", None),
            ("refresh_rate", "144Hz", None)
        ],
        "pros": ["IP68 and 50W wireless charging at ₹32k", "Dedicated 3x telephoto with OIS", "Vegan leather finish"],
        "cons": ["4500mAh battery is slightly conservative", "Curved screen prone to edge glare"],
        "reviews": ("Feature-packed mid-ranger with wireless charging", "Battery life is 1 day max", "Unbelievable hardware checklist for the asking price.")
    },
    {
        "id": "prd_sp_realme12proplus",
        "name": "Realme 12 Pro+ 5G",
        "brand": "Realme",
        "category": "smartphones",
        "model_number": "RMX3840",
        "description": "Realme 12 Pro+ featuring flagship 64MP periscope portrait camera with 3x optical and 120x SuperZoom, luxury watch design by Ollivier Saveo, vegan leather back, Snapdragon 7s Gen 2, and 120Hz curved AMOLED.",
        "price": 29999.0,
        "original_price": 34999.0,
        "retailers": [
            {"name": "Flipkart", "price": 29999.0, "original": 34999.0, "url": "https://www.flipkart.com/realme-12-pro-plus"}
        ],
        "specs": [
            ("processor", "Snapdragon 7s Gen 2 (4nm)", None),
            ("display", "6.7-inch FHD+ Curved AMOLED, 120Hz, 950 nits", None),
            ("rear_camera", "50MP Sony IMX890 OIS + 64MP 3x Periscope OIS + 8MP Ultra-Wide", None),
            ("battery_charging", "5000mAh, 67W SUPERVOOC", None),
            ("water_resistance", "IP65", None),
            ("refresh_rate", "120Hz", None)
        ],
        "pros": ["Periscope telephoto camera under ₹30,000", "Distinctive luxury horology back design", "Solid 5000mAh battery"],
        "cons": ["Snapdragon 7s Gen 2 is average for heavy 60fps gaming", "Peak brightness is lower than rivals"],
        "reviews": ("Superb portrait zoom for budget conscious photographers", "Processor limits hardcore gaming", "Brings periscope telephoto tech down to mid-range.")
    },
    {
        "id": "prd_sp_pocox6pro",
        "name": "Poco X6 Pro 5G",
        "brand": "Poco",
        "category": "smartphones",
        "model_number": "2311DRK48I",
        "description": "Poco X6 Pro powered by flagship-grade MediaTek Dimensity 8300-Ultra (1.46M+ AnTuTu), 1.5K 120Hz CrystalRes Flow AMOLED, LPDDR5X RAM, UFS 4.0 storage, and 67W Turbo Charge.",
        "price": 23999.0,
        "original_price": 30999.0,
        "retailers": [
            {"name": "Flipkart", "price": 23999.0, "original": 30999.0, "url": "https://www.flipkart.com/poco-x6-pro"}
        ],
        "specs": [
            ("processor", "MediaTek Dimensity 8300-Ultra (4nm)", None),
            ("display", "6.67-inch 1.5K Flow AMOLED, 120Hz, 1800 nits, Dolby Vision", None),
            ("rear_camera", "64MP OIS + 8MP Ultra-Wide + 2MP Macro", None),
            ("battery_charging", "5000mAh, 67W Turbo Charge", None),
            ("water_resistance", "IP54", None),
            ("refresh_rate", "120Hz", None)
        ],
        "pros": ["Unmatched 1.4M AnTuTu gaming benchmark at ₹24,000", "Fast LPDDR5X + UFS 4.0 storage", "Slim bezels on 1.5K AMOLED"],
        "cons": ["Plastic frame construction", "Average camera performance in low light"],
        "reviews": ("The uncontested gaming budget king", "Cameras are just functional", "Speed and fluid UI at an unbeatable price.")
    },
    {
        "id": "prd_sp_redminote13proplus",
        "name": "Redmi Note 13 Pro+ 5G",
        "brand": "Xiaomi",
        "category": "smartphones",
        "model_number": "23090RA98I",
        "description": "Redmi Note 13 Pro+ with flagship 200MP OIS camera with 4x in-sensor lossless zoom, IP68 water resistance, 120W HyperCharge, 3D curved 1.5K AMOLED, and Dimensity 7200-Ultra.",
        "price": 29999.0,
        "original_price": 33999.0,
        "retailers": [
            {"name": "Flipkart", "price": 29999.0, "original": 33999.0, "url": "https://www.flipkart.com/redmi-note-13-pro-plus"}
        ],
        "specs": [
            ("processor", "MediaTek Dimensity 7200-Ultra (4nm)", None),
            ("display", "6.67-inch 1.5K 3D Curved AMOLED, 120Hz, 1800 nits, Gorilla Glass Victus", None),
            ("rear_camera", "200MP Samsung ISOCELL HP3 OIS + 8MP Ultra-Wide + 2MP Macro", None),
            ("battery_charging", "5000mAh, 120W HyperCharge", None),
            ("water_resistance", "IP68", None),
            ("refresh_rate", "120Hz", None)
        ],
        "pros": ["Certified IP68 water resistance", "Ultra-fast 120W wired charging", "Detailed 200MP sensor captures immense detail"],
        "cons": ["HyperOS comes with bloatware pre-installed", "Auxiliary 8MP and 2MP cameras"],
        "reviews": ("Premium flagship-like build with IP68", "Software needs cleanup on first boot", "Solid all-rounder with hyper-fast charging.")
    },
    {
        "id": "prd_sp_samsunga55",
        "name": "Samsung Galaxy A55 5G",
        "brand": "Samsung",
        "category": "smartphones",
        "model_number": "SM-A556B",
        "description": "Samsung Galaxy A55 with metal frame, Gorilla Glass Victus+ front and back, Knox Vault security, IP67 dust and water resistance, Exynos 1480 with AMD Xclipse GPU, and 4 OS upgrades.",
        "price": 39999.0,
        "original_price": 42999.0,
        "retailers": [
            {"name": "Samsung India", "price": 39999.0, "original": 42999.0, "url": "https://www.samsung.com/in/smartphones/galaxy-a55/"}
        ],
        "specs": [
            ("processor", "Exynos 1480 with AMD Xclipse 530 GPU", None),
            ("display", "6.6-inch Super AMOLED, 120Hz, 1000 nits, Vision Booster", None),
            ("rear_camera", "50MP OIS + 12MP Ultra-Wide + 5MP Macro", None),
            ("battery_charging", "5000mAh, 25W Fast Charging", None),
            ("water_resistance", "IP67", None),
            ("refresh_rate", "120Hz", None)
        ],
        "pros": ["All-metal frame and Gorilla Glass Victus+ back", "Knox Vault enterprise security hardware", "IP67 waterproof rating"],
        "cons": ["Only 25W charging speed", "Bezels are thicker than competitors"],
        "reviews": ("Durable and trusted Samsung experience", "Charging is slow compared to Chinese rivals", "High quality materials with long update roadmap.")
    },
    {
        "id": "prd_sp_nordce4",
        "name": "OnePlus Nord CE4",
        "brand": "OnePlus",
        "category": "smartphones",
        "model_number": "CPH2613",
        "description": "OnePlus Nord CE4 powered by Snapdragon 7 Gen 3, 5500mAh battery with 100W SUPERVOOC charging, 120Hz AMOLED display with Aqua Touch, and 50MP Sony LYT-600 OIS camera.",
        "price": 24999.0,
        "original_price": 26999.0,
        "retailers": [
            {"name": "Amazon India", "price": 24999.0, "original": 26999.0, "url": "https://www.amazon.in/dp/B0CX21C8S1"}
        ],
        "specs": [
            ("processor", "Snapdragon 7 Gen 3 (4nm)", None),
            ("display", "6.7-inch FHD+ Fluid AMOLED, 120Hz, HDR10+", None),
            ("rear_camera", "50MP Sony LYT-600 OIS + 8MP Ultra-Wide", None),
            ("battery_charging", "5500mAh, 100W SUPERVOOC (0-100% in 29m)", None),
            ("water_resistance", "IP54", None),
            ("refresh_rate", "120Hz", None)
        ],
        "pros": ["5500mAh battery with 100W charging at ₹25k", "Clean OxygenOS experience", "Smooth day-to-day performance"],
        "cons": ["Plastic frame construction", "No alert slider"],
        "reviews": ("Superb battery endurance and fast charging", "Missing the iconic OnePlus alert slider", "Clean and reliable daily driver.")
    },
    {
        "id": "prd_sp_motog84",
        "name": "Motorola Moto G84 5G",
        "brand": "Motorola",
        "category": "smartphones",
        "model_number": "XT2347-2",
        "description": "Motorola Moto G84 featuring 120Hz 10-bit pOLED display, 50MP OIS camera, vegan leather finish in Pantone Viva Magenta, 12GB RAM, 256GB storage, and stereo speakers with Dolby Atmos.",
        "price": 17999.0,
        "original_price": 22999.0,
        "retailers": [
            {"name": "Flipkart", "price": 17999.0, "original": 22999.0, "url": "https://www.flipkart.com/motorola-g84"}
        ],
        "specs": [
            ("processor", "Snapdragon 695 5G (6nm)", None),
            ("display", "6.55-inch FHD+ 10-bit pOLED, 120Hz, 1300 nits", None),
            ("rear_camera", "50MP OIS + 8MP Ultra-Wide Macro", None),
            ("battery_charging", "5000mAh, 30W TurboPower", None),
            ("water_resistance", "IP54", None),
            ("refresh_rate", "120Hz", None)
        ],
        "pros": ["Generous 12GB RAM and 256GB storage under ₹18,000", "Lightweight 168g vegan leather design", "OIS on main camera"],
        "cons": ["Snapdragon 695 doesn't support 4K video recording", "Average low light camera"],
        "reviews": ("Best design and RAM capacity under 20k", "Processor shows age in 4K recording", "Unbeatable value for light users seeking premium finish.")
    }
]

# ==================== LAPTOPS (18) ====================
LAPTOPS = [
    {
        "id": "prd_lp_macbookairm2",
        "name": "Apple MacBook Air M2",
        "brand": "Apple",
        "category": "laptops",
        "model_number": "MLXW3HN/A",
        "description": "Apple MacBook Air with M2 chip, 13.6-inch Liquid Retina Display, 8GB Unified Memory, 256GB SSD Storage, 1080p FaceTime HD Camera, MagSafe 3 charging, and all-day 18-hour battery.",
        "price": 89990.0,
        "original_price": 99900.0,
        "retailers": [
            {"name": "Apple Store India", "price": 99900.0, "original": 99900.0, "url": "https://www.apple.com/in/macbook-air-m2/"},
            {"name": "Amazon India", "price": 89990.0, "original": 99900.0, "url": "https://www.amazon.in/dp/B0B3BPHX8C"},
            {"name": "Flipkart", "price": 89990.0, "original": 99900.0, "url": "https://www.flipkart.com/apple-macbook-air-m2"}
        ],
        "specs": [
            ("processor", "Apple M2 (8-core CPU, 8-core GPU)", None),
            ("ram_storage", "8GB Unified Memory, 256GB SSD", None),
            ("display", "13.6-inch Liquid Retina Display (2560x1664), 500 nits", None),
            ("battery_life", "18", "hours"),
            ("weight", "1.24", "kg")
        ],
        "pros": ["Silent fanless design runs completely cool", "Extraordinary 18-hour battery longevity", "MagSafe 3 dedicated charging port", "1.24kg ultra-thin 11.3mm unibody"],
        "cons": ["Base model 256GB SSD has single NAND chip", "External display support limited to one screen"],
        "reviews": ("Benchmark portable student & professional laptop", "External monitor limit can frustrate power users", "The undisputed king of battery life and everyday portability.")
    },
    {
        "id": "prd_lp_macbookairm3",
        "name": "Apple MacBook Air M3",
        "brand": "Apple",
        "category": "laptops",
        "model_number": "MRXN3HN/A",
        "description": "Apple MacBook Air 13-inch with M3 chip, support for dual external displays in clamshell mode, hardware-accelerated ray tracing, Wi-Fi 6E, and 16-core Neural Engine for on-device AI.",
        "price": 104990.0,
        "original_price": 114900.0,
        "retailers": [
            {"name": "Apple Store India", "price": 114900.0, "original": 114900.0, "url": "https://www.apple.com/in/macbook-air/"},
            {"name": "Amazon India", "price": 104990.0, "original": 114900.0, "url": "https://www.amazon.in/dp/B0CX23R9L3"}
        ],
        "specs": [
            ("processor", "Apple M3 (8-core CPU, 10-core GPU, Hardware Ray Tracing)", None),
            ("ram_storage", "16GB Unified Memory, 512GB SSD", None),
            ("display", "13.6-inch Liquid Retina (2560x1664), P3 Wide Color", None),
            ("battery_life", "18", "hours"),
            ("weight", "1.24", "kg")
        ],
        "pros": ["Dual external monitor support in clamshell mode", "Hardware-accelerated ray tracing on M3 GPU", "Faster 16-core Neural Engine for AI workflows"],
        "cons": ["Expensive storage upgrades", "No 120Hz ProMotion on Air line"],
        "reviews": ("Effortless speed and dual monitor capability", "Premium cost for RAM/SSD upgrades", "The ideal ultrabook for modern developers and digital creators.")
    },
    {
        "id": "prd_lp_macbookpro14m3",
        "name": "Apple MacBook Pro 14 M3 Pro",
        "brand": "Apple",
        "category": "laptops",
        "model_number": "MRX33HN/A",
        "description": "Apple MacBook Pro 14-inch with M3 Pro chip (11-core CPU, 14-core GPU), 14.2-inch Liquid Retina XDR ProMotion 120Hz display with 1600 nits HDR, HDMI 2.1, and SDXC card slot.",
        "price": 184900.0,
        "original_price": 199900.0,
        "retailers": [
            {"name": "Apple Store India", "price": 199900.0, "original": 199900.0, "url": "https://www.apple.com/in/macbook-pro-14-and-16/"},
            {"name": "Amazon India", "price": 184900.0, "original": 199900.0, "url": "https://www.amazon.in/dp/B0CM59NV2Y"}
        ],
        "specs": [
            ("processor", "Apple M3 Pro (11-core CPU, 14-core GPU)", None),
            ("ram_storage", "18GB Unified Memory, 512GB SSD", None),
            ("display", "14.2-inch Liquid Retina XDR (3024x1964), 120Hz ProMotion, 1600 nits HDR", None),
            ("battery_life", "17", "hours"),
            ("weight", "1.61", "kg")
        ],
        "pros": ["Reference-grade Mini-LED XDR display with 120Hz", "Studio-quality 6-speaker sound system with Spatial Audio", "Comprehensive ports: HDMI, SDXC, 3x Thunderbolt 4"],
        "cons": ["Thicker, heavier chassis at 1.61kg", "High price tier"],
        "reviews": ("Peerless display and audio quality in a laptop", "Heavier in a backpack than the Air", "The definitive machine for video editors, music producers, and engineers.")
    },
    {
        "id": "prd_lp_dellxps13",
        "name": "Dell XPS 13 9340",
        "brand": "Dell",
        "category": "laptops",
        "model_number": "XPS9340-7988SLV",
        "description": "Dell XPS 13 crafted with machined CNC aluminum and Gorilla Glass 3, Intel Core Ultra 7 155H with Intel AI Boost NPU, seamless glass touchpad with haptics, and capacitive touch function row.",
        "price": 139990.0,
        "original_price": 154990.0,
        "retailers": [
            {"name": "Dell India", "price": 144990.0, "original": 154990.0, "url": "https://www.dell.com/en-in/shop/dell-laptops/xps-13-laptop/"},
            {"name": "Amazon India", "price": 139990.0, "original": 154990.0, "url": "https://www.amazon.in/dp/B0D1KQ79LM"}
        ],
        "specs": [
            ("processor", "Intel Core Ultra 7 155H (16-core, Intel Arc Graphics)", None),
            ("ram_storage", "16GB LPDDR5X 7467MHz, 1TB PCIe NVMe SSD", None),
            ("display", "13.4-inch FHD+ InfinityEdge (1920x1200), 500 nits, 120Hz", None),
            ("battery_life", "14", "hours"),
            ("weight", "1.19", "kg")
        ],
        "pros": ["Futuristic minimalist seamless glass haptic touchpad", "Lightweight 1.19kg chassis", "Intel AI Boost NPU for local AI tasks"],
        "cons": ["Only 2x Thunderbolt 4 ports (no headphone jack)", "Capacitive function keys require getting used to"],
        "reviews": ("Sleekest Windows ultrabook on earth", "Missing headphone jack is controversial", "Engineering showcase of modern Windows hardware.")
    },
    {
        "id": "prd_lp_thinkpadx1",
        "name": "Lenovo ThinkPad X1 Carbon Gen 12",
        "brand": "Lenovo",
        "category": "laptops",
        "model_number": "21KC005UUS",
        "description": "Lenovo ThinkPad X1 Carbon Gen 12 enterprise ultrabook with carbon-fiber reinforced chassis, Intel Core Ultra 7 155H, legendary ThinkPad keyboard with redesigned TrackPoint quick menu, and MIL-SPEC 810H durability.",
        "price": 169990.0,
        "original_price": 189990.0,
        "retailers": [
            {"name": "Lenovo India", "price": 169990.0, "original": 189990.0, "url": "https://www.lenovo.com/in/en/p/laptops/thinkpad/thinkpadx1/"}
        ],
        "specs": [
            ("processor", "Intel Core Ultra 7 155H with Intel vPro", None),
            ("ram_storage", "32GB LPDDR5X, 1TB Gen 4 Performance SSD", None),
            ("display", "14-inch 2.8K OLED (2880x1800), 120Hz, 400 nits, HDR True Black 500", None),
            ("battery_life", "13", "hours"),
            ("weight", "1.09", "kg")
        ],
        "pros": ["Featherlight 1.09kg weight with MIL-STD-810H toughness", "World's best laptop keyboard experience", "Sensational 2.8K 120Hz OLED display panel"],
        "cons": ["Premium business pricing", "Battery life shorter on high-res OLED model"],
        "reviews": ("The ultimate corporate executive laptop", "Expensive enterprise positioning", "Unmatched keyboard and featherweight durability.")
    },
    {
        "id": "prd_lp_asuszephyrusg14",
        "name": "ASUS ROG Zephyrus G14 (2024)",
        "brand": "ASUS",
        "category": "laptops",
        "model_number": "GA403UI-QS048W",
        "description": "ASUS ROG Zephyrus G14 with CNC machined aluminum unibody, Slash Lighting LED array, AMD Ryzen 9 8945HS with Ryzen AI, NVIDIA GeForce RTX 4070 (90W), and ROG Nebula 3K 120Hz OLED.",
        "price": 174990.0,
        "original_price": 194990.0,
        "retailers": [
            {"name": "Amazon India", "price": 174990.0, "original": 194990.0, "url": "https://www.amazon.in/dp/B0D382B21S"},
            {"name": "ASUS Store India", "price": 179990.0, "original": 194990.0, "url": "https://in.store.asus.com/rog-zephyrus-g14-2024"}
        ],
        "specs": [
            ("processor", "AMD Ryzen 9 8945HS (8 cores, 16 threads, 5.2GHz)", None),
            ("ram_storage", "32GB LPDDR5X 6400MHz, 1TB PCIe 4.0 NVMe SSD", None),
            ("display", "14-inch 3K (2880x1800) ROG Nebula OLED, 120Hz, 0.2ms, 500 nits, G-SYNC", None),
            ("battery_life", "10", "hours"),
            ("weight", "1.50", "kg")
        ],
        "pros": ["Thinnest premium gaming laptop at 1.59cm and 1.5kg", "Breathtaking 3K 120Hz OLED display with G-SYNC", "Powerful RTX 4070 handles AAA games at 1440p", "Slash Lighting lid customization"],
        "cons": ["RAM is soldered to motherboard", "Fans can get loud under Turbo profile"],
        "reviews": ("MacBook-level build quality with RTX gaming power", "Soldered memory limits future upgrades", "The undisputed champion of 14-inch Windows gaming ultrabooks.")
    },
    {
        "id": "prd_lp_legionpro5",
        "name": "Lenovo Legion Pro 5i Gen 9",
        "brand": "Lenovo",
        "category": "laptops",
        "model_number": "16IRX9",
        "description": "Lenovo Legion Pro 5i equipped with Intel Core i7-14700HX (20 cores), NVIDIA GeForce RTX 4060 8GB (140W TGP), Legion ColdFront 5.0 cooling, and 16-inch WQXGA 240Hz 500 nits gaming display.",
        "price": 139990.0,
        "original_price": 159990.0,
        "retailers": [
            {"name": "Amazon India", "price": 139990.0, "original": 159990.0, "url": "https://www.amazon.in/dp/B0CW1C7X7L"},
            {"name": "Lenovo India", "price": 142990.0, "original": 159990.0, "url": "https://www.lenovo.com/in/en/p/laptops/legion-laptops/legion-5-series/legion-pro-5i-gen-9"}
        ],
        "specs": [
            ("processor", "Intel Core i7-14700HX (20 cores, 28 threads, up to 5.5GHz)", None),
            ("ram_storage", "16GB DDR5 5600MHz (expandable), 1TB SSD", None),
            ("display", "16-inch WQXGA (2560x1600) IPS, 240Hz, 500 nits, G-SYNC, 100% sRGB", None),
            ("battery_life", "6", "hours"),
            ("weight", "2.50", "kg")
        ],
        "pros": ["Full-powered 140W TGP RTX 4060 graphics", "Super smooth 240Hz 500-nit 16:10 display", "Upgradable dual RAM and M.2 SSD slots"],
        "cons": ["Heavier 2.5kg chassis plus 300W power brick", "Battery life under heavy gaming is 2-3 hours"],
        "reviews": ("Phenomenal thermal performance and high FPS", "Bulky power adapter to carry around", "Workhorse gaming and 3D rendering machine.")
    },
    {
        "id": "prd_lp_asuszenbook14",
        "name": "ASUS Zenbook 14 OLED (2024)",
        "brand": "ASUS",
        "category": "laptops",
        "model_number": "UX3405MA-QD752WS",
        "description": "ASUS Zenbook 14 OLED with all-metal chassis, Intel Core Ultra 7 155H with Intel Arc Graphics, 14-inch 3K 120Hz ASUS Lumina OLED display, 75Wh battery with up to 15 hours runtime, and Harman Kardon audio.",
        "price": 99990.0,
        "original_price": 114990.0,
        "retailers": [
            {"name": "Amazon India", "price": 99990.0, "original": 114990.0, "url": "https://www.amazon.in/dp/B0CS5X81NL"}
        ],
        "specs": [
            ("processor", "Intel Core Ultra 7 155H (16 cores, Intel Arc GPU)", None),
            ("ram_storage", "16GB LPDDR5X, 1TB PCIe 4.0 SSD", None),
            ("display", "14-inch 3K (2880x1800) Lumina OLED, 120Hz, 600 nits HDR, 100% DCI-P3", None),
            ("battery_life", "15", "hours"),
            ("weight", "1.20", "kg")
        ],
        "pros": ["Splendid 3K 120Hz OLED screen under 1 Lakh", "Big 75Wh battery provides true full-day stamina", "Comprehensive port selection with full-size HDMI & USB-A"],
        "cons": ["Glossy screen has reflections outdoors", "Soldered RAM"],
        "reviews": ("Best value OLED ultrabook of the year", "Screen is reflective under direct ceiling lights", "Premium finish, long battery, and incredible OLED colors.")
    },
    {
        "id": "prd_lp_hpspectrex360",
        "name": "HP Spectre x360 14 (2024)",
        "brand": "HP",
        "category": "laptops",
        "model_number": "14-eu0002TU",
        "description": "HP Spectre x360 2-in-1 convertible laptop featuring Intel Core Ultra 7 155H, 14-inch 2.8K 120Hz OLED touchscreen, 9MP wide-angle camera with AI framing, haptic touchpad, and bundled MPP 2.0 tilt pen.",
        "price": 154990.0,
        "original_price": 174990.0,
        "retailers": [
            {"name": "HP Store India", "price": 154990.0, "original": 174990.0, "url": "https://www.hp.com/in-en/shop/hp-spectre-x360-14.html"}
        ],
        "specs": [
            ("processor", "Intel Core Ultra 7 155H with NPU", None),
            ("ram_storage", "32GB LPDDR5X, 1TB NVMe SSD", None),
            ("display", "14-inch 2.8K (2880x1800) OLED Touch, 120Hz, 500 nits, Pen Supported", None),
            ("battery_life", "13", "hours"),
            ("weight", "1.44", "kg")
        ],
        "pros": ["Versatile 360-degree convertible hinge with bundled stylus", "Market-leading 9MP webcam for video conferences", "Gorgeous gem-cut aluminum chassis"],
        "cons": ["Tablet mode is heavy for one-handed reading", "Price sits at top of convertible market"],
        "reviews": ("The pinnacle of 2-in-1 Windows design", "A bit chunky when held as a tablet", "Superb stylus experience and top-tier videoconferencing.")
    },
    {
        "id": "prd_lp_hpenvyx360",
        "name": "HP Envy x360 14",
        "brand": "HP",
        "category": "laptops",
        "model_number": "14-fc0078TU",
        "description": "HP Envy x360 14 convertible laptop with Intel Core Ultra 5 125U, 14-inch 2.8K 120Hz OLED touchscreen, Copilot physical key, 5MP IR webcam with privacy shutter, and Poly Studio tuned audio.",
        "price": 84990.0,
        "original_price": 99990.0,
        "retailers": [
            {"name": "Amazon India", "price": 84990.0, "original": 99990.0, "url": "https://www.amazon.in/dp/B0CXP891NL"}
        ],
        "specs": [
            ("processor", "Intel Core Ultra 5 125U (12 cores, 14 threads)", None),
            ("ram_storage", "16GB LPDDR5, 512GB PCIe Gen 4 SSD", None),
            ("display", "14-inch 2.8K OLED Touchscreen (2880x1800), 120Hz, 500 nits", None),
            ("battery_life", "12", "hours"),
            ("weight", "1.39", "kg")
        ],
        "pros": ["Affordable 2-in-1 with 2.8K 120Hz OLED panel", "5MP webcam with crisp facial recognition", "Sturdy aluminum hinge construction"],
        "cons": ["Core Ultra 5 125U has lower graphics performance than H-series", "Pen sold separately in some configurations"],
        "reviews": ("Terrific balance of touchscreen and OLED display", "Modest GPU capability for gaming", "Exceptional everyday hybrid laptop for students and creatives.")
    },
    {
        "id": "prd_lp_predatorhelios16",
        "name": "Acer Predator Helios 16",
        "brand": "Acer",
        "category": "laptops",
        "model_number": "PH16-72",
        "description": "Acer Predator Helios 16 hardcore gaming laptop powered by 14th Gen Intel Core i9-14900HX, NVIDIA GeForce RTX 4080 (175W max TGP), 5th Gen AeroBlade 3D fans with liquid metal, and 240Hz WQXGA display.",
        "price": 199990.0,
        "original_price": 229990.0,
        "retailers": [
            {"name": "Amazon India", "price": 199990.0, "original": 229990.0, "url": "https://www.amazon.in/dp/B0CW1C7X9A"}
        ],
        "specs": [
            ("processor", "Intel Core i9-14900HX (24 cores, 32 threads, up to 5.8GHz)", None),
            ("ram_storage", "32GB DDR5 5600MHz, 1TB PCIe Gen 4 SSD", None),
            ("display", "16-inch WQXGA (2560x1600) IPS, 240Hz, 500 nits, 100% DCI-P3, G-SYNC", None),
            ("battery_life", "5", "hours"),
            ("weight", "2.65", "kg")
        ],
        "pros": ["Massive 175W RTX 4080 delivers deskop-class gaming frames", "Liquid metal thermal paste keeps 24-core i9 in check", "240Hz 500-nit fast response gaming panel"],
        "cons": ["Heavy 2.65kg weight and loud maximum fan profile", "Poor off-plug battery endurance"],
        "reviews": ("Total beast for 4K ray-traced gaming and rendering", "Requires a backpack with heavy-duty padding", "Desktop replacement tier performance.")
    },
    {
        "id": "prd_lp_acerswiftgo14",
        "name": "Acer Swift Go 14 OLED",
        "brand": "Acer",
        "category": "laptops",
        "model_number": "SFG14-73",
        "description": "Acer Swift Go 14 AI-ready laptop with Intel Core Ultra 5 125H, Intel Arc graphics, 14-inch 2.8K 90Hz OLED display with 100% DCI-P3, 1440p QHD webcam with temporal noise reduction, and 1.32kg lightweight aluminum build.",
        "price": 69990.0,
        "original_price": 79990.0,
        "retailers": [
            {"name": "Amazon India", "price": 69990.0, "original": 79990.0, "url": "https://www.amazon.in/dp/B0CS5X81KL"}
        ],
        "specs": [
            ("processor", "Intel Core Ultra 5 125H (14 cores, Intel Arc)", None),
            ("ram_storage", "16GB LPDDR5X, 512GB PCIe Gen 4 SSD", None),
            ("display", "14-inch 2.8K (2880x1800) OLED, 90Hz, 500 nits, 100% DCI-P3", None),
            ("battery_life", "11", "hours"),
            ("weight", "1.32", "kg")
        ],
        "pros": ["2.8K OLED display under ₹70,000", "Clear 1440p webcam for Zoom and Teams", "Full port variety including MicroSD card slot"],
        "cons": ["Touchpad is physical click rather than haptic", "Speakers are average"],
        "reviews": ("Phenomenal value for an OLED laptop under 70k", "Speaker audio is a bit tinny", "Clear crisp display and capable Intel Arc graphics.")
    },
    {
        "id": "prd_lp_galaxybook4pro",
        "name": "Samsung Galaxy Book4 Pro",
        "brand": "Samsung",
        "category": "laptops",
        "model_number": "NP940XGK",
        "description": "Samsung Galaxy Book4 Pro ultra-slim notebook featuring Intel Core Ultra 7 155H, 14-inch Dynamic AMOLED 2X 120Hz display with anti-reflective glass, AKG quad speakers, and seamless Galaxy Phone-Tablet ecosystem integration.",
        "price": 131990.0,
        "original_price": 145990.0,
        "retailers": [
            {"name": "Samsung India", "price": 131990.0, "original": 145990.0, "url": "https://www.samsung.com/in/computers/galaxy-book/galaxy-book4-pro/"}
        ],
        "specs": [
            ("processor", "Intel Core Ultra 7 155H with Intel Arc", None),
            ("ram_storage", "16GB LPDDR5X, 512GB NVMe SSD", None),
            ("display", "14-inch 3K (2880x1800) Dynamic AMOLED 2X, 120Hz, Anti-Reflective", None),
            ("battery_life", "18", "hours"),
            ("weight", "1.23", "kg")
        ],
        "pros": ["Anti-reflective coating on AMOLED display", "Super thin 11.6mm aluminum unibody", "Second Screen tablet integration with Galaxy Tab"],
        "cons": ["Limited key travel on ultra-thin chassis", "Pricey compared to standard ultrabooks"],
        "reviews": ("The MacBook Air equivalent for Samsung Galaxy users", "Keyboard travel is relatively shallow", "Display coating cuts glare better than any rival.")
    },
    {
        "id": "prd_lp_dellxps15",
        "name": "Dell XPS 15 9530",
        "brand": "Dell",
        "category": "laptops",
        "model_number": "XPS9530-9430SLV",
        "description": "Dell XPS 15 creator workstation with 13th Gen Intel Core i7-13700H, NVIDIA GeForce RTX 4050 6GB graphics, 15.6-inch 3.5K OLED InfinityEdge touchscreen, CNC aluminum and carbon fiber palm rest.",
        "price": 179990.0,
        "original_price": 199990.0,
        "retailers": [
            {"name": "Dell India", "price": 179990.0, "original": 199990.0, "url": "https://www.dell.com/en-in/shop/dell-laptops/xps-15-laptop/"}
        ],
        "specs": [
            ("processor", "Intel Core i7-13700H (14 cores, up to 5.0GHz)", None),
            ("ram_storage", "32GB DDR5 4800MHz (upgradable), 1TB SSD", None),
            ("display", "15.6-inch 3.5K (3456x2160) OLED Touch, 400 nits, 100% DCI-P3", None),
            ("battery_life", "9", "hours"),
            ("weight", "1.92", "kg")
        ],
        "pros": ["Large 15.6-inch 3.5K OLED touchscreen", "Carbon fiber palm rest stays cool and resists fingerprints", "Dual SODIMM RAM slots allow upgrades to 64GB"],
        "cons": ["720p webcam is outdated for 2024", "Only USB-C ports (comes with USB-A/HDMI dongle)"],
        "reviews": ("Masterclass in industrial creator design", "720p webcam is a disappointment at this price", "Beloved workstation for architects, videographers, and coders.")
    },
    {
        "id": "prd_lp_lggram16",
        "name": "LG Gram 16 (2024)",
        "brand": "LG",
        "category": "laptops",
        "model_number": "16Z90S",
        "description": "LG Gram 16 featherweight laptop with massive 16-inch WQXGA anti-glare IPS display, Intel Core Ultra 7 155H, 77Wh high-capacity battery, magnesium-alloy chassis weighing just 1.19kg, and MIL-STD-810H durability.",
        "price": 119990.0,
        "original_price": 139990.0,
        "retailers": [
            {"name": "Amazon India", "price": 119990.0, "original": 139990.0, "url": "https://www.amazon.in/dp/B0CS5X81ZZ"}
        ],
        "specs": [
            ("processor", "Intel Core Ultra 7 155H with Intel Arc", None),
            ("ram_storage", "16GB LPDDR5X, 1TB NVMe SSD (dual slot)", None),
            ("display", "16-inch WQXGA (2560x1600) Anti-Glare IPS, 350 nits, 99% DCI-P3", None),
            ("battery_life", "19", "hours"),
            ("weight", "1.19", "kg")
        ],
        "pros": ["Mind-boggling 1.19kg weight for a full 16-inch laptop", "Huge 19-hour real world battery capacity", "Includes numeric keypad and full size HDMI"],
        "cons": ["Chassis flexes slightly under hard pressure", "Speakers are average"],
        "reviews": ("Incredible large-screen portability", "Magnesium alloy body feels lighter than expected", "The dream machine for travelers who need a big workspace.")
    },
    {
        "id": "prd_lp_macbookpro16m3max",
        "name": "Apple MacBook Pro 16 M3 Max",
        "brand": "Apple",
        "category": "laptops",
        "model_number": "MUW63HN/A",
        "description": "Apple MacBook Pro 16-inch with M3 Max (16-core CPU, 40-core GPU), 48GB Unified Memory, 1TB SSD, 16.2-inch Liquid Retina XDR 120Hz display with 1600 nits HDR, and 22-hour marathon battery.",
        "price": 349900.0,
        "original_price": 399900.0,
        "retailers": [
            {"name": "Apple Store India", "price": 399900.0, "original": 399900.0, "url": "https://www.apple.com/in/macbook-pro-14-and-16/"},
            {"name": "Amazon India", "price": 349900.0, "original": 399900.0, "url": "https://www.amazon.in/dp/B0CM5B3X9L"}
        ],
        "specs": [
            ("processor", "Apple M3 Max (16-core CPU, 40-core GPU, 128-core Neural Engine)", None),
            ("ram_storage", "48GB Unified Memory, 1TB PCIe SSD", None),
            ("display", "16.2-inch Liquid Retina XDR (3456x2234), 120Hz ProMotion, 1600 nits", None),
            ("battery_life", "22", "hours"),
            ("weight", "2.16", "kg")
        ],
        "pros": ["Handles full 8K multi-stream RAW video editing and 3D rendering on battery", "Phenomenal 22-hour battery life", "40-core GPU rivals high-end desktop workstation GPUs"],
        "cons": ["Substantial 2.16kg weight", "Significant financial investment"],
        "reviews": ("The undisputed zenith of mobile computing power", "Heavy in a backpack", "Compiles code and renders 3D models with zero fan noise.")
    },
    {
        "id": "prd_lp_lenovoyogaslim7x",
        "name": "Lenovo Yoga Slim 7x Copilot+ PC",
        "brand": "Lenovo",
        "category": "laptops",
        "model_number": "83ED000TUS",
        "description": "Lenovo Yoga Slim 7x Copilot+ PC powered by Snapdragon X Elite (12 cores, 45 TOPS NPU), 14.5-inch 3K 90Hz PureSight OLED display, 70Wh battery with multi-day runtime, and 1.28kg Cosmic Blue aluminum unibody.",
        "price": 149990.0,
        "original_price": 164990.0,
        "retailers": [
            {"name": "Lenovo India", "price": 149990.0, "original": 164990.0, "url": "https://www.lenovo.com/in/en/p/laptops/yoga/yoga-slim-series/yoga-slim-7x-gen-9"}
        ],
        "specs": [
            ("processor", "Qualcomm Snapdragon X Elite X1E-78-100 (12 cores, 45 TOPS NPU)", None),
            ("ram_storage", "16GB LPDDR5X, 1TB PCIe 4.0 SSD", None),
            ("display", "14.5-inch 3K (2944x1840) PureSight OLED, 90Hz, 1000 nits peak, Touch", None),
            ("battery_life", "20", "hours"),
            ("weight", "1.28", "kg")
        ],
        "pros": ["Snapdragon X Elite matches Apple Silicon in battery efficiency", "45 TOPS NPU unlocks on-device Windows Copilot+ AI features", "Breathtaking 14.5-inch 3K 1000-nit OLED display"],
        "cons": ["Some legacy x86 anti-cheat gaming titles unsupported on ARM", "No USB-A port"],
        "reviews": ("Windows has finally matched Mac battery life", "Check legacy software compatibility for niche tools", "Super silent, cool-running, and razor-sharp OLED screen.")
    },
    {
        "id": "prd_lp_msistealth14",
        "name": "MSI Stealth 14 Studio",
        "brand": "MSI",
        "category": "laptops",
        "model_number": "A13VF-014IN",
        "description": "MSI Stealth 14 Studio magnesium-aluminum alloy gaming and creator laptop featuring 13th Gen Intel Core i7-13700H, NVIDIA GeForce RTX 4060 8GB, 14-inch QHD+ 240Hz 100% DCI-P3 display, and vapor chamber cooling.",
        "price": 144990.0,
        "original_price": 164990.0,
        "retailers": [
            {"name": "Amazon India", "price": 144990.0, "original": 164990.0, "url": "https://www.amazon.in/dp/B0BS5K81ML"}
        ],
        "specs": [
            ("processor", "Intel Core i7-13700H (14 cores, 20 threads)", None),
            ("ram_storage", "16GB DDR5 (expandable to 64GB), 1TB NVMe SSD", None),
            ("display", "14-inch QHD+ (2560x1600) IPS, 240Hz, 100% DCI-P3", None),
            ("battery_life", "7", "hours"),
            ("weight", "1.70", "kg")
        ],
        "pros": ["Blazing 240Hz QHD+ display for competitive esports", "Vapor chamber cooling in compact 14-inch body", "Dual upgradable SODIMM RAM slots"],
        "cons": ["Fans get loud under full gaming profile", "Chassis gets warm around keyboard deck"],
        "reviews": ("Ultra-portable gaming and video editing package", "Requires a flat desk for optimal airflow", "Super fast 240Hz panel with great color accuracy.")
    }
]
print(f"Loaded {len(SMARTPHONES)} smartphones and {len(LAPTOPS)} laptops.")

