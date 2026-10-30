import uuid
from datetime import datetime
from sqlalchemy.orm import Session

from database import SessionLocal, engine, Base
from models import Category, Product


def ensure_category_hierarchy(session: Session):
    """Create top‑level and sub‑categories if they don't exist.
    Returns a dict mapping a friendly name to its Category.id.
    """
    # Top‑level container
    top = session.query(Category).filter_by(name="Electronics and Technology").first()
    if not top:
        top = Category(
            id=f"cat_{uuid.uuid4().hex[:10]}",
            name="Electronics and Technology",
            parent_id=None,
        )
        session.add(top)
        session.commit()
        session.refresh(top)
        print("Created top‑level category")

    # Sub‑categories we care about – all products in seed_realistic use "electronics"
    sub_names = [
        "Earbuds",
        "Headphones",
        "Audio Accessories",
    ]
    mapping = {}
    for sub in sub_names:
        cat = session.query(Category).filter_by(name=sub).first()
        if not cat:
            cat = Category(
                id=f"cat_{uuid.uuid4().hex[:10]}",
                name=sub,
                parent_id=top.id,
            )
            session.add(cat)
            session.commit()
            session.refresh(cat)
            print(f"Created sub-category {sub}")
        mapping[sub.lower()] = cat.id
    return mapping


def fix_products(session: Session, category_map: dict):
    """Update each product to reference a proper category_id and ensure image_url.
    The seed data uses product.category == "electronics" – we map that to the
    generic "Earbuds" sub‑category (you can adjust mapping logic if needed).
    """
    products = session.query(Product).all()
    updated = 0
    for p in products:
        # Ensure image_url is non‑empty – if empty, log and skip (should not happen)
        if not p.image_url:
            print(f"[WARN] Product {p.id} ({p.name}) has no image_url")
        # Determine which sub‑category to assign based on a simple heuristic
        # Here we look at the product name/brand for known keywords.
        name_lower = (p.name or "").lower()
        if "earbud" in name_lower or "bud" in name_lower:
            sub_key = "earbuds"
        elif "headphone" in name_lower:
            sub_key = "headphones"
        else:
            sub_key = "audio accessories"
        cat_id = category_map.get(sub_key)
        if cat_id and p.category_id != cat_id:
            p.category_id = cat_id
            # Keep legacy string for backward compatibility but set it to a readable
            p.category = sub_key.title()
            updated += 1
    session.commit()
    print(f"🛠️ Updated {updated} products with correct category_id")


def main():
    Base.metadata.create_all(bind=engine)  # ensure tables exist
    db = SessionLocal()
    try:
        cat_map = ensure_category_hierarchy(db)
        fix_products(db, cat_map)
        print("✅ All products now linked to proper categories")
    finally:
        db.close()

if __name__ == "__main__":
    main()
