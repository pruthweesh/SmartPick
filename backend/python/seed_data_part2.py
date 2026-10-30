"""
Seed Data Part 2: Audio & ANC (18) and Smartwatches (18)
"""

AUDIO = [
    {
        "id": "prd_au_sonywh1000xm5",
        "name": "Sony WH-1000XM5",
        "brand": "Sony",
        "category": "audio",
        "model_number": "WH1000XM5/B",
        "description": "Sony WH-1000XM5 wireless noise cancelling headphones with 8 microphones, Auto NC Optimizer, 30mm precision carbon fiber composite driver, 30-hour battery life with quick charge, and multipoint Bluetooth.",
        "price": 26990.0,
        "original_price": 34990.0,
        "retailers": [
            {"name": "Amazon India", "price": 26990.0, "original": 34990.0, "url": "https://www.amazon.in/dp/B09XS7JWHH"},
            {"name": "Sony Center", "price": 29990.0, "original": 34990.0, "url": "https://shopatsc.com/products/wh-1000xm5"}
        ],
        "specs": [
            ("anc_rating", "Auto NC Optimizer (Industry Leading)", "dB"),
            ("total_battery_life", "30", "hours"),
            ("driver_size", "30", "mm"),
            ("water_resistance", "Passive Resistance", None),
            ("bluetooth_version", "5.2", None),
            ("codec_support", "LDAC, AAC, SBC", None)
        ],
        "pros": ["Industry standard active noise cancellation", "LDAC high-resolution audio streaming", "Plush comfortable earcups for long flights", "Multipoint connection switches effortlessly between phone and PC"],
        "cons": ["Earcups do not fold inward like XM4", "Case is larger than predecessor"],
        "reviews": ("The ultimate travel and focus headphone", "Cannot fold into a tiny footprint", "Blocks out office chatter and engine roar with eerie perfection.")
    },
    {
        "id": "prd_au_boseqc_ultra_hp",
        "name": "Bose QuietComfort Ultra Headphones",
        "brand": "Bose",
        "category": "audio",
        "model_number": "880066-0100",
        "description": "Bose QuietComfort Ultra with breakthrough Bose Immersive Audio, CustomTune technology that personalizes noise cancellation to your ear shape, ultra-plush luxury cushions, and 24 hours playback.",
        "price": 35999.0,
        "original_price": 39900.0,
        "retailers": [
            {"name": "Amazon India", "price": 35999.0, "original": 39900.0, "url": "https://www.amazon.in/dp/B0CCZ26B5V"}
        ],
        "specs": [
            ("anc_rating", "CustomTune Active ANC", "dB"),
            ("total_battery_life", "24", "hours"),
            ("driver_size", "35", "mm"),
            ("water_resistance", "IPX4", None),
            ("bluetooth_version", "5.3", None)
        ],
        "pros": ["Unmatched sub-bass ANC filtering for air travel", "Spatial Immersive Audio with head tracking", "Foldable design fits in compact travel case"],
        "cons": ["24 hours battery is slightly below Sony's 30h", "High premium tier"],
        "reviews": ("Peak comfort and noise cancellation", "Battery runtime drops to 18h with Immersive Audio on", "The gold standard for air travel isolation.")
    },
    {
        "id": "prd_au_airpodspro2",
        "name": "Apple AirPods Pro (2nd Gen) USB-C",
        "brand": "Apple",
        "category": "audio",
        "model_number": "MTJV3HN/A",
        "description": "Apple AirPods Pro (2nd generation) with H2 chip, up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, Personalized Spatial Audio with dynamic head tracking, and MagSafe USB-C case with speaker.",
        "price": 20999.0,
        "original_price": 24900.0,
        "retailers": [
            {"name": "Apple Store India", "price": 24900.0, "original": 24900.0, "url": "https://www.apple.com/in/airpods-pro/"},
            {"name": "Amazon India", "price": 20999.0, "original": 24900.0, "url": "https://www.amazon.in/dp/B0CHX68YG9"}
        ],
        "specs": [
            ("anc_rating", "48 dB Adaptive ANC", "dB"),
            ("total_battery_life", "30", "hours"),
            ("driver_size", "11", "mm"),
            ("water_resistance", "IP54 (dust, sweat, and water)", None),
            ("bluetooth_version", "5.3", None)
        ],
        "pros": ["Adaptive Audio and Conversation Awareness work like magic", "Class-leading natural Transparency mode", "Precision Finding U1 chip in case with built-in chime speaker"],
        "cons": ["Best features locked to Apple ecosystem", "No high-res LDAC codec"],
        "reviews": ("The finest everyday earbuds for iPhone users", "Android users miss spatial audio and battery widgets", "Transparency mode sounds identical to open ears.")
    },
    {
        "id": "prd_au_sonywf1000xm5",
        "name": "Sony WF-1000XM5",
        "brand": "Sony",
        "category": "audio",
        "model_number": "WF1000XM5/B",
        "description": "Sony WF-1000XM5 truly wireless earbuds with Dynamic Driver X, dual proprietary processors V2 and QN2e, bone conduction voice sensors, LDAC high-res wireless, and 24-hour total battery.",
        "price": 21990.0,
        "original_price": 29990.0,
        "retailers": [
            {"name": "Amazon India", "price": 21990.0, "original": 29990.0, "url": "https://www.amazon.in/dp/B0C33XXS56"}
        ],
        "specs": [
            ("anc_rating", "Integrated Processor V2 ANC", "dB"),
            ("total_battery_life", "24", "hours"),
            ("driver_size", "8.4", "mm"),
            ("water_resistance", "IPX4", None),
            ("bluetooth_version", "5.3", None)
        ],
        "pros": ["25% smaller and 20% lighter than WF-1000XM4", "Dynamic Driver X produces rich textured bass and sparkling highs", "Bone conduction call microphones isolate wind"],
        "cons": ["Glossy sides can be slippery to extract from case", "Polyurethane foam tips wear out faster than silicone"],
        "reviews": ("Audiophile grade wireless earbuds", "Foam tips require replacement after ~9 months", "Top tier sound quality with deep active isolation.")
    },
    {
        "id": "prd_au_sennheiserm4",
        "name": "Sennheiser Momentum 4 Wireless",
        "brand": "Sennheiser",
        "category": "audio",
        "model_number": "M4AEBT",
        "description": "Sennheiser Momentum 4 Wireless headphones featuring audiophile-inspired 42mm transducer system, class-leading 60-hour marathon battery life, adaptive ANC, and customizable sound personalization.",
        "price": 24990.0,
        "original_price": 34990.0,
        "retailers": [
            {"name": "Amazon India", "price": 24990.0, "original": 34990.0, "url": "https://www.amazon.in/dp/B0B6GHW1X5"}
        ],
        "specs": [
            ("anc_rating", "Adaptive Hybrid ANC", "dB"),
            ("total_battery_life", "60", "hours"),
            ("driver_size", "42", "mm"),
            ("water_resistance", "IPX4", None),
            ("bluetooth_version", "5.2", None)
        ],
        "pros": ["Industry-record 60 hours battery on a single charge", "Signature warm Sennheiser audiophile sound signature", "aptX Adaptive high resolution codec"],
        "cons": ["Design is less retro than classic Momentum line", "ANC is half-step behind Bose and Sony"],
        "reviews": ("You only charge it once a month", "ANC doesn't completely silence screeching train brakes", "Unbeatable acoustic tuning and battery endurance.")
    },
    {
        "id": "prd_au_boseqc_ultra_eb",
        "name": "Bose QuietComfort Ultra Earbuds",
        "brand": "Bose",
        "category": "audio",
        "model_number": "880066-0200",
        "description": "Bose QuietComfort Ultra Earbuds with world-class noise cancellation, Bose Immersive Audio with head tracking, CustomTune audio calibration, IPX4 sweat resistance, and 24 hours total battery.",
        "price": 23999.0,
        "original_price": 25900.0,
        "retailers": [
            {"name": "Amazon India", "price": 23999.0, "original": 25900.0, "url": "https://www.amazon.in/dp/B0CCZ1X1ZZ"}
        ],
        "specs": [
            ("anc_rating", "World-Class Active ANC", "dB"),
            ("total_battery_life", "24", "hours"),
            ("driver_size", "9.3", "mm"),
            ("water_resistance", "IPX4", None),
            ("bluetooth_version", "5.3", None)
        ],
        "pros": ["The strongest active noise cancellation of any in-ear bud", "CustomTune tailors EQ to your inner ear acoustics", "Very secure fit with stability bands"],
        "cons": ["Case lacks wireless charging out of the box (requires sleeve)", "App can occasionally disconnect"],
        "reviews": ("Cancels out low frequency drone better than anything", "Wireless charging should be built into case", "Peerless quiet on noisy buses and subways.")
    },
    {
        "id": "prd_au_oneplusnordbuds2",
        "name": "OnePlus Nord Buds 2",
        "brand": "OnePlus",
        "category": "audio",
        "model_number": "NORD-BUDS-2",
        "description": "OnePlus Nord Buds 2 with 12.4mm titanium drivers, up to 25dB ANC, IP55 water and dust resistance, 36 hours total playback, BassWave 2.0, and Dolby Atmos support.",
        "price": 2299.0,
        "original_price": 2999.0,
        "retailers": [
            {"name": "Amazon India", "price": 2299.0, "original": 2999.0, "url": "https://www.amazon.in/dp/B0C5KVP4W3"},
            {"name": "OnePlus Store", "price": 2499.0, "original": 2999.0, "url": "https://www.oneplus.in/nord-buds-2"}
        ],
        "specs": [
            ("anc_rating", "25 dB Active ANC", "dB"),
            ("total_battery_life", "36", "hours"),
            ("driver_size", "12.4", "mm"),
            ("water_resistance", "IP55", None),
            ("bluetooth_version", "5.3", None)
        ],
        "pros": ["True ANC under ₹2,500", "Large 12.4mm titanium drivers for deep bass", "IP55 sweat and rain proofing"],
        "cons": ["25dB ANC is mild compared to flagship buds", "Case feels somewhat plasticky"],
        "reviews": ("Unbeatable value for ₹2300 with real ANC", "ANC only cuts low hums, not voices", "Punchy bass and reliable Bluetooth connection.")
    },
    {
        "id": "prd_au_boatairdopes141",
        "name": "boAt Airdopes 141",
        "brand": "boAt",
        "category": "audio",
        "model_number": "AIRDOPES-141",
        "description": "boAt Airdopes 141 true wireless earbuds with 42 hours total playtime, Beast Mode 80ms low latency for gaming, ENx noise cancellation for calls, ASAP Charge (5m = 75m), and IPX4 rating.",
        "price": 1099.0,
        "original_price": 4490.0,
        "retailers": [
            {"name": "Amazon India", "price": 1099.0, "original": 4490.0, "url": "https://www.amazon.in/dp/B0B1LGWZG1"},
            {"name": "Flipkart", "price": 1199.0, "original": 4490.0, "url": "https://www.flipkart.com/boat-airdopes-141"}
        ],
        "specs": [
            ("anc_rating", "Passive Isolation", None),
            ("total_battery_life", "42", "hours"),
            ("driver_size", "8", "mm"),
            ("water_resistance", "IPX4", None),
            ("bluetooth_version", "5.1", None)
        ],
        "pros": ["Massive 42 hours combined battery life", "Beast mode low latency for gaming", "Extremely pocket-friendly price"],
        "cons": ["No Active Noise Cancellation", "Sound profile is heavily bass boosted"],
        "reviews": ("Best selling budget TWS in India", "Mic is noisy outdoors in heavy traffic", "Tremendous battery life for college students.")
    },
    {
        "id": "prd_au_realmebudsair5pro",
        "name": "Realme Buds Air 5 Pro",
        "brand": "Realme",
        "category": "audio",
        "model_number": "RMA2232",
        "description": "Realme Buds Air 5 Pro with dual drivers (11mm bass + 6mm planar tweeter), 50dB active noise cancellation, Hi-Res Audio certification with LDAC, 40 hours total battery, and 40ms low latency.",
        "price": 4499.0,
        "original_price": 5499.0,
        "retailers": [
            {"name": "Flipkart", "price": 4499.0, "original": 5499.0, "url": "https://www.flipkart.com/realme-buds-air-5-pro"}
        ],
        "specs": [
            ("anc_rating", "50 dB Deep Hybrid ANC", "dB"),
            ("total_battery_life", "40", "hours"),
            ("driver_size", "11+6", "mm"),
            ("water_resistance", "IPX5", None),
            ("bluetooth_version", "5.3", None)
        ],
        "pros": ["Coaxial dual driver setup rivals ₹15k buds", "50dB deep noise cancellation depth", "LDAC Hi-Res codec support"],
        "cons": ["Shiny case picks up scratches", "App requires account sign-up"],
        "reviews": ("Punches way above its price class", "Case scuffs easily in jeans pockets", "Audiophile-level clarity under ₹5,000.")
    },
    {
        "id": "prd_au_galaxybudsfe",
        "name": "Samsung Galaxy Buds FE",
        "brand": "Samsung",
        "category": "audio",
        "model_number": "SM-R400N",
        "description": "Samsung Galaxy Buds FE with Active Noise Canceling, ergonomic wingtip design, 3-mic call clarity with DNN, 30 hours total battery, Auto Switch between Galaxy devices, and SmartThings Find.",
        "price": 4999.0,
        "original_price": 9999.0,
        "retailers": [
            {"name": "Amazon India", "price": 4999.0, "original": 9999.0, "url": "https://www.amazon.in/dp/B0CJL2SVKN"},
            {"name": "Samsung Store", "price": 5499.0, "original": 9999.0, "url": "https://www.samsung.com/in/galaxy-buds-fe/"}
        ],
        "specs": [
            ("anc_rating", "Active Noise Cancellation", "dB"),
            ("total_battery_life", "30", "hours"),
            ("driver_size", "12", "mm"),
            ("water_resistance", "IPX2", None),
            ("bluetooth_version", "5.2", None)
        ],
        "pros": ["Wingtip design provides the most secure fit", "Strong ANC performance under ₹5,000", "Seamless auto switch across Galaxy devices"],
        "cons": ["IPX2 is splash resistant only, not for heavy rain", "No wireless charging"],
        "reviews": ("Best fit of any modern earbud", "Cannot be used for swimming or heavy rain", "The wingtip guarantees they never fall out at the gym.")
    },
    {
        "id": "prd_au_jbltune230nc",
        "name": "JBL Tune 230NC TWS",
        "brand": "JBL",
        "category": "audio",
        "model_number": "JBLT230NCTWS",
        "description": "JBL Tune 230NC with Active Noise Cancelling, Smart Ambient, JBL Pure Bass Sound, 4-Mic technology for crisp calls, up to 40 hours battery (10h bud + 30h case), and IPX4 water resistance.",
        "price": 3699.0,
        "original_price": 7999.0,
        "retailers": [
            {"name": "Amazon India", "price": 3699.0, "original": 7999.0, "url": "https://www.amazon.in/dp/B09NLYZ16K"}
        ],
        "specs": [
            ("anc_rating", "Active Noise Cancelling", "dB"),
            ("total_battery_life", "40", "hours"),
            ("driver_size", "6", "mm"),
            ("water_resistance", "IPX4", None),
            ("bluetooth_version", "5.2", None)
        ],
        "pros": ["JBL Pure Bass signature provides thrilling low end", "10 hours continuous bud battery life", "JBL Headphones app with customizable 10-band EQ"],
        "cons": ["Stick form factor might feel bulky to some", "Case is relatively tall"],
        "reviews": ("Bass that you can physically feel", "Case is a bit chunky in pockets", "Great sound personalization and massive 40h battery.")
    },
    {
        "id": "prd_au_nothingear2",
        "name": "Nothing Ear (2)",
        "brand": "Nothing",
        "category": "audio",
        "model_number": "NOTHING-EAR-2",
        "description": "Nothing Ear (2) featuring iconic transparent design, 11.6mm custom driver, Hi-Res Audio certification with LHDC 5.0, up to 40dB Personalized ANC, dual connection, and Qi wireless charging.",
        "price": 6999.0,
        "original_price": 9999.0,
        "retailers": [
            {"name": "Flipkart", "price": 6999.0, "original": 9999.0, "url": "https://www.flipkart.com/nothing-ear-2"}
        ],
        "specs": [
            ("anc_rating", "40 dB Smart ANC", "dB"),
            ("total_battery_life", "36", "hours"),
            ("driver_size", "11.6", "mm"),
            ("water_resistance", "IP54 (buds) / IP55 (case)", None),
            ("bluetooth_version", "5.3", None)
        ],
        "pros": ["Stunning transparent case and stem aesthetic", "Personalized sound profile test creates custom EQ", "Supports Qi wireless charging"],
        "cons": ["Battery life with ANC on is ~4 hours per charge", "Transparent case is prone to fine hairline scratches"],
        "reviews": ("Pure aesthetic perfection with great audio", "Battery runtime with ANC enabled is modest", "The most stylish earbuds on the market.")
    },
    {
        "id": "prd_au_sonywfc700n",
        "name": "Sony WF-C700N",
        "brand": "Sony",
        "category": "audio",
        "model_number": "WF-C700N",
        "description": "Sony WF-C700N truly wireless noise cancelling earbuds featuring compact lightweight 4.6g ergonomic fit, DSEE audio upscaling, multipoint Bluetooth connection, and up to 20 hours combined battery life.",
        "price": 5990.0,
        "original_price": 8990.0,
        "retailers": [
            {"name": "Amazon India", "price": 5990.0, "original": 8990.0, "url": "https://www.amazon.in/dp/B0C4GC29WK"}
        ],
        "specs": [
            ("anc_rating", "Digital Noise Cancelling", "dB"),
            ("total_battery_life", "20", "hours"),
            ("driver_size", "5", "mm"),
            ("water_resistance", "IPX4", None),
            ("bluetooth_version", "5.2", None)
        ],
        "pros": ["Tiny 4.6g lightweight design fits smaller ears comfortably", "DSEE audio restoration restores compressed tracks", "Reliable dual-device multipoint pairing"],
        "cons": ["No LDAC high resolution codec", "20 hours total battery is average"],
        "reviews": ("Most comfortable earbuds for sleeping and small ears", "No LDAC support at 6k", "Sony audio quality in an ultra-compact body.")
    },
    {
        "id": "prd_au_noisebudsvs104",
        "name": "Noise Buds VS104",
        "brand": "Noise",
        "category": "audio",
        "model_number": "VS104",
        "description": "Noise Buds VS104 with 45 hours total playtime, Instacharge (10 min charge = 200 min playtime), 13mm driver for boosted bass, and Hyper Sync technology for instant device pairing.",
        "price": 999.0,
        "original_price": 2999.0,
        "retailers": [
            {"name": "Amazon India", "price": 999.0, "original": 2999.0, "url": "https://www.amazon.in/dp/B0BQKSQ1N3"}
        ],
        "specs": [
            ("anc_rating", "Passive Isolation", None),
            ("total_battery_life", "45", "hours"),
            ("driver_size", "13", "mm"),
            ("water_resistance", "IPX5", None),
            ("bluetooth_version", "5.2", None)
        ],
        "pros": ["Incredible 45-hour battery under ₹1,000", "Large 13mm speaker driver", "Fast Instacharge top-ups"],
        "cons": ["No Active Noise Cancellation", "Call mic struggles in gusty wind"],
        "reviews": ("Unbeatable sub-1000 rupees backup earbuds", "Mic is strictly indoor quality", "Shockingly great battery life and bass punch.")
    },
    {
        "id": "prd_au_redmibuds5",
        "name": "Redmi Buds 5",
        "brand": "Xiaomi",
        "category": "audio",
        "model_number": "REDMI-BUDS-5",
        "description": "Redmi Buds 5 featuring up to 46dB hybrid active noise cancellation, 12.4mm titanium-coated diaphragm, 40 hours total battery, dual-device smart connectivity, and 4 EQ sound presets.",
        "price": 2499.0,
        "original_price": 3999.0,
        "retailers": [
            {"name": "Amazon India", "price": 2499.0, "original": 3999.0, "url": "https://www.amazon.in/dp/B0CZPYB1PD"}
        ],
        "specs": [
            ("anc_rating", "46 dB Hybrid ANC", "dB"),
            ("total_battery_life", "40", "hours"),
            ("driver_size", "12.4", "mm"),
            ("water_resistance", "IP54", None),
            ("bluetooth_version", "5.3", None)
        ],
        "pros": ["Deep 46dB noise reduction at budget pricing", "Dual device multipoint connection", "12.4mm titanium diaphragm drivers"],
        "cons": ["No wireless charging", "Touch controls take practice to master"],
        "reviews": ("Strongest ANC you can buy under ₹2,500", "Touch controls are sensitive", "Remarkable noise reduction in metro trains and offices.")
    },
    {
        "id": "prd_au_airpodsmax",
        "name": "Apple AirPods Max",
        "brand": "Apple",
        "category": "audio",
        "model_number": "MGYH3HN/A",
        "description": "Apple AirPods Max over-ear headphones with custom dynamic driver, Apple H1 chip in each cup, computational audio, Active Noise Cancellation with Transparency mode, and breathable knit mesh canopy.",
        "price": 54900.0,
        "original_price": 59900.0,
        "retailers": [
            {"name": "Apple Store India", "price": 59900.0, "original": 59900.0, "url": "https://www.apple.com/in/airpods-max/"},
            {"name": "Amazon India", "price": 54900.0, "original": 59900.0, "url": "https://www.amazon.in/dp/B08PZD76NS"}
        ],
        "specs": [
            ("anc_rating", "Active Noise Cancellation", "dB"),
            ("total_battery_life", "20", "hours"),
            ("driver_size", "40", "mm"),
            ("water_resistance", "Passive Resistance", None),
            ("bluetooth_version", "5.0", None)
        ],
        "pros": ["Anodized aluminum cups and stainless steel headband unibody", "Uncanny Spatial Audio with head tracking", "Intuitive Digital Crown volume wheel"],
        "cons": ["Heavier 384g weight on head", "Smart Case offers little physical protection"],
        "reviews": ("Luxury build and unmatched spatial audio", "Smart Case design is universally mocked", "The most premium feeling consumer headphone in existence.")
    },
    {
        "id": "prd_au_oneplusbudspro2",
        "name": "OnePlus Buds Pro 2",
        "brand": "OnePlus",
        "category": "audio",
        "model_number": "E507A",
        "description": "OnePlus Buds Pro 2 co-created with Dynaudio featuring MelodyBoost dual drivers (11mm woofer + 6mm tweeter), 48dB Smart Adaptive ANC, LHDC 4.0 lossless audio, Spatial Audio with head tracking, and Qi wireless charging.",
        "price": 8999.0,
        "original_price": 11999.0,
        "retailers": [
            {"name": "Amazon India", "price": 8999.0, "original": 11999.0, "url": "https://www.amazon.in/dp/B0BQS2R45W"}
        ],
        "specs": [
            ("anc_rating", "48 dB Adaptive ANC", "dB"),
            ("total_battery_life", "39", "hours"),
            ("driver_size", "11+6", "mm"),
            ("water_resistance", "IP55 (buds) / IPX4 (case)", None),
            ("bluetooth_version", "5.3", None)
        ],
        "pros": ["Dynaudio tuned coaxial dual drivers provide pristine separation", "Qi wireless charging support", "Effective 48dB adaptive noise reduction"],
        "cons": ["LHDC codec requires compatible OnePlus/Xiaomi phone", "Stem squeeze controls take getting used to"],
        "reviews": ("Flagship killer earbuds with Dynaudio tuning", "LHDC not widely supported on Samsung or iPhones", "Balanced sound with tight controlled bass.")
    },
    {
        "id": "prd_au_sennheisermtw4",
        "name": "Sennheiser Momentum True Wireless 4",
        "brand": "Sennheiser",
        "category": "audio",
        "model_number": "MTW4",
        "description": "Sennheiser Momentum True Wireless 4 with TrueResponse 7mm transducer system, lossless audio transmission with Snapdragon Sound and aptX Lossless, adaptive ANC, and 30 hours battery.",
        "price": 24990.0,
        "original_price": 29990.0,
        "retailers": [
            {"name": "Amazon India", "price": 24990.0, "original": 29990.0, "url": "https://www.amazon.in/dp/B0CVZ17KLM"}
        ],
        "specs": [
            ("anc_rating", "Adaptive Hybrid ANC", "dB"),
            ("total_battery_life", "30", "hours"),
            ("driver_size", "7", "mm"),
            ("water_resistance", "IP54", None),
            ("bluetooth_version", "5.4", None)
        ],
        "pros": ["Snapdragon Sound with bit-perfect aptX Lossless audio", "Audiophile-grade TrueResponse acoustic drivers", "Bluetooth 5.4 with Auracast and LE Audio future proofing"],
        "cons": ["Bulky charging case with fabric wrap", "Premium price tag"],
        "reviews": ("Pure musicality and instrument separation", "Fabric case can stain if spilled upon", "The audiophile benchmark in true wireless buds.")
    }
]

