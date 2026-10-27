"""
SmartPick Seed Script – Adds reusable Category hierarchy and sample products across multiple categories.
Idempotent implementation: creates categories/products only if they do not already exist.
"""

import uuid
from datetime import datetime
from database import SessionLocal, engine, Base
from models import Category, Product, RetailerOffer, ProductSpecification, ProductProCon
from sqlalchemy.orm import Session

def get_or_create(session: Session, model, **kwargs):
    """Return existing instance or create a new one (deferred commit)."""
    instance = session.query(model).filter_by(**kwargs).first()
    if instance:
        return instance, False
    instance = model(**kwargs)
    session.add(instance)
    return instance, True

TOP_LEVEL_CATEGORIES = [
    "Electronics and Technology",
    "Fashion and Clothing",
    "Groceries and Food",
    "Home and Kitchen",
    "Beauty and Personal Care",
    "Health, Fitness, and Wellness",
    "Books and Education",
    "Toys, Baby, and Kids",
    "Automotive",
    "Pet Supplies",
    "Gaming and Entertainment",
    "Travel and Luggage",
    "Musical Instruments and Hobbies",
    "Tools and Home Improvement",
    "Other Consumer Products",
]

SUB_CATEGORIES = {
    "Electronics and Technology": ["Smartphones", "Laptops", "Earbuds and headphones"],
    "Fashion and Clothing": ["Men's clothing", "Women's clothing"],
    "Groceries and Food": ["Rice, grains, pulses", "Snacks and confectionery"],
    "Home and Kitchen": ["Furniture", "Kitchen appliances"],
}

def seed_categories(session: Session):
    for name in TOP_LEVEL_CATEGORIES:
        cat, created = get_or_create(session, Category, name=name)
        if created:
            cat.id = f"cat_{uuid.uuid4().hex[:8]}"
        for sub in SUB_CATEGORIES.get(name, []):
            sub_cat, sub_created = get_or_create(session, Category, name=sub)
            if sub_created:
                sub_cat.id = f"cat_{uuid.uuid4().hex[:8]}"
                sub_cat.parent_id = cat.id
    session.commit()

SAMPLE_PRODUCTS = [
    {
        "name": "Sample SmartPhone X",
        "brand": "PhoneCo",
        "category": "Electronics and Technology",
        "model_number": "X2023",
        "description": "A fictional smartphone used for development purposes.",
        "price": 19999.0,
        "retailer": "DemoStore",
        "url": "https://examplestore.com/product/phone-x",
    },
    {
        "name": "Sample Denim Jeans",
        "brand": "DenimCo",
        "category": "Fashion and Clothing",
        "model_number": null,
        "description": "Classic blue denim jeans, sample data.",
        "price": 1299.0,
        "retailer": "DemoStore",
        "url": "https://examplestore.com/product/denim-jeans",
    },
    {
        "name": "Sample Basmati Rice 5kg",
        "brand": "GrainMart",
        "category": "Groceries and Food",
        "model_number": null,
        "description": "Premium basmati rice, 5 kg bag. Sample entry.",
        "price": 799.0,
        "retailer": "DemoStore",
        "url": "https://examplestore.com/product/basmati-rice",
    },
]

def seed_products(session: Session):
    for prod in SAMPLE_PRODUCTS:
        cat = session.query(Category).filter_by(name=prod["category"]).first()
        if not cat:
            continue
        prod_obj, created = get_or_create(
            session,
            Product,
            name=prod["name"],
            brand=prod["brand"],
            category=prod["category"],
            category_id=cat.id,
        )
        if created:
            prod_obj.id = f"prd_{uuid.uuid4().hex[:10]}"
            prod_obj.model_number = prod.get("model_number")
            prod_obj.description = prod["description"]
            prod_obj.image_url = None
            prod_obj.created_at = datetime.utcnow()
            prod_obj.updated_at = datetime.utcnow()
            prod_obj.data_source = "sample"
            prod_obj.last_checked_at = datetime.utcnow()
            prod_obj.data_completeness_score = 80.0
            prod_obj.status = "approved"
            spec = ProductSpecification(
                id=f"spec_{uuid.uuid4().hex[:8]}",
                product_id=prod_obj.id,
                spec_key="sample_key",
                spec_value="sample_value",
                source="sample",
                confidence="verified",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
            session.add(spec)
            offer = RetailerOffer(
                id=f"off_{uuid.uuid4().hex[:8]}",
                product_id=prod_obj.id,
                retailer_name=prod["retailer"],
                retailer_url=prod["url"],
                current_price=prod["price"],
                original_price=prod["price"] * 1.10,
                discount_percentage=10.0,
                availability_status="in_stock",
                affiliate_url=None,
                is_affiliate=False,
                last_checked_at=datetime.utcnow(),
                data_source="sample",
            )
            session.add(offer)
    session.commit()

def run_seed():
    Base.metadata.create_all(bind=engine, checkfirst=True)
    session = SessionLocal()
    try:
        seed_categories(session)
        seed_products(session)
    finally:
        session.close()

if __name__ == "__main__":
    run_seed()
