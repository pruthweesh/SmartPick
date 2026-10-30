import uuid
from urllib.parse import quote_plus
from sqlalchemy.orm import Session

from database import SessionLocal, engine, Base
from models import Product, Category


def ensure_categories(session: Session):
    """Create top‑level and sub‑categories if they don't exist.
    Returns a mapping from lowercase sub‑category name to its id.
    """
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

    sub_names = ["Earbuds", "Headphones", "Audio Accessories"]
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
            print(f"Created sub‑category {sub}")
        mapping[sub.lower()] = cat.id
    return mapping


def update_products(session: Session, cat_map: dict):
    """Replace image URLs with a safe placeholder and set proper category_id.
    Also updates the legacy `category` string for backward compatibility.
    """
    products = session.query(Product).all()
    updated = 0
    for p in products:
        # Use a placeholder image that always works
        placeholder = f"https://via.placeholder.com/300?text={quote_plus(p.name)}"
        if p.image_url != placeholder:
            p.image_url = placeholder
            updated += 1
        # Heuristic to choose sub‑category based on product name
        name_lower = (p.name or "").lower()
        if "earbud" in name_lower or "bud" in name_lower:
            sub_key = "earbuds"
        elif "headphone" in name_lower:
            sub_key = "headphones"
        else:
            sub_key = "audio accessories"
        cat_id = cat_map.get(sub_key)
        if cat_id and p.category_id != cat_id:
            p.category_id = cat_id
            p.category = sub_key.title()
            updated += 1
    session.commit()
    print(f"✅ Updated {updated} product fields (image_url, category_id)")


def main():
    Base.metadata.create_all(bind=engine)  # ensure tables exist
    db = SessionLocal()
    try:
        cat_map = ensure_categories(db)
        update_products(db, cat_map)
        print("✅ Demo data fixed")
    finally:
        db.close()

if __name__ == "__main__":
    main()

