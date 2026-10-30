import uuid
from datetime import datetime
from database import SessionLocal, engine, Base
from models import Product

def update_missing_images():
    session = SessionLocal()
    try:
        products = session.query(Product).filter((Product.image_url == None) | (Product.image_url == '')).all()
        for p in products:
            p.image_url = f"https://picsum.photos/seed/{p.id}/600/400"
            p.updated_at = datetime.utcnow()
        session.commit()
        print(f"Updated {len(products)} products with placeholder images.")
    finally:
        session.close()

if __name__ == '__main__':
    update_missing_images()
