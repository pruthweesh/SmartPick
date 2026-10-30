"""
Seed Data Part 3: Tablets (17) and Smart Living (17)
"""

TABLETS = [
    {
        "id": "prd_tb_ipadprom4_11",
        "name": "Apple iPad Pro 11-inch M4",
        "brand": "Apple",
        "category": "tablets",
        "model_number": "MVV83HN/A",
        "description": "Apple iPad Pro 11-inch with ground-breaking Ultra Retina XDR tandem OLED display, Apple M4 chip with 10-core GPU and hardware ray tracing, breakthrough 5.3mm ultra-thin design, and Apple Pencil Pro support.",
        "price": 99900.0,
        "original_price": 99900.0,
        "retailers": [
            {"name": "Apple Store India", "price": 99900.0, "original": 99900.0, "url": "https://www.apple.com/in/ipad-pro/"},
            {"name": "Amazon India", "price": 96900.0, "original": 99900.0, "url": "https://www.amazon.in/dp/B0D3J178NL"}
        ],
        "specs": [
            ("display", "11-inch Ultra Retina Tandem OLED (2420x1668), 120Hz ProMotion, 1000 nits full-screen", None),
            ("processor", "Apple M4 (9-core CPU, 10-core GPU, 16-core NPU)", None),
            ("battery_life", "10", "hours"),
            ("storage", "256GB SSD", None),
            ("weight", "444", "g")
        ],
        "pros": ["Tandem OLED panel delivers the world's most advanced tablet display", "Thinnest Apple product ever at just 5.3mm", "Apple M4 chip is blazing fast for Logic Pro and Final Cut"],
        "cons": ["iPadOS limits full desktop Mac multitasking", "Magic Keyboard and Pencil Pro sold separately"],
        "reviews": ("The hardware is 5 years ahead of any other tablet", "iPadOS holds back this immense M4 computing power", "The Tandem OLED screen is a revelation for digital artists.")
    },
    {
        "id": "prd_tb_ipadprom4_13",
        "name": "Apple iPad Pro 13-inch M4",
        "brand": "Apple",
        "category": "tablets",
        "model_number": "MVX23HN/A",
        "description": "Apple iPad Pro 13-inch with Ultra Retina XDR Tandem OLED, M4 chip, 5.1mm ultra-thin chassis, landscape front camera with Center Stage, 4 studio-quality mics, and 4-speaker audio.",
        "price": 129900.0,
        "original_price": 129900.0,
        "retailers": [
            {"name": "Apple Store India", "price": 129900.0, "original": 129900.0, "url": "https://www.apple.com/in/ipad-pro/"},
            {"name": "Amazon India", "price": 125900.0, "original": 129900.0, "url": "https://www.amazon.in/dp/B0D3J227ZZ"}
        ],
        "specs": [
            ("display", "13-inch Ultra Retina Tandem OLED (2752x2064), 1600 nits HDR, 120Hz ProMotion", None),
            ("processor", "Apple M4 (10-core CPU, 10-core GPU)", None),
            ("battery_life", "10", "hours"),
            ("storage", "256GB SSD", None),
            ("weight", "579", "g")
        ],
        "pros": ["Massive 13-inch canvas for illustration and color grading", "Crazy 5.1mm thin profile is lighter than previous 12.9-inch model", "ProMotion 120Hz and 1600 nits peak HDR"],
        "cons": ["Substantial financial investment", "No 3.5mm headphone jack"],
        "reviews": ("The premier creative canvas on the planet", "High price when bundled with keyboard and stylus", "Editing 4K footage and drawing with Pencil Pro is seamless.")
    },
    {
        "id": "prd_tb_ipadairm2_11",
        "name": "Apple iPad Air 11-inch M2",
        "brand": "Apple",
        "category": "tablets",
        "model_number": "MUWC3HN/A",
        "description": "Apple iPad Air 11-inch with M2 chip, Liquid Retina display with P3 wide color and anti-reflective coating, landscape 12MP Ultra Wide front camera with Center Stage, and Wi-Fi 6E.",
        "price": 57900.0,
        "original_price": 59900.0,
        "retailers": [
            {"name": "Apple Store India", "price": 59900.0, "original": 59900.0, "url": "https://www.apple.com/in/ipad-air/"},
            {"name": "Amazon India", "price": 57900.0, "original": 59900.0, "url": "https://www.amazon.in/dp/B0D3J781KL"}
        ],
        "specs": [
            ("display", "11-inch Liquid Retina Display (2360x1640), 500 nits, P3 Wide Color", None),
            ("processor", "Apple M2 (8-core CPU, 9-core GPU)", None),
            ("battery_life", "10", "hours"),
            ("storage", "128GB SSD", None),
            ("weight", "462", "g")
        ],
        "pros": ["M2 silicon brings immense power to sub-60k price", "Landscape front camera is centered for Zoom and FaceTime", "Base storage doubled to 128GB"],
        "cons": ["Display is 60Hz (no ProMotion)", "FaceID absent (uses Touch ID on top button)"],
        "reviews": ("The sensible iPad choice for 95% of users", "Wish it had 120Hz at 58k", "Ideal tablet for students, notes, media, and light design.")
    },
    {
        "id": "prd_tb_ipad10thgen",
        "name": "Apple iPad (10th Generation)",
        "brand": "Apple",
        "category": "tablets",
        "model_number": "MPQ03HN/A",
        "description": "Apple iPad (10th Gen) with all-screen 10.9-inch Liquid Retina display, A14 Bionic chip, landscape 12MP front camera with Center Stage, USB-C connectivity, and Touch ID in top button.",
        "price": 32900.0,
        "original_price": 34900.0,
        "retailers": [
            {"name": "Apple Store India", "price": 34900.0, "original": 34900.0, "url": "https://www.apple.com/in/ipad-10.9/"},
            {"name": "Amazon India", "price": 32900.0, "original": 34900.0, "url": "https://www.amazon.in/dp/B0BJL971LN"}
        ],
        "specs": [
            ("display", "10.9-inch Liquid Retina Display (2360x1640), 500 nits, True Tone", None),
            ("processor", "Apple A14 Bionic (6-core CPU, 4-core GPU)", None),
            ("battery_life", "10", "hours"),
            ("storage", "64GB Storage", None),
            ("weight", "477", "g")
        ],
        "pros": ["Modern flat-edge all-screen iPad design under 35k", "Landscape Center Stage camera keeps you framed on video calls", "Universal USB-C charging port"],
        "cons": ["Base model has only 64GB storage", "Screen is non-laminated with slight air gap"],
        "reviews": ("Great everyday family tablet for video and reading", "64GB base storage fills up quickly with games", "The default iPad recommendation for entertainment.")
    },
    {
        "id": "prd_tb_galaxytabs9ultra",
        "name": "Samsung Galaxy Tab S9 Ultra",
        "brand": "Samsung",
        "category": "tablets",
        "model_number": "SM-X910N",
        "description": "Samsung Galaxy Tab S9 Ultra massive 14.6-inch Dynamic AMOLED 2X 120Hz display, IP68 water and dust resistance, bundled S Pen with bi-directional charging, Snapdragon 8 Gen 2 for Galaxy, and Samsung DeX desktop mode.",
        "price": 108999.0,
        "original_price": 125999.0,
        "retailers": [
            {"name": "Samsung India", "price": 108999.0, "original": 125999.0, "url": "https://www.samsung.com/in/tablets/galaxy-tab-s/galaxy-tab-s9-ultra/"},
            {"name": "Amazon India", "price": 105999.0, "original": 125999.0, "url": "https://www.amazon.in/dp/B0CC9L44NL"}
        ],
        "specs": [
            ("display", "14.6-inch Dynamic AMOLED 2X (2960x1848), 120Hz, HDR10+", None),
            ("processor", "Snapdragon 8 Gen 2 for Galaxy (4nm)", None),
            ("battery_life", "16", "hours"),
            ("water_resistance", "IP68 (Tablet and S Pen)", None),
            ("weight", "732", "g")
        ],
        "pros": ["Colossal 14.6-inch AMOLED screen turns into full laptop with DeX", "IP68 water resistant can survive rain or spills", "S Pen included in box with zero extra cost", "Quad AKG speakers with Dolby Atmos"],
        "cons": ["Very large footprint requires a desk to use comfortably", "Heavy 732g weight for one-handed handheld reading"],
        "reviews": ("A portable cinema and multi-window laptop replacement", "Too massive to hold like a paperback book in bed", "The greatest Android tablet display ever built.")
    },
    {
        "id": "prd_tb_galaxytabs9",
        "name": "Samsung Galaxy Tab S9",
        "brand": "Samsung",
        "category": "tablets",
        "model_number": "SM-X710N",
        "description": "Samsung Galaxy Tab S9 with 11-inch Dynamic AMOLED 2X 120Hz display, Snapdragon 8 Gen 2 for Galaxy, IP68 water resistance, bundled low-latency S Pen, and 8400mAh battery.",
        "price": 64999.0,
        "original_price": 72999.0,
        "retailers": [
            {"name": "Amazon India", "price": 64999.0, "original": 72999.0, "url": "https://www.amazon.in/dp/B0CC9L33YY"},
            {"name": "Samsung Store", "price": 67999.0, "original": 72999.0, "url": "https://www.samsung.com/in/tablets/galaxy-tab-s/galaxy-tab-s9/"}
        ],
        "specs": [
            ("display", "11-inch Dynamic AMOLED 2X (2560x1600), 120Hz, 100% DCI-P3", None),
            ("processor", "Snapdragon 8 Gen 2 for Galaxy", None),
            ("battery_life", "15", "hours"),
            ("water_resistance", "IP68", None),
            ("weight", "498", "g")
        ],
        "pros": ["Compact 11-inch form factor with gorgeous AMOLED 120Hz screen", "IP68 rating covers tablet and stylus", "S Pen included free in the box"],
        "cons": ["Battery life under Samsung DeX mode drops faster", "45W charger not included in box"],
        "reviews": ("The best 11-inch Android tablet on the market", "Fast charger sold separately", "Vibrant OLED screen and smooth stylus note-taking.")
    },
    {
        "id": "prd_tb_xiaomipad6",
        "name": "Xiaomi Pad 6",
        "brand": "Xiaomi",
        "category": "tablets",
        "model_number": "23043RP34G",
        "description": "Xiaomi Pad 6 featuring Snapdragon 870 processor, 11-inch 2.8K 144Hz display with Dolby Vision, quad speakers with Dolby Atmos, 8840mAh battery, and all-metal unibody design.",
        "price": 24999.0,
        "original_price": 39999.0,
        "retailers": [
            {"name": "Amazon India", "price": 24999.0, "original": 39999.0, "url": "https://www.amazon.in/dp/B0C6QR22ZZ"},
            {"name": "Mi Store", "price": 24999.0, "original": 39999.0, "url": "https://store.mi.com/in/item/3232500010"}
        ],
        "specs": [
            ("display", "11-inch 2.8K (2880x1800) IPS LCD, 144Hz, 550 nits, Dolby Vision", None),
            ("processor", "Snapdragon 870 (7nm, up to 3.2GHz)", None),
            ("battery_life", "16", "hours"),
            ("storage", "128GB UFS 3.1", None),
            ("weight", "490", "g")
        ],
        "pros": ["144Hz 2.8K high-resolution display under ₹25,000", "Snapdragon 870 handles 3D gaming with ease", "Sleek all-metal unibody build"],
        "cons": ["No cellular LTE/5G variant available (Wi-Fi only)", "No fingerprint scanner (uses face unlock/PIN)"],
        "reviews": ("The undisputed value champ of the tablet category", "No GPS or SIM card slot", "Fantastic display and speakers for streaming movies and reading.")
    },
    {
        "id": "prd_tb_onepluspad2",
        "name": "OnePlus Pad 2",
        "brand": "OnePlus",
        "category": "tablets",
        "model_number": "OPD2404",
        "description": "OnePlus Pad 2 powered by flagship Snapdragon 8 Gen 3, 12.1-inch 3K 144Hz display with unique 7:5 ReadFit ratio, 6-speaker spatial audio system, 9510mAh battery, and 67W SUPERVOOC charging.",
        "price": 39999.0,
        "original_price": 44999.0,
        "retailers": [
            {"name": "Amazon India", "price": 39999.0, "original": 44999.0, "url": "https://www.amazon.in/dp/B0D982K1LM"},
            {"name": "OnePlus Store", "price": 39999.0, "original": 44999.0, "url": "https://www.oneplus.in/oneplus-pad-2"}
        ],
        "specs": [
            ("display", "12.1-inch 3K (3000x2120) 7:5 Display, 144Hz, 900 nits peak, Dolby Vision", None),
            ("processor", "Snapdragon 8 Gen 3 (4nm Silicon)", None),
            ("battery_life", "14", "hours"),
            ("storage", "128GB / 256GB UFS 3.1", None),
            ("weight", "584", "g")
        ],
        "pros": ["Flagship Snapdragon 8 Gen 3 speed under ₹40,000", "7:5 aspect ratio shows more vertical book and web content", "6-speaker spatial soundstage is exceptionally loud and deep"],
        "cons": ["LCD screen instead of OLED", "No MicroSD expandable storage slot"],
        "reviews": ("Powerhouse performance for an Android tablet", "LCD black levels aren't as deep as OLED", "The 7:5 aspect ratio is far better for reading documents than 16:10.")
    },
    {
        "id": "prd_tb_galaxytabs9fe",
        "name": "Samsung Galaxy Tab S9 FE",
        "brand": "Samsung",
        "category": "tablets",
        "model_number": "SM-X510N",
        "description": "Samsung Galaxy Tab S9 FE with 10.9-inch 90Hz display, IP68 water and dust resistance, bundled water-resistant S Pen, Exynos 1380 processor, and 8000mAh battery with 45W charging.",
        "price": 34999.0,
        "original_price": 44999.0,
        "retailers": [
            {"name": "Amazon India", "price": 34999.0, "original": 44999.0, "url": "https://www.amazon.in/dp/B0CHX5T99Z"},
            {"name": "Samsung Store", "price": 36999.0, "original": 44999.0, "url": "https://www.samsung.com/in/tablets/galaxy-tab-s/galaxy-tab-s9-fe/"}
        ],
        "specs": [
            ("display", "10.9-inch WQXGA (2304x1440) LCD, 90Hz, Vision Booster", None),
            ("processor", "Exynos 1380 (5nm)", None),
            ("battery_life", "18", "hours"),
            ("water_resistance", "IP68", None),
            ("weight", "523", "g")
        ],
        "pros": ["Full IP68 waterproof rating under ₹35k", "S Pen included in box for note-taking and sketches", "Up to 18 hours of video playback stamina"],
        "cons": ["Display is LCD rather than AMOLED", "Exynos 1380 is moderate for heavy gaming"],
        "reviews": ("Best tablet for digital students taking college notes", "Screen is LCD not OLED", "IP68 water resistance means peace of mind around water bottles.")
    },
    {
        "id": "prd_tb_ipadmini6",
        "name": "Apple iPad mini (6th Gen)",
        "brand": "Apple",
        "category": "tablets",
        "model_number": "MK7M3HN/A",
        "description": "Apple iPad mini with 8.3-inch Liquid Retina display, A15 Bionic chip with Neural Engine, 12MP Ultra Wide front camera with Center Stage, USB-C, and Apple Pencil (2nd Gen) magnetic charging.",
        "price": 46900.0,
        "original_price": 49900.0,
        "retailers": [
            {"name": "Apple Store India", "price": 49900.0, "original": 49900.0, "url": "https://www.apple.com/in/ipad-mini/"},
            {"name": "Amazon India", "price": 46900.0, "original": 49900.0, "url": "https://www.amazon.in/dp/B09G9FPHP4"}
        ],
        "specs": [
            ("display", "8.3-inch Liquid Retina Display (2266x1488), 500 nits, P3 Wide Color", None),
            ("processor", "Apple A15 Bionic (6-core CPU, 5-core GPU)", None),
            ("battery_life", "10", "hours"),
            ("storage", "64GB / 256GB", None),
            ("weight", "293", "g")
        ],
        "pros": ["Pocketable 293g weight is easy to hold with one hand", "A15 Bionic delivers flagship gaming speeds", "Apple Pencil 2 clips magnetically to side for charging"],
        "cons": ["Base 64GB storage is small", "Display refresh rate is 60Hz with subtle jelly scroll"],
        "reviews": ("The ultimate digital notebook and eBook reader", "64GB base storage is tight", "The perfect size for pilots, doctors, and handheld gamers.")
    },
    {
        "id": "prd_tb_surfacepro9",
        "name": "Microsoft Surface Pro 9",
        "brand": "Microsoft",
        "category": "tablets",
        "model_number": "QEZ-00001",
        "description": "Microsoft Surface Pro 9 2-in-1 tablet PC with 12th Gen Intel Core i5-1235U, 13-inch PixelSense Flow 120Hz touchscreen, built-in kickstand, dual Thunderbolt 4 ports, and full Windows 11 Home.",
        "price": 89990.0,
        "original_price": 105990.0,
        "retailers": [
            {"name": "Amazon India", "price": 89990.0, "original": 105990.0, "url": "https://www.amazon.in/dp/B0BHC16KMM"}
        ],
        "specs": [
            ("display", "13-inch PixelSense Flow (2880x1920), 3:2, 120Hz, Gorilla Glass 5", None),
            ("processor", "Intel Core i5-1235U (10 cores, up to 4.4GHz)", None),
            ("battery_life", "15", "hours"),
            ("storage", "8GB RAM, 256GB Removable SSD", None),
            ("weight", "879", "g")
        ],
        "pros": ["Runs full desktop Windows applications (Visual Studio, Excel macros, CAD)", "Iconic built-in friction hinge kickstand", "User-removable SSD door allows easy storage upgrades"],
        "cons": ["Surface Type Cover keyboard sold separately", "Battery life under heavy Windows workflows is ~7 hours"],
        "reviews": ("The premier Windows 2-in-1 tablet experience", "Keyboard cover should come bundled in the box", "Invaluable for engineers needing full desktop Windows on the go.")
    },
    {
        "id": "prd_tb_onepluspadgo",
        "name": "OnePlus Pad Go",
        "brand": "OnePlus",
        "category": "tablets",
        "model_number": "OPD2304",
        "description": "OnePlus Pad Go entertainment tablet featuring 11.35-inch 2.4K 90Hz display with TÜV Rheinland eye care certification, Omnibearing quad speakers with Dolby Atmos, 4G LTE calling, and 8000mAh battery.",
        "price": 19999.0,
        "original_price": 23999.0,
        "retailers": [
            {"name": "Amazon India", "price": 19999.0, "original": 23999.0, "url": "https://www.amazon.in/dp/B0CJX91KLM"}
        ],
        "specs": [
            ("display", "11.35-inch 2.4K (2408x1720) 7:5 Display, 90Hz, 400 nits", None),
            ("processor", "MediaTek Helio G99 (6nm)", None),
            ("battery_life", "14", "hours"),
            ("storage", "8GB RAM, 128GB Storage (MicroSD up to 1TB)", None),
            ("weight", "532", "g")
        ],
        "pros": ["Includes 4G LTE cellular SIM connectivity under ₹20,000", "2.4K resolution display with 7:5 book ratio", "Quad speakers produce punchy movie sound"],
        "cons": ["Helio G99 is built for media and casual games, not 3D rendering", "No official keyboard accessory connector pins"],
        "reviews": ("Best budget LTE entertainment tablet for travelers", "Gaming performance is average", "Superb screen clarity and 4G calling at 20k.")
    },
    {
        "id": "prd_tb_lenovotabp12",
        "name": "Lenovo Tab P12",
        "brand": "Lenovo",
        "category": "tablets",
        "model_number": "ZACH0134IN",
        "description": "Lenovo Tab P12 with massive 12.7-inch 3K LTPS display, JBL quad speakers with Dolby Atmos, MediaTek Dimensity 7050 octa-core, bundled Lenovo Tab Pen Plus stylus, and 10200mAh battery.",
        "price": 26999.0,
        "original_price": 34999.0,
        "retailers": [
            {"name": "Flipkart", "price": 26999.0, "original": 34999.0, "url": "https://www.flipkart.com/lenovo-tab-p12"}
        ],
        "specs": [
            ("display", "12.7-inch 3K (2944x1840) LTPS LCD, 60Hz, 400 nits", None),
            ("processor", "MediaTek Dimensity 7050 (6nm)", None),
            ("battery_life", "10", "hours"),
            ("storage", "8GB RAM, 128GB Storage, MicroSD up to 1TB", None),
            ("weight", "615", "g")
        ],
        "pros": ["Huge 12.7-inch 3K canvas at an accessible price", "Bundled Lenovo Tab Pen Plus in the box", "Quad JBL acoustic speakers"],
        "cons": ["60Hz display refresh rate (no 90Hz or 120Hz)", "Not ideal for fast-paced 120fps gaming"],
        "reviews": ("Superb big screen for PDFs and streaming", "60Hz refresh rate is noticeable when scrolling quickly", "Unbeatable screen real estate for college notes.")
    },
    {
        "id": "prd_tb_realmepad2",
        "name": "Realme Pad 2 4G LTE",
        "brand": "Realme",
        "category": "tablets",
        "model_number": "RMP2204",
        "description": "Realme Pad 2 with 11.5-inch 2K 120Hz display, 4G LTE SIM calling, MediaTek Helio G99 processor, 8360mAh battery with 33W SUPERVOOC charging, and quad stereo speakers with Dolby Atmos.",
        "price": 17999.0,
        "original_price": 24999.0,
        "retailers": [
            {"name": "Flipkart", "price": 17999.0, "original": 24999.0, "url": "https://www.flipkart.com/realme-pad-2"}
        ],
        "specs": [
            ("display", "11.5-inch 2K (2000x1200) LCD, 120Hz, 450 nits", None),
            ("processor", "MediaTek Helio G99 (6nm)", None),
            ("battery_life", "17", "hours"),
            ("storage", "6GB RAM, 128GB Storage, LTE SIM Slot", None),
            ("weight", "518", "g")
        ],
        "pros": ["Fluid 120Hz refresh rate with 4G LTE connectivity under ₹18,000", "Fast 33W wired charging adapter included in box", "Quad speakers with O-Reality audio"],
        "cons": ["No official stylus magnetic charging zone", "Plastic frame accents"],
        "reviews": ("Smooth 120Hz display with full 4G calling", "No precision pressure stylus available", "Delivers great gaming and video streaming for budget buyers.")
    },
    {
        "id": "prd_tb_honorpad9",
        "name": "Honor Pad 9",
        "brand": "Honor",
        "category": "tablets",
        "model_number": "HEY2-W09",
        "description": "Honor Pad 9 with immersive 12.1-inch 2.5K 120Hz eye protection display, industry-leading 8-speaker surround sound acoustic chamber, Snapdragon 6 Gen 1, and 8300mAh battery with 35W charging.",
        "price": 22999.0,
        "original_price": 34999.0,
        "retailers": [
            {"name": "Amazon India", "price": 22999.0, "original": 34999.0, "url": "https://www.amazon.in/dp/B0CW1C5X9A"}
        ],
        "specs": [
            ("display", "12.1-inch 2.5K (2560x1600) IPS LCD, 120Hz, TÜV Rheinland Eye Comfort", None),
            ("processor", "Snapdragon 6 Gen 1 (4nm)", None),
            ("battery_life", "11", "hours"),
            ("storage", "8GB RAM, 256GB Storage", None),
            ("weight", "555", "g")
        ],
        "pros": ["Class-leading 8-speaker audio setup with bidirectional voice enhancement", "Generous 256GB base storage under ₹23k", "TUV Rheinland flicker-free eye comfort certification"],
        "cons": ["Wi-Fi only (no LTE option)", "No 3.5mm headphone jack"],
        "reviews": ("The best sounding tablet speakers under 30k", "No cellular connectivity", "Room-filling audio and crystal clear large screen.")
    },
    {
        "id": "prd_tb_nokia_t21",
        "name": "Nokia T21 4G LTE",
        "brand": "Nokia",
        "category": "tablets",
        "model_number": "TA-1495",
        "description": "Nokia T21 rugged family tablet featuring durable aluminum body with 60% recycled plastic cover, 10.36-inch 2K display with Wacom active pen support, 4G voice calling, and 3 days battery life.",
        "price": 13999.0,
        "original_price": 19999.0,
        "retailers": [
            {"name": "Amazon India", "price": 13999.0, "original": 19999.0, "url": "https://www.amazon.in/dp/B0BGP69KMM"}
        ],
        "specs": [
            ("display", "10.36-inch 2K (1200x2000) IPS LCD, 360 nits, SGS Low Blue Light", None),
            ("processor", "Unisoc T612 (12nm)", None),
            ("battery_life", "15", "hours"),
            ("storage", "4GB RAM, 64GB Storage (MicroSD up to 512GB)", None),
            ("weight", "466", "g")
        ],
        "pros": ["Rugged aluminum casing built to withstand drops", "4G LTE voice calling capability", "Clean bloatware-free stock Android experience"],
        "cons": ["Unisoc processor is strictly for reading and light video", "Screen brightness is 360 nits (dim outdoors)"],
        "reviews": ("Durable and straightforward tablet for kids and parents", "Processor is slow for modern 3D games", "Built like a tank with dependable cellular connectivity.")
    },
    {
        "id": "prd_tb_lenovolegiontab",
        "name": "Lenovo Legion Tab (8.8-inch)",
        "brand": "Lenovo",
        "category": "tablets",
        "model_number": "TB320FC",
        "description": "Lenovo Legion Tab dedicated 8.8-inch Android gaming tablet with Snapdragon 8+ Gen 1, 144Hz 2.5K PureSight gaming display, Legion ColdFront Vapor thermal system, dual USB-C ports with bypass charging, and 6550mAh battery.",
        "price": 39999.0,
        "original_price": 49999.0,
        "retailers": [
            {"name": "Lenovo India", "price": 39999.0, "original": 49999.0, "url": "https://www.lenovo.com/in/en/p/tablets/android-tablets/lenovo-tab-series/legion-tab"}
        ],
        "specs": [
            ("display", "8.8-inch 2.5K (2560x1600) PureSight Gaming Display, 144Hz, 500 nits, Dolby Vision", None),
            ("processor", "Snapdragon 8+ Gen 1 (4nm)", None),
            ("battery_life", "9", "hours"),
            ("storage", "12GB LPDDR5X, 256GB UFS 3.1", None),
            ("weight", "350", "g")
        ],
        "pros": ["Dual USB-C ports allow charging while using game controllers", "Bypass charging powers CPU without heating the battery", "144Hz 2.5K high refresh gaming screen"],
        "cons": ["No headphone jack (requires USB-C audio or Bluetooth)", "Compact 8.8-inch size is smaller for document work"],
        "reviews": ("The ultimate iPad mini gaming competitor on Android", "No 3.5mm jack on a gaming tablet", "Runs Genshin Impact and BGMI at locked 60/90fps with zero thermal throttling.")
    }
]

