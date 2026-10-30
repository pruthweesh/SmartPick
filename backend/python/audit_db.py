from database import SessionLocal
from models import Product, Category

def main():
    session = SessionLocal()
    
    # Check all categories in DB
    cats = session.query(Category).all()
    print("=== CATEGORIES IN DB ===")
    for c in cats:
        print(f"  id={c.id}, name={c.name}, parent_id={c.parent_id}")
    
    # Check all products and their category values
    products = session.query(Product).all()
    print(f"\n=== PRODUCTS IN DB ({len(products)} total) ===")
    for p in products:
        print(f"  id={p.id}")
        print(f"    name={p.name}")
        print(f"    category={p.category}")
        print(f"    category_id={p.category_id}")
        print(f"    brand={p.brand}")
        print(f"    image_url={p.image_url[:60] if p.image_url else 'NONE'}...")
        print(f"    status={p.status}")
        print(f"    offers={len(p.offers)}, specs={len(p.specifications)}")
    
    session.close()

if __name__ == "__main__":
    main()

