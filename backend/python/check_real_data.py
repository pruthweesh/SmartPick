from database import SessionLocal
from models import Product, RetailerOffer, ProductSpecification

db = SessionLocal()

# Find products with real data
offers = db.query(RetailerOffer).all()
specs = db.query(ProductSpecification).all()

print("=== Offers ===")
for o in offers:
    print(f"  offer_id={o.id}, product_id={o.product_id}, retailer={o.retailer_name}, price={o.current_price}, original={o.original_price}")

print("\n=== Specs ===")
for s in specs:
    print(f"  spec_id={s.id}, product_id={s.product_id}, key={s.spec_key}, value={s.spec_value}")

# Find products with real images
products_with_images = [p for p in db.query(Product).all() if p.image_url and 'placeholder' not in p.image_url]
print(f"\n=== Products with real images: {len(products_with_images)} ===")
for p in products_with_images[:3]:
    print(f"  id={p.id}, name={p.name}, image_url={p.image_url[:80]}")

db.close()

