import sys
from database import SessionLocal
from models import Product

def main():
    session = SessionLocal()
    products = session.query(Product).all()
    print('Total products:', len(products))
    for p in products[:10]:
        print(p.id, p.name, p.image_url)
    session.close()

if __name__ == '__main__':
    main()

