import json
from database import SessionLocal
from models import Product, RetailerOffer, ProductSpecification

db = SessionLocal()

# Check total counts
products = db.query(Product).all()
offers = db.query(RetailerOffer).all()
specs = db.query(ProductSpecification).all()

print(f"Total products: {len(products)}")
print(f"Total offers: {len(offers)}")
print(f"Total specs: {len(specs)}")

# Check first product details
p = products[0]
print(f"\n--- First product ---")
print(f"id: {p.id}")
print(f"name: {p.name}")
print(f"brand: {p.brand}")
print(f"category: {p.category}")
print(f"image_url: {p.image_url}")
print(f"status: {p.status}")
print(f"offers count: {len(p.offers)}")
print(f"specs count: {len(p.specifications)}")
print(f"pros_cons count: {len(p.pros_cons)}")

# Check if any product has real data
has_real_image = any(p.image_url and 'placeholder' not in p.image_url for p in products)
has_offers = any(len(p.offers) > 0 for p in products)
has_specs = any(len(p.specifications) > 0 for p in products)

print(f"\nAny product with real image: {has_real_image}")
print(f"Any product with offers: {has_offers}")
print(f"Any product with specs: {has_specs}")

db.close()