# ==================== SMART LIVING (17) ====================
SMART_HOME = [
    {
        "id": "prd_sh_homepod2",
        "name": "Apple HomePod (2nd Gen)",
        "brand": "Apple",
        "category": "smart-home",
        "model_number": "MQJ73HN/A",
        "description": "Apple HomePod (2nd Generation) smart speaker featuring high-excursion 4-inch woofer, beamforming array of five horn-loaded tweeters, room sensing audio calibration, Matter hub, and built-in temperature and humidity sensor.",
        "price": 32900.0,
        "original_price": 32900.0,
        "retailers": [
            {"name": "Apple Store India", "price": 32900.0, "original": 32900.0, "url": "https://www.apple.com/in/homepod-2nd-generation/"},
            {"name": "Amazon India", "price": 31900.0, "original": 32900.0, "url": "https://www.amazon.in/dp/B0BSJ17KLL"}
        ],
        "specs": [
            ("sound_dispersion", "High-excursion 4-inch woofer + 5 beamforming tweeters", None),
            ("battery_life", "AC Wall Powered (Always On)", None),
            ("filtration", "Matter & Thread Border Router, AirPlay 2", None),
            ("sensors", "Room Sensing, Temperature & Humidity Sensor, Sound Recognition", None)
        ],
        "pros": ["Audiophile soundstage automatically adapts to room walls", "Matter and Thread border router connects smart home devices", "Built-in indoor temperature and humidity sensors trigger automations"],
        "cons": ["Requires iOS device to configure and manage", "No auxiliary 3.5mm audio input or standard Bluetooth audio"],
        "reviews": ("The best sounding smart speaker under 35k", "Completely locked to Apple Home ecosystem", "Sub-bass response is astonishing for its compact cylindrical footprint.")
    },
    {
        "id": "prd_sh_echodot5",
        "name": "Amazon Echo Dot (5th Gen)",
        "brand": "Amazon",
        "category": "smart-home",
        "model_number": "B09B8V1LZ3",
        "description": "Amazon Echo Dot (5th Gen) smart speaker with Alexa, deeper bass and clearer vocals, built-in indoor temperature sensor, tap gesture controls on top, and privacy mic-off button.",
        "price": 4499.0,
        "original_price": 5499.0,
        "retailers": [
            {"name": "Amazon India", "price": 4499.0, "original": 5499.0, "url": "https://www.amazon.in/dp/B09B8V1LZ3"}
        ],
        "specs": [
            ("sound_dispersion", "1.73-inch front-firing speaker with High-Def Lossless audio", None),
            ("battery_life", "AC Wall Powered", None),
            ("filtration", "Matter Certified Hub, Wi-Fi, Bluetooth Low Energy", None),
            ("sensors", "Indoor Temperature Sensor, Motion Detection", None)
        ],
        "pros": ["Alexa supports English and Hindi bilingual conversations seamlessly", "Double the bass response of the 4th generation Dot", "Tap-to-snooze alarm gesture on top surface"],
        "cons": ["No 3.5mm aux audio output jack (removed on 5th gen)", "Lacks visual display (Clock edition costs more)"],
        "reviews": ("The quintessential smart speaker for Indian homes", "Miss the 3.5mm aux out from older models", "Controls ACs, fans, lights, and plays morning devotional or Bollywood music reliably.")
    },
    {
        "id": "prd_sh_echoshow10",
        "name": "Amazon Echo Show 10 (3rd Gen)",
        "brand": "Amazon",
        "category": "smart-home",
        "model_number": "B07VHZ41L8",
        "description": "Amazon Echo Show 10 with motorized 10.1-inch HD smart display that automatically pans to face you during video calls or recipe prep, 13MP camera with auto-framing, dual tweeters and woofer, and built-in Zigbee smart home hub.",
        "price": 24999.0,
        "original_price": 24999.0,
        "retailers": [
            {"name": "Amazon India", "price": 24999.0, "original": 24999.0, "url": "https://www.amazon.in/dp/B07VHZ41L8"}
        ],
        "specs": [
            ("sound_dispersion", "2.1 system (2x 1.0-inch tweeters + 3.0-inch woofer)", None),
            ("battery_life", "AC Wall Powered", None),
            ("filtration", "Built-in Zigbee Hub, Matter Certified", None),
            ("sensor", "13MP Camera with Auto-framing + Brushless Motor Motion", None)
        ],
        "pros": ["Screen silently rotates to follow your movement in the kitchen", "Built-in Zigbee and Matter hub connects sensors without extra bridges", "Rich 2.1 stereo sound with punchy bass"],
        "cons": ["Requires clearance around table for rotating mechanism", "Heavy footprint on countertops"],
        "reviews": ("Feels like living in the future when the screen turns with you", "Needs a dedicated clear circle on your kitchen island", "Fantastic camera tracking during Skype/Alexa calls.")
    },
    {
        "id": "prd_sh_googlenestaudio",
        "name": "Google Nest Audio",
        "brand": "Google",
        "category": "smart-home",
        "model_number": "GA01420-US",
        "description": "Google Nest Audio smart speaker with 75mm woofer and 19mm tweeter, 75% louder sound with 50% stronger bass than original Google Home, Media EQ tuning, and Google Assistant voice intelligence.",
        "price": 7999.0,
        "original_price": 9999.0,
        "retailers": [
            {"name": "Flipkart", "price": 7999.0, "original": 9999.0, "url": "https://www.flipkart.com/google-nest-audio"}
        ],
        "specs": [
            ("sound_dispersion", "75mm woofer + 19mm tweeter, 3 far-field microphones", None),
            ("battery_life", "AC Powered", None),
            ("filtration", "Google Cast, Matter, Wi-Fi 802.11ac (2.4GHz/5GHz)", None),
            ("sensor", "Capacitive touch controls, Ambient IQ sound tuning", None)
        ],
        "pros": ["Google Assistant answers knowledge queries better than rivals", "Sustainable fabric enclosure made from 70% recycled plastic bottles", "Stereo pairing creates a surprisingly wide soundstage"],
        "cons": ["No auxiliary 3.5mm line-in", "Microphone mute switch is on the rear"],
        "reviews": ("Natural sound and the smartest voice assistant", "No aux port to connect old turntables", "Understands diverse Indian accents with high accuracy.")
    },
    {
        "id": "prd_sh_dysonv12detect",
        "name": "Dyson V12 Detect Slim Total Clean",
        "brand": "Dyson",
        "category": "smart-home",
        "model_number": "368340-01",
        "description": "Dyson V12 Detect Slim lightweight cordless vacuum cleaner with Fluffy Optic cleaner head that illuminates invisible dust on hard floors, piezo sensor measuring dust particle size, 150AW suction, and push-button operation.",
        "price": 51900.0,
        "original_price": 65900.0,
        "retailers": [
            {"name": "Dyson India", "price": 51900.0, "original": 65900.0, "url": "https://www.dyson.in/dyson-v12-detect-slim-total-clean"},
            {"name": "Amazon India", "price": 51900.0, "original": 65900.0, "url": "https://www.amazon.in/dp/B0B6GHW1ZZ"}
        ],
        "specs": [
            ("suction_power", "150 AW Powerful Cyclone Suction", None),
            ("runtime", "60", "mins"),
            ("filtration", "Whole-machine HEPA filtration traps 99.99% of particles to 0.1 microns", None),
            ("weight", "2.2", "kg")
        ],
        "pros": ["Illuminating green laser reveals microscopic dust on tiles and marble", "Single push-button power switch (no trigger holding fatigue)", "Piezo sensor automatically boosts suction on dirty rug zones"],
        "cons": ["Smaller 0.35L dustbin requires frequent emptying", "Premium household cleaning investment"],
        "reviews": ("Shows dust you never knew existed on clean-looking floors", "Dustbin fills fast in large 3BHK homes", "Revolutionizes home cleaning ergonomics with the light 2.2kg weight.")
    },
    {
        "id": "prd_sh_dysonv15detect",
        "name": "Dyson V15 Detect Absolute",
        "brand": "Dyson",
        "category": "smart-home",
        "model_number": "368341-01",
        "description": "Dyson V15 Detect Absolute most powerful cordless vacuum with 240AW suction power, Digital Motorbar with anti-tangle de-tangling vanes, laser dust illumination, larger 0.77L bin, and 60 minutes runtime.",
        "price": 64900.0,
        "original_price": 74900.0,
        "retailers": [
            {"name": "Dyson India", "price": 64900.0, "original": 74900.0, "url": "https://www.dyson.in/dyson-v15-detect-absolute"}
        ],
        "specs": [
            ("suction_power", "240 AW Beast Suction", None),
            ("runtime", "60", "mins"),
            ("filtration", "Whole-machine HEPA filtration, 14 root cyclones", None),
            ("weight", "3.0", "kg")
        ],
        "pros": ["Massive 240AW suction extracts deep carpet allergens", "De-tangling Motorbar clears pet and human hair without wrapping", "Big 0.77L dustbin handles sprawling apartments"],
        "cons": ["Heavier 3.0kg body with trigger switch", "Significant financial investment"],
        "reviews": ("Insane suction power that pulls dust through mattresses", "Heavier in the hand than the V12", "The gold standard of cordless vacuum cleaners.")
    },
    {
        "id": "prd_sh_xiaomirobotvacuum2pro",
        "name": "Xiaomi Robot Vacuum-Mop 2 Pro",
        "brand": "Xiaomi",
        "category": "smart-home",
        "model_number": "BHR5044EU",
        "description": "Xiaomi Robot Vacuum-Mop 2 Pro with high-frequency sonic vibration mopping (10,000 vibrations/min), LDS next-gen laser navigation, 3000Pa suction power, multi-floor mapping, and 5200mAh battery.",
        "price": 27999.0,
        "original_price": 39999.0,
        "retailers": [
            {"name": "Amazon India", "price": 27999.0, "original": 39999.0, "url": "https://www.amazon.in/dp/B0B4N7M1KL"},
            {"name": "Mi Store", "price": 27999.0, "original": 39999.0, "url": "https://store.mi.com/in/item/3222500005"}
        ],
        "specs": [
            ("suction_power", "3000 Pa Cyclone Suction", None),
            ("runtime", "180", "mins"),
            ("filtration", "HEPA High Efficiency Washable Filter + Microfiber Mop", None),
            ("sensor", "LDS Laser LDS LiDAR 360-degree mapping", None)
        ],
        "pros": ["High frequency sonic vibration scrubs away dried stains on tiles", "Smart multi-floor mapping saves maps for duplex homes", "Runs up to 180 minutes on a single charge"],
        "cons": ["Mop pad must be washed manually after runs (no self-cleaning dock)", "Can get caught on loose charging cables"],
        "reviews": ("Saves an hour of manual sweeping and mopping every day", "You need to clear cables off the floor before starting", "Reliable mapping and excellent mopping vibration.")
    },
    {
        "id": "prd_sh_philipshuestarterkit",
        "name": "Philips Hue White and Color Starter Kit",
        "brand": "Philips",
        "category": "smart-home",
        "model_number": "929002216601",
        "description": "Philips Hue Starter Kit including 3x E27 9W Smart Color Bulbs (16 million colors), Hue Smart Bridge hub, and Smart Dimmer Switch. Compatible with Apple Home, Alexa, Google Assistant, and Spotify music sync.",
        "price": 11999.0,
        "original_price": 14999.0,
        "retailers": [
            {"name": "Amazon India", "price": 11999.0, "original": 14999.0, "url": "https://www.amazon.in/dp/B07G47H7NZ"}
        ],
        "specs": [
            ("sound_dispersion", "16 Million Colors + Tunable Warm to Cool White (806 lumens)", None),
            ("battery_life", "25,000 Hours Lifetime", None),
            ("filtration", "Zigbee 3.0 Mesh Protocol + Matter Bridge", None),
            ("sensor", "Instant response with zero Wi-Fi network congestion", None)
        ],
        "pros": ["Zigbee mesh keeps home Wi-Fi fast even with 50+ bulbs connected", "Flawless Apple HomeKit, Alexa, and Google Home synchronization", "Syncs lighting dynamically with Spotify music and PC gaming"],
        "cons": ["Requires the Hue Bridge hub plugged into your router", "Premium pricing compared to budget Wi-Fi bulbs"],
        "reviews": ("The unmatched king of smart architectural lighting", "Needs Ethernet bridge connected to router", "Colors are deep, saturated, and respond instantly with zero lag.")
    },
    {
        "id": "prd_sh_tapotapoc200",
        "name": "TP-Link Tapo C200 Smart Wi-Fi Camera",
        "brand": "TP-Link",
        "category": "smart-home",
        "model_number": "Tapo C200",
        "description": "TP-Link Tapo C200 Pan/Tilt home security Wi-Fi camera with 1080p Full HD video, 360-degree horizontal rotation, advanced infrared night vision up to 30ft, motion detection with instant alerts, two-way audio, and local MicroSD card storage up to 512GB.",
        "price": 1999.0,
        "original_price": 3299.0,
        "retailers": [
            {"name": "Amazon India", "price": 1999.0, "original": 3299.0, "url": "https://www.amazon.in/dp/B07XLML2YS"},
            {"name": "Flipkart", "price": 2099.0, "original": 3299.0, "url": "https://www.flipkart.com/tp-link-tapo-c200"}
        ],
        "specs": [
            ("sound_dispersion", "Two-way talk with built-in microphone and siren speaker", None),
            ("battery_life", "Continuous 9V DC Adapter Powered", None),
            ("filtration", "MicroSD card slot up to 512GB (no cloud subscription required)", None),
            ("sensor", "1080p Sensor, 360-degree Pan / 114-degree Tilt, Night Vision 850nm IR", None)
        ],
        "pros": ["Super accessible sub-2000 price point for reliable security", "Full 360-degree motorized pan & tilt controls from phone", "Local recording on MicroSD card avoids monthly cloud subscription fees"],
        "cons": ["1080p resolution is good, not 2K or 4K", "Indoor use only (not weatherproof for rain)"],
        "reviews": ("The most popular home pet and baby monitor in India", "Needs power outlet nearby as it has no battery", "Dead simple setup and clear night vision.")
    },
    {
        "id": "prd_sh_wipro16aplug",
        "name": "Wipro 16A Smart Wi-Fi Plug with Energy Monitoring",
        "brand": "Wipro",
        "category": "smart-home",
        "model_number": "DS11600",
        "description": "Wipro 16A Smart Plug with real-time Energy Monitoring, voice control with Alexa & Google Assistant, scheduling timer for heavy appliances (Geysers, ACs, Washing Machines), and no separate hub required.",
        "price": 999.0,
        "original_price": 2290.0,
        "retailers": [
            {"name": "Amazon India", "price": 999.0, "original": 2290.0, "url": "https://www.amazon.in/dp/B0868J81NL"}
        ],
        "specs": [
            ("sound_dispersion", "16A Heavy Duty Socket for AC and Geyser loads", None),
            ("battery_life", "AC 220V Direct Wall Socket", None),
            ("filtration", "Energy Metering chips track kWh electricity consumption", None),
            ("sensor", "Direct 2.4GHz Wi-Fi (No Hub Needed)", None)
        ],
        "pros": ["Tracks real-time kilowatt-hour electricity consumption to save bills", "Handles heavy 16 Amp appliances like water heaters and 1.5 ton ACs", "Schedule water heater to turn on 15 minutes before waking up"],
        "cons": ["Requires 2.4GHz Wi-Fi band during initial pairing", "Chunky body can block adjacent 3-pin wall sockets"],
        "reviews": ("Saves hundreds on monthly geyser and AC power bills", "Plug is bulky and can block the neighbouring switch", "Automates winter morning geysers flawlessly.")
    },
    {
        "id": "prd_sh_atombergrenesa",
        "name": "Atomberg Renesa Smart BLDC Ceiling Fan",
        "brand": "Atomberg",
        "category": "smart-home",
        "model_number": "RENESA-1200-IOT",
        "description": "Atomberg Renesa 1200mm Smart BLDC Ceiling Fan with energy-saving BLDC motor (saves up to 65% electricity, 28W only), IoT enabled app control, voice control with Alexa & Google Assistant, and smart remote with timer mode.",
        "price": 4999.0,
        "original_price": 7490.0,
        "retailers": [
            {"name": "Amazon India", "price": 4999.0, "original": 7490.0, "url": "https://www.amazon.in/dp/B08HRZ11ZZ"},
            {"name": "Flipkart", "price": 5099.0, "original": 7490.0, "url": "https://www.flipkart.com/atomberg-renesa-smart"}
        ],
        "specs": [
            ("sound_dispersion", "High air delivery 235 CMM, 360 RPM, 1200mm sweep", None),
            ("battery_life", "28W Low Power (Runs 3x longer on home inverter)", None),
            ("filtration", "IoT Wi-Fi Enabled, Atomberg Home App, Voice Assistants", None),
            ("sensor", "Smart BLDC Motor with LED speed indicator", None)
        ],
        "pros": ["Slashes ceiling fan power consumption from 75W down to 28W", "Runs 3x longer during power cuts on residential inverters", "Control fan speed from bed using Alexa or phone app"],
        "cons": ["Cannot be used with traditional wall rotary regulator (must be bypassed)", "Installation requires basic electrical wiring"],
        "reviews": ("Game changer for electricity bills in hot Indian summers", "Bypass your old wall regulator with direct switch", "Whisper quiet operation and seamless voice control.")
    },
    {
        "id": "prd_sh_qubosmartlock",
        "name": "Qubo Smart Door Lock Essential",
        "brand": "Qubo",
        "category": "smart-home",
        "model_number": "QBL001",
        "description": "Qubo Smart Door Lock from Hero Group featuring 5-way unlocking (Fingerprint, Passcode, RFID Keycard, Emergency Mechanical Key, Mobile App OTP), stainless steel 5-bolt mortise, anti-theft tamper alarm, and up to 1-year battery life.",
        "price": 9990.0,
        "original_price": 19990.0,
        "retailers": [
            {"name": "Amazon India", "price": 9990.0, "original": 19990.0, "url": "https://www.amazon.in/dp/B0B7N88MKL"}
        ],
        "specs": [
            ("sound_dispersion", "Tamper siren alarm + Voice prompts in English and Hindi", None),
            ("battery_life", "12 months on 4x AA batteries (emergency micro-USB jumpstart)", None),
            ("filtration", "AES 128-bit encrypted Bluetooth & Wi-Fi Gateway", None),
            ("sensor", "Semiconductor capacitive fingerprint sensor (0.3s recognition)", None)
        ],
        "pros": ["Never carry house keys again with fast 0.3-second fingerprint access", "Generate one-time time-limited OTP passcodes for domestic help or guests", "Tamper alarm alerts phone if someone tries to force the handle"],
        "cons": ["Requires wooden main door thickness of 32mm to 70mm", "Needs carpenter installation (Qubo offers free installation in major cities)"],
        "reviews": ("No more fear of getting locked out of the flat", "Professional carpenter needed for precise mortise cut", "The biometric fingerprint works 100% reliably.")
    },
    {
        "id": "prd_sh_ecovacst20omni",
        "name": "Ecovacs Deebot T20 Omni",
        "brand": "Ecovacs",
        "category": "smart-home",
        "model_number": "DLX55",
        "description": "Ecovacs Deebot T20 Omni flagship all-in-one robot vacuum with hot water mop washing (55°C), 6000Pa suction power, auto-lift mop over carpets (9mm), TrueDetect 3D 3.0 obstacle avoidance, and auto-dust emptying station.",
        "price": 69900.0,
        "original_price": 99900.0,
        "retailers": [
            {"name": "Amazon India", "price": 69900.0, "original": 99900.0, "url": "https://www.amazon.in/dp/B0C3991KLM"}
        ],
        "specs": [
            ("suction_power", "6000 Pa Extreme Suction Power", None),
            ("runtime", "170", "mins"),
            ("filtration", "All-in-one Omni Station with 55°C Hot Water Mop Washing & Auto Empty", None),
            ("sensor", "TrueMapping 2.0 LiDAR + TrueDetect 3D Structured Light", None)
        ],
        "pros": ["Hot water at 55°C dissolves sticky kitchen oil and food stains on mop pads", "Auto-lifts mop pads 9mm when rolling over carpets so rugs stay dry", "Holds up to 75 days of dust before the station bag needs replacement"],
        "cons": ["Omni dock station is large and requires dedicated floor space", "Substantial investment"],
        "reviews": ("Hands-free automated mopping and vacuuming perfection", "The dock station is the size of a bedside table", "Actually dissolves oil stains in Indian kitchens with the hot water mop.")
    },
    {
        "id": "prd_sh_nanoleafshapes",
        "name": "Nanoleaf Shapes Hexagons Starter Kit",
        "brand": "Nanoleaf",
        "category": "smart-home",
        "model_number": "NL42-0002HX-9PK",
        "description": "Nanoleaf Shapes Hexagon modular smart light panels (9 panels), Connect+ technology, Rhythm music visualizer, Screen Mirror sync with PC monitors, touch reactive interactive games, and Apple Home/Matter support.",
        "price": 18499.0,
        "original_price": 24999.0,
        "retailers": [
            {"name": "Amazon India", "price": 18499.0, "original": 24999.0, "url": "https://www.amazon.in/dp/B08K3S99NN"}
        ],
        "specs": [
            ("sound_dispersion", "100 lumens per panel, 16M+ colors, 1200K-6500K tunable white", None),
            ("battery_life", "AC Wall Power 42W PSU (25,000h lifespan)", None),
            ("filtration", "Matter, Thread Border Router, Wi-Fi 2.4GHz", None),
            ("sensor", "Capacitive touch surface + Built-in acoustic Rhythm music sensor", None)
        ],
        "pros": ["Modular design lets you construct your own geometric wall art", "Rhythm visualizer transforms your room into a dynamic audio lightshow", "Touch-sensitive panels react when tapped or swiped"],
        "cons": ["Adhesive tape can damage drywall paint if removed improperly", "Expensive per-panel expansion cost"],
        "reviews": ("Transforms gaming and workstation walls into living art", "Be careful when taking panels down to protect paint", "The music rhythm mode during parties is astonishing.")
    },
    {
        "id": "prd_sh_googlenesthub2",
        "name": "Google Nest Hub (2nd Gen)",
        "brand": "Google",
        "category": "smart-home",
        "model_number": "GA01892-US",
        "description": "Google Nest Hub (2nd Gen) 7-inch smart display with Soli radar Sleep Sensing, 50% more bass speaker, Quick Gestures, digital photo frame connected to Google Photos, and unified smart home dashboard.",
        "price": 7999.0,
        "original_price": 9999.0,
        "retailers": [
            {"name": "Flipkart", "price": 7999.0, "original": 9999.0, "url": "https://www.flipkart.com/google-nest-hub-2nd-gen"}
        ],
        "specs": [
            ("sound_dispersion", "Full-range 43.5mm transducer with 50% stronger bass", None),
            ("battery_life", "AC Wall Adapter 15W", None),
            ("filtration", "Matter, Thread Border Router, Google Cast", None),
            ("sensor", "Soli Radar Motion Sensor (no camera for total bedroom privacy)", None)
        ],
        "pros": ["No camera lens ensures 100% visual privacy on bedroom nightstands", "Soli radar tracks your sleep stages and snoring without wearing a watch", "World's best digital photo frame connected to Google Photos albums"],
        "cons": ["Display is 7-inch, smaller than 10-inch Echo Show", "Cannot make standard two-way video calls (audio calls only due to no camera)"],
        "reviews": ("Perfect bedside companion and sleep monitor", "No camera means no video calls, but total privacy", "Waking up to family photos on the display is heartwarming.")
    },
    {
        "id": "prd_sh_homepodmini",
        "name": "Apple HomePod mini",
        "brand": "Apple",
        "category": "smart-home",
        "model_number": "MY5G2HN/A",
        "description": "Apple HomePod mini compact sphere smart speaker with 360-degree acoustic waveguide, Apple S5 chip with computational audio, Intercom throughout the house, Thread border router, and temperature/humidity sensor.",
        "price": 10900.0,
        "original_price": 10900.0,
        "retailers": [
            {"name": "Apple Store India", "price": 10900.0, "original": 10900.0, "url": "https://www.apple.com/in/homepod-mini/"},
            {"name": "Amazon India", "price": 9990.0, "original": 10900.0, "url": "https://www.amazon.in/dp/B09B8V1ZZZ"}
        ],
        "specs": [
            ("sound_dispersion", "Full-range driver and dual passive radiators for 360-degree sound", None),
            ("battery_life", "USB-C 20W Power Adapter", None),
            ("filtration", "Thread Border Router, Matter, AirPlay 2", None),
            ("sensor", "Temperature & Humidity sensor, Touch surface, Intercom", None)
        ],
        "pros": ["Tiny 3.3-inch sphere produces room-filling rich acoustic sound", "Hand off music seamlessly just by holding your iPhone near the top", "Acts as Matter & Thread smart home controller"],
        "cons": ["Cannot be used as standard Bluetooth speaker for non-Apple devices", "Volume is optimized for bedrooms/studies rather than large halls"],
        "reviews": ("Magical music handoff from iPhone", "Siri is best with Apple Music playlists", "Great for bedrooms and desks with surprisingly rich bass.")
    },
    {
        "id": "prd_sh_yalesmartlock",
        "name": "Yale YDM 7220 Smart Door Lock",
        "brand": "Yale",
        "category": "smart-home",
        "model_number": "YDM7220",
        "description": "Yale YDM 7220 biometric smart mortise door lock with 360-degree semiconductor fingerprint scanner, PIN code with fake dummy numbers, RFID card, mechanical override key, and Yale Home app connectivity.",
        "price": 28990.0,
        "original_price": 38990.0,
        "retailers": [
            {"name": "Amazon India", "price": 28990.0, "original": 38990.0, "url": "https://www.amazon.in/dp/B08V1S99KL"}
        ],
        "specs": [
            ("sound_dispersion", "80dB break-in and heat alarm", None),
            ("battery_life", "12 months on 4x AA alkaline batteries", None),
            ("filtration", "BLE and Wi-Fi Yale Access bridge integration", None),
            ("sensor", "Biometric 360-degree Fingerprint, Smart Touch Keypad", None)
        ],
        "pros": ["Heritage security brand trusted for over 180 years", "Fake PIN code security feature prevents onlookers from peeking passcodes", "Automatic auto-lock engages immediately when door closes"],
        "cons": ["Professional carpenter installation required", "Heavy duty enterprise price tag"],
        "reviews": ("High-grade bank vault feeling security on your main door", "Costly compared to budget smart locks", "The mechanical build quality and mortise feel completely indestructible.")
    }
]

print(f"Loaded {len(TABLETS)} tablets and {len(SMART_HOME)} smart living products.")