# ==================== SMARTWATCHES (18) ====================
SMARTWATCHES = [
    {
        "id": "prd_sw_applewatchultra2",
        "name": "Apple Watch Ultra 2",
        "brand": "Apple",
        "category": "smartwatches",
        "model_number": "MRF43HN/A",
        "description": "Apple Watch Ultra 2 with 49mm aerospace titanium case, S9 SiP with Double Tap gesture, 3000 nits Always-On Retina display, dual-frequency precision GPS, Oceanic+ dive computer, and up to 72 hours battery in Low Power Mode.",
        "price": 84900.0,
        "original_price": 89900.0,
        "retailers": [
            {"name": "Apple Store India", "price": 89900.0, "original": 89900.0, "url": "https://www.apple.com/in/apple-watch-ultra-2/"},
            {"name": "Amazon India", "price": 84900.0, "original": 89900.0, "url": "https://www.amazon.in/dp/B0CHX4S7Z1"}
        ],
        "specs": [
            ("display", "1.92-inch Always-On Retina OLED, 3000 nits peak, Sapphire Crystal", None),
            ("battery_life", "36", "hours"),
            ("water_resistance", "100m / EN13319 Dive Certified", None),
            ("sensors", "ECG, SpO2, Skin Temp, Depth Gauge, Siren 86dB", None),
            ("case_material", "Titanium 49mm", None)
        ],
        "pros": ["Ultra-rugged 49mm titanium case with sapphire glass", "Blinding 3000 nits screen readable in harsh desert sun", "Precision dual-frequency L1/L5 GPS tracking", "36-72 hour battery lasts ultra-marathons"],
        "cons": ["Too large for petite wrists", "Works exclusively with iPhones"],
        "reviews": ("The ultimate adventure and endurance smartwatch", "Large form factor can snag on tight dress shirt cuffs", "Rugged reliability and unmatched build precision.")
    },
    {
        "id": "prd_sw_applewatchs9",
        "name": "Apple Watch Series 9",
        "brand": "Apple",
        "category": "smartwatches",
        "model_number": "MR8U3HN/A",
        "description": "Apple Watch Series 9 with S9 SiP, magic Double Tap gesture control, 2000 nits Always-On Retina display, on-device Siri with health access, ECG, and blood oxygen sensing.",
        "price": 38999.0,
        "original_price": 41900.0,
        "retailers": [
            {"name": "Apple Store India", "price": 41900.0, "original": 41900.0, "url": "https://www.apple.com/in/apple-watch-series-9/"},
            {"name": "Amazon India", "price": 38999.0, "original": 41900.0, "url": "https://www.amazon.in/dp/B0CHX5T4MN"}
        ],
        "specs": [
            ("display", "1.7-inch Always-On Retina OLED, 2000 nits, Ion-X Glass", None),
            ("battery_life", "18", "hours"),
            ("water_resistance", "50m Swimproof (WR50)", None),
            ("sensors", "ECG, Optical Heart Rate, SpO2, Temperature Sensor", None)
        ],
        "pros": ["Double Tap one-handed gesture control", "On-device Siri processes offline queries instantly", "Clinical accuracy for heart rate and ECG"],
        "cons": ["18 hours battery requires daily charging", "Requires an iPhone to function"],
        "reviews": ("The quintessential smartwatch for iPhone owners", "Daily charging remains a minor chore", "Fluid software, beautiful watch faces, and life-saving health alerts.")
    },
    {
        "id": "prd_sw_galaxywatch6classic",
        "name": "Samsung Galaxy Watch6 Classic",
        "brand": "Samsung",
        "category": "smartwatches",
        "model_number": "SM-R960N",
        "description": "Samsung Galaxy Watch6 Classic with iconic physical rotating bezel, 47mm stainless steel case, Sapphire Crystal display, advanced sleep coaching, BioActive body composition sensor, and Wear OS 4.",
        "price": 28999.0,
        "original_price": 36999.0,
        "retailers": [
            {"name": "Samsung India", "price": 28999.0, "original": 36999.0, "url": "https://www.samsung.com/in/watches/galaxy-watch/galaxy-watch6-classic/"},
            {"name": "Amazon India", "price": 28999.0, "original": 36999.0, "url": "https://www.amazon.in/dp/B0CC9L88YY"}
        ],
        "specs": [
            ("display", "1.5-inch Super AMOLED (480x480), 2000 nits, Sapphire Crystal", None),
            ("battery_life", "40", "hours"),
            ("water_resistance", "5ATM / IP68 / MIL-STD-810H", None),
            ("sensors", "BioActive Sensor (Optical HR + ECG + BIA Body Fat)", None),
            ("case_material", "Stainless Steel 47mm", None)
        ],
        "pros": ["Tactile physical rotating bezel navigation", "BIA sensor measures body fat percentage and skeletal muscle", "Sapphire crystal display is scratch-proof"],
        "cons": ["ECG & BP features require Samsung Galaxy phone", "Battery requires charging every 1.5 days"],
        "reviews": ("Timeless mechanical watch styling with smart brains", "Some features locked behind Samsung Health Monitor app", "The best looking Android smartwatch hands down.")
    },
    {
        "id": "prd_sw_onepluswatch2",
        "name": "OnePlus Watch 2",
        "brand": "OnePlus",
        "category": "smartwatches",
        "model_number": "OPWWE231",
        "description": "OnePlus Watch 2 with Dual-Engine Architecture (Snapdragon W5 + BES2700), Wear OS 4 with full Google apps, 100-hour battery life in Smart Mode, 2.5D sapphire crystal display, and dual-frequency L1/L5 GPS.",
        "price": 22999.0,
        "original_price": 24999.0,
        "retailers": [
            {"name": "Amazon India", "price": 22999.0, "original": 24999.0, "url": "https://www.amazon.in/dp/B0CX77P2M9"},
            {"name": "OnePlus Store", "price": 22999.0, "original": 24999.0, "url": "https://www.oneplus.in/oneplus-watch-2"}
        ],
        "specs": [
            ("display", "1.43-inch AMOLED, 60Hz, 1000 nits, 2.5D Sapphire Crystal", None),
            ("battery_life", "100", "hours"),
            ("water_resistance", "5ATM / IP68 / MIL-STD-810H", None),
            ("sensors", "Dual Frequency GPS (L1+L5), Optical Heart Rate, SpO2", None)
        ],
        "pros": ["Massive 100 hours (4 days) battery with Wear OS active", "Dual-chip architecture switches seamlessly between RTOS and Wear OS", "Premium stainless steel case with sapphire glass"],
        "cons": ["Rotating crown does not scroll the UI (push button only)", "Chassis is relatively large at 47mm"],
        "reviews": ("Finally a Wear OS watch that lasts 4 full days", "Crown only acts as button, not scroll wheel", "Solves the biggest drawback of Wear OS with stellar battery life.")
    },
    {
        "id": "prd_sw_garminforerunner265",
        "name": "Garmin Forerunner 265",
        "brand": "Garmin",
        "category": "smartwatches",
        "model_number": "010-02810-00",
        "description": "Garmin Forerunner 265 dedicated GPS running smartwatch featuring bright 1.3-inch AMOLED touchscreen, Training Readiness score, Morning Report, Multi-band GNSS tracking, and up to 13 days battery life.",
        "price": 45990.0,
        "original_price": 50990.0,
        "retailers": [
            {"name": "Amazon India", "price": 45990.0, "original": 50990.0, "url": "https://www.amazon.in/dp/B0BWMV38MN"}
        ],
        "specs": [
            ("display", "1.3-inch AMOLED Touchscreen, 416x416, Corning Gorilla Glass 4", None),
            ("battery_life", "13", "days"),
            ("water_resistance", "5ATM (50 meters)", None),
            ("sensors", "Multi-band GNSS SatIQ, Elevate Gen 4 HR, Pulse Ox", None)
        ],
        "pros": ["Unrivalled running dynamics and race predictor analytics", "Stunning AMOLED screen with 13-day battery endurance", "SatIQ multi-band GPS locks onto satellites in seconds"],
        "cons": ["Cannot answer phone calls from wrist (no microphone)", "Premium athletic investment"],
        "reviews": ("The marathon runner's dream training partner", "Lacks speaker and mic for phone calls", "Unbeatable training telemetry, recovery metrics, and battery life.")
    },
    {
        "id": "prd_sw_galaxywatch6",
        "name": "Samsung Galaxy Watch6",
        "brand": "Samsung",
        "category": "smartwatches",
        "model_number": "SM-R930N",
        "description": "Samsung Galaxy Watch6 with 20% larger display, 30% slimmer bezels, Sapphire Crystal glass, customized heart rate zones, sleep coach, and Wear OS powered by Samsung.",
        "price": 19999.0,
        "original_price": 29999.0,
        "retailers": [
            {"name": "Amazon India", "price": 19999.0, "original": 29999.0, "url": "https://www.amazon.in/dp/B0CC9LLM1K"}
        ],
        "specs": [
            ("display", "1.3-inch Super AMOLED, 2000 nits, Sapphire Crystal", None),
            ("battery_life", "40", "hours"),
            ("water_resistance", "5ATM / IP68", None),
            ("sensors", "BioActive Sensor, Sleep Coach, Fall Detection", None)
        ],
        "pros": ["Slim modern aluminum bezel design", "Rich Wear OS app ecosystem (Google Maps, Spotify, WhatsApp)", "Fast wireless charging dock included"],
        "cons": ["Daily charging needed", "Advanced metrics optimized for Galaxy phones"],
        "reviews": ("Great everyday smartwatch for Android users", "Battery requires overnight or morning top-up", "Slim profile makes it comfortable to sleep with.")
    },
    {
        "id": "prd_sw_applewatchse2",
        "name": "Apple Watch SE (2nd Gen)",
        "brand": "Apple",
        "category": "smartwatches",
        "model_number": "MR9U3HN/A",
        "description": "Apple Watch SE (2nd Generation) with S8 SiP chip, Crash Detection, Fall Detection, heart rate notifications, activity tracking, swimproof 50m design, and redesigned nylon composite back.",
        "price": 24900.0,
        "original_price": 29900.0,
        "retailers": [
            {"name": "Apple Store India", "price": 29900.0, "original": 29900.0, "url": "https://www.apple.com/in/apple-watch-se/"},
            {"name": "Amazon India", "price": 24900.0, "original": 29900.0, "url": "https://www.amazon.in/dp/B0BDK6L742"}
        ],
        "specs": [
            ("display", "1.78-inch Retina OLED, 1000 nits", None),
            ("battery_life", "18", "hours"),
            ("water_resistance", "50m Swimproof (WR50)", None),
            ("sensors", "Optical Heart Rate, Crash Detection, Accelerometer", None)
        ],
        "pros": ["Best value entry point into the Apple Watch ecosystem", "Same fast S8 processor as Series 8", "Life-saving Crash Detection and Emergency SOS"],
        "cons": ["No Always-On Display mode", "No ECG or SpO2 sensors"],
        "reviews": ("All the essential Apple Watch features at half the price", "Display turns off when wrist is lowered", "Perfect first smartwatch for iPhone users.")
    },
    {
        "id": "prd_sw_garminvenu3",
        "name": "Garmin Venu 3",
        "brand": "Garmin",
        "category": "smartwatches",
        "model_number": "010-02784-00",
        "description": "Garmin Venu 3 GPS smartwatch with built-in speaker and microphone for phone calls, 14-day battery life, Body Battery energy monitoring, sleep coach with nap detection, and bright 1.4-inch AMOLED display.",
        "price": 48990.0,
        "original_price": 54990.0,
        "retailers": [
            {"name": "Amazon India", "price": 48990.0, "original": 54990.0, "url": "https://www.amazon.in/dp/B0CF481KMN"}
        ],
        "specs": [
            ("display", "1.4-inch AMOLED Touchscreen, 454x454, Gorilla Glass 3", None),
            ("battery_life", "14", "days"),
            ("water_resistance", "5ATM (50 meters)", None),
            ("sensors", "Elevate Gen 5 HR with ECG, Skin Temp, SpO2, Mic/Speaker", None)
        ],
        "pros": ["Full 14 days battery with brilliant AMOLED display", "Take phone calls right from your wrist", "Detects naps and integrates them into Body Battery score"],
        "cons": ["Third-party app store is small compared to Wear OS/watchOS", "Price is steep for non-athletes"],
        "reviews": ("The sweetest spot between health tracker and smartwatch", "Third party app ecosystem is modest", "Outstanding health tracking with 2-week battery life.")
    },
    {
        "id": "prd_sw_amazfitgtr4",
        "name": "Amazfit GTR 4",
        "brand": "Amazfit",
        "category": "smartwatches",
        "model_number": "W2166OV1N",
        "description": "Amazfit GTR 4 with industry-first dual-band circularly-polarized GPS antenna, 14-day battery life, 1.43-inch HD AMOLED display, Bluetooth phone calls, and 150+ sports modes with smart recognition.",
        "price": 16999.0,
        "original_price": 23999.0,
        "retailers": [
            {"name": "Amazon India", "price": 16999.0, "original": 23999.0, "url": "https://www.amazon.in/dp/B0BBNZ8Q8Y"}
        ],
        "specs": [
            ("display", "1.43-inch HD AMOLED, 326 ppi, Anti-Fingerprint Glass", None),
            ("battery_life", "14", "days"),
            ("water_resistance", "5ATM (50 meters)", None),
            ("sensors", "BioTracker 4.0 PPG, Dual-band GPS, Mic & Speaker", None)
        ],
        "pros": ["Accurate dual-band GPS tracks routes through tall buildings", "14-day battery life eliminates charging anxiety", "Take calls and store MP3 music on watch"],
        "cons": ["Zepp OS has limited app selection", "Voice assistant requires Alexa app setup"],
        "reviews": ("Phenomenal battery life and GPS accuracy for 17k", "Zepp OS lacks Google Maps integration", "Super reliable fitness and notification watch.")
    },
    {
        "id": "prd_sw_amazfitgts4",
        "name": "Amazfit GTS 4",
        "brand": "Amazfit",
        "category": "smartwatches",
        "model_number": "W2168OV1N",
        "description": "Amazfit GTS 4 featuring ultra-slim 9.9mm lightweight aluminum body, 1.75-inch HD AMOLED display, dual-band GPS, Bluetooth phone calling, music storage, and up to 8 days battery.",
        "price": 15999.0,
        "original_price": 22999.0,
        "retailers": [
            {"name": "Amazon India", "price": 15999.0, "original": 22999.0, "url": "https://www.amazon.in/dp/B0BBNZ7M4L"}
        ],
        "specs": [
            ("display", "1.75-inch Ultra-Large HD AMOLED, 341 ppi, 1000 nits", None),
            ("battery_life", "8", "days"),
            ("water_resistance", "5ATM", None),
            ("sensors", "BioTracker 4.0, Dual-band GPS, Mic and Speaker", None)
        ],
        "pros": ["Super sleek 9.9mm aluminum rectangular unibody", "Large and vibrant 1.75-inch AMOLED screen", "Bluetooth calling directly through built-in speaker"],
        "cons": ["8 days battery is shorter than the circular GTR 4", "Third party notification replies are limited on iOS"],
        "reviews": ("Apple Watch aesthetic with week-long battery life", "Notification actionability is limited on iPhones", "Sleek, lightweight, and tracks workouts accurately.")
    },
    {
        "id": "prd_sw_fitbitcharge6",
        "name": "Fitbit Charge 6",
        "brand": "Fitbit",
        "category": "smartwatches",
        "model_number": "GA05183-US",
        "description": "Fitbit Charge 6 advanced fitness tracker with built-in Google Maps navigation, Google Wallet tap-to-pay, YouTube Music controls, ECG app, EDA stress sensor, and 7-day battery life.",
        "price": 14999.0,
        "original_price": 16999.0,
        "retailers": [
            {"name": "Amazon India", "price": 14999.0, "original": 16999.0, "url": "https://www.amazon.in/dp/B0CC9M88KK"}
        ],
        "specs": [
            ("display", "1.04-inch Color AMOLED Touchscreen, Always-On Mode", None),
            ("battery_life", "7", "days"),
            ("water_resistance", "50m Water Resistant", None),
            ("sensors", "ECG, EDA Stress Scan, Built-in GPS, SpO2, Optical HR", None)
        ],
        "pros": ["Google Maps turn-by-turn navigation on your wrist", "ECG heart rhythm and electrodermal stress monitoring", "Slim band format doesn't look like a bulky watch"],
        "cons": ["Small screen makes reading long text messages cramped", "Full historical data requires Fitbit Premium subscription"],
        "reviews": ("The best slim fitness band on the market", "Fitbit Premium paywall for advanced analytics is annoying", "Accurate heart rate tracking during high-intensity intervals.")
    },
    {
        "id": "prd_sw_noisecolorfitpro5",
        "name": "Noise ColorFit Pro 5",
        "brand": "Noise",
        "category": "smartwatches",
        "model_number": "WRB-SW-COLORFITPRO5",
        "description": "Noise ColorFit Pro 5 with 1.85-inch AMOLED display, Tru Sync Bluetooth calling with quick dial pad, functional digital crown, SOS technology, rapid health monitoring, and 7 days battery.",
        "price": 3499.0,
        "original_price": 7999.0,
        "retailers": [
            {"name": "Amazon India", "price": 3499.0, "original": 7999.0, "url": "https://www.amazon.in/dp/B0CN5X91KL"}
        ],
        "specs": [
            ("display", "1.85-inch AMOLED, 60Hz, 600 nits, Always-On Display", None),
            ("battery_life", "7", "days"),
            ("water_resistance", "IP68 Water and Dust Resistant", None),
            ("sensors", "Noise Health Suite (HR, SpO2, Sleep, Stress), Mic/Speaker", None)
        ],
        "pros": ["Bright 1.85-inch AMOLED display at ₹3,500", "Functional scrolling crown navigation", "Clear Bluetooth calling via Tru Sync"],
        "cons": ["No built-in standalone GPS (uses phone GPS)", "Step counter can register false positives on bumpy roads"],
        "reviews": ("Shockingly premium AMOLED display for ₹3500", "Lacks built-in GPS for runs", "Great daily notifier with easy Bluetooth calling.")
    },
    {
        "id": "prd_sw_boatwavecall2",
        "name": "boAt Wave Call 2",
        "brand": "boAt",
        "category": "smartwatches",
        "model_number": "WAVE-CALL-2",
        "description": "boAt Wave Call 2 smartwatch with 1.83-inch HD display, advanced Bluetooth calling, 700+ active sports modes, Crest App OS with custom watch face studio, and IP67 rating.",
        "price": 1499.0,
        "original_price": 6990.0,
        "retailers": [
            {"name": "Amazon India", "price": 1499.0, "original": 6990.0, "url": "https://www.amazon.in/dp/B0C77P2M99"}
        ],
        "specs": [
            ("display", "1.83-inch HD Display, 550 nits brightness", None),
            ("battery_life", "5", "days"),
            ("water_resistance", "IP67 Splash Resistant", None),
            ("sensors", "Heart Rate, SpO2, Sleep Monitoring, Bluetooth Mic", None)
        ],
        "pros": ["Pocket-friendly price under ₹1,500", "Large 1.83-inch screen for easy notification reading", "700+ fitness tracking profiles"],
        "cons": ["TFT LCD display, not AMOLED", "Average battery life when Bluetooth calling is active"],
        "reviews": ("Insanely cheap way to get wrist calls", "Screen is LCD, not AMOLED", "A great starter smartwatch for students.")
    },
    {
        "id": "prd_sw_firebolttinvincible",
        "name": "Fire-Boltt Invincible Plus",
        "brand": "Fire-Boltt",
        "category": "smartwatches",
        "model_number": "BSW097",
        "description": "Fire-Boltt Invincible Plus luxury smartwatch featuring 1.43-inch AMOLED display, 4GB internal storage for direct music playback, TWS earbud pairing, Bluetooth calling, and 300+ sports modes.",
        "price": 3999.0,
        "original_price": 21000.0,
        "retailers": [
            {"name": "Amazon India", "price": 3999.0, "original": 21000.0, "url": "https://www.amazon.in/dp/B0BT1S77MN"}
        ],
        "specs": [
            ("display", "1.43-inch AMOLED, 460x460, 600 nits, 2.5D Curved Glass", None),
            ("battery_life", "5", "days"),
            ("water_resistance", "IP67", None),
            ("sensors", "4GB Local Storage, TWS Pairing, Optical HR, SpO2", None)
        ],
        "pros": ["4GB onboard storage plays music directly to wireless earbuds", "Crisp 460x460 AMOLED display", "Metal bezel and premium rotating crown"],
        "cons": ["Heavy on the wrist with metal strap", "Software UI animation can occasionally stutter"],
        "reviews": ("Leave your phone home and connect earbuds to watch", "Battery drops fast when playing local music", "Incredible features for under ₹4,000.")
    },
    {
        "id": "prd_sw_fossilgen6",
        "name": "Fossil Gen 6 Smartwatch",
        "brand": "Fossil",
        "category": "smartwatches",
        "model_number": "FTW4059",
        "description": "Fossil Gen 6 Wear OS smartwatch powered by Snapdragon Wear 4100+, stainless steel case, rapid charging (80% in 30 mins), SpO2 and cardio fitness tracking, and Google Assistant support.",
        "price": 14995.0,
        "original_price": 24995.0,
        "retailers": [
            {"name": "Amazon India", "price": 14995.0, "original": 24995.0, "url": "https://www.amazon.in/dp/B09BL5W6NL"}
        ],
        "specs": [
            ("display", "1.28-inch Color AMOLED, 416x416, 326 ppi", None),
            ("battery_life", "24", "hours"),
            ("water_resistance", "3ATM (30 meters)", None),
            ("sensors", "Snapdragon Wear 4100+, SpO2, Heart Rate, NFC, Mic/Speaker", None)
        ],
        "pros": ["Classic traditional watch styling from a heritage watchmaker", "Rapid charging hits 80% in just 30 minutes", "Wear OS with Google Play Store apps"],
        "cons": ["1-day battery requires charging daily", "Fossil is winding down Wear OS hardware support"],
        "reviews": ("Gorgeous traditional watch silhouette with smarts", "Daily charging is required", "Beautiful aesthetics that pair great with suits and formal wear.")
    },
    {
        "id": "prd_sw_huaweiwatchgt4",
        "name": "Huawei Watch GT 4",
        "brand": "Huawei",
        "category": "smartwatches",
        "model_number": "ARAMIS-B19",
        "description": "Huawei Watch GT 4 featuring geometric octagonal stainless steel bezel, 1.43-inch AMOLED display, 14-day battery life, TruSeen 5.5+ heart and arrhythmia analysis, and comprehensive golf and workout telemetry.",
        "price": 19999.0,
        "original_price": 24999.0,
        "retailers": [
            {"name": "Amazon India", "price": 19999.0, "original": 24999.0, "url": "https://www.amazon.in/dp/B0CJ5X91KL"}
        ],
        "specs": [
            ("display", "1.43-inch AMOLED, 466x466, 326 ppi, Sapphire Glass", None),
            ("battery_life", "14", "days"),
            ("water_resistance", "5ATM / IP68", None),
            ("sensors", "TruSeen 5.5+, Dual-Band GNSS, Calorie Management Stay Fit", None)
        ],
        "pros": ["Distinctive luxury octagonal watchcase aesthetic", "Genuine 2-week battery life", "Accurate TruSeen heart rate and sleep metrics"],
        "cons": ["Huawei Health app must be sideloaded on Android via APK", "No NFC payments in India"],
        "reviews": ("Looks like a luxury Swiss timepiece", "App installation requires QR code scan on Android", "Incredible battery and design refinement.")
    },
    {
        "id": "prd_sw_titancelestial",
        "name": "Titan Celestial Smartwatch",
        "brand": "Titan",
        "category": "smartwatches",
        "model_number": "90184AP01",
        "description": "Titan Celestial premium Indian smartwatch with 1.43-inch Super AMOLED display, premium stainless steel mesh strap, Bluetooth calling, comprehensive wellness suite, and 7-day battery life.",
        "price": 6995.0,
        "original_price": 9995.0,
        "retailers": [
            {"name": "Titan Store India", "price": 6995.0, "original": 9995.0, "url": "https://www.titan.co.in/product/titan-celestial"}
        ],
        "specs": [
            ("display", "1.43-inch Super AMOLED, 466x466, Always-On Display", None),
            ("battery_life", "7", "days"),
            ("water_resistance", "IP68 Water Resistance", None),
            ("sensors", "Heart Rate, SpO2, Sleep Monitor, In-built Mic and Speaker", None)
        ],
        "pros": ["Backed by trusted Tata Titan service network across India", "Premium stainless steel case and magnetic mesh strap", "Crisp 466x466 Super AMOLED panel"],
        "cons": ["No onboard GPS", "Titan Smart app has fewer third-party integrations"],
        "reviews": ("Elegance and trust of Titan in a modern smartwatch", "Lacks GPS for outdoor runners", "Classic formal watch aesthetics with convenient wrist calling.")
    },
    {
        "id": "prd_sw_suunto9peakpro",
        "name": "Suunto 9 Peak Pro",
        "brand": "Suunto",
        "category": "smartwatches",
        "model_number": "SS050849000",
        "description": "Suunto 9 Peak Pro ultra-thin military tested GPS multisport watch crafted in Finland with 100% renewable energy, sapphire crystal, titanium bezel, 40 hours battery in best GPS mode, and 21 days daily battery.",
        "price": 42990.0,
        "original_price": 49990.0,
        "retailers": [
            {"name": "Amazon India", "price": 42990.0, "original": 49990.0, "url": "https://www.amazon.in/dp/B0BFXB1LMN"}
        ],
        "specs": [
            ("display", "1.2-inch Transflective Memory-in-Pixel, Sapphire Crystal", None),
            ("battery_life", "21", "days"),
            ("water_resistance", "100m Waterproof (MIL-STD-810H)", None),
            ("sensors", "4 Satellite Systems, Barometric Altimeter, Optical HR, Snorkeling 10m", None)
        ],
        "pros": ["Super slim 10.8mm titanium profile doesn't catch on ski jackets", "Transflective MIP display shines brighter in direct sunlight", "Handcrafted in Finland with zero carbon footprint"],
        "cons": ["MIP display is dimmer in indoor ambient light", "Touchscreen is utilitarian, not flashy OLED"],
        "reviews": ("Built like an unkillable Nordic tank for outdoor mountaineers", "Screen lacks the pop of modern OLEDs", "Flawless GPS reliability in remote mountainous terrain.")
    }
]
print(f"Loaded {len(AUDIO)} audio products and {len(SMARTWATCHES)} smartwatches.")

