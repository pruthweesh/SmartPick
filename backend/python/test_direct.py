"""
Direct unit test for list_products and get_product endpoints in main.py
"""
import sys
from database import SessionLocal
from main import list_products, get_product

def test_direct():
    db = SessionLocal()
    print("Testing direct list_products...")

    # 1. All products
    res = list_products(db=db, limit=100)
    total = res["meta"]["total"]
    prods = res["data"]
    print(f"[All Products] Total: {total}, Returned: {len(prods)}")
    assert total >= 100, f"Expected >= 100 products, got {total}"

    # 2. Each category
    categories = ["smartphones", "laptops", "audio", "smartwatches", "tablets", "smart-home"]
    for cat in categories:
        cat_res = list_products(category=cat, db=db, limit=50)
        count = cat_res["meta"]["total"]
        sample = cat_res["data"][0] if cat_res["data"] else None
        print(f"[{cat.upper()}] Count: {count} | First: {sample['name'] if sample else 'None'} | Image: {sample['image_url'] if sample else 'None'}")
        assert count >= 15, f"Category {cat} has only {count} products (expected >= 15)"

    # 3. Filter: Audio + ANC + Under 10k
    filter_res = list_products(category="audio", anc="true", max_price=10000.0, db=db, limit=50)
    print(f"\n[Filter: Audio + ANC + Under 10k] Count: {filter_res['meta']['total']}")
    for item in filter_res["data"][:3]:
        price = min([o["current_price"] for o in item["offers"]]) if item["offers"] else 0
        print(f"  - {item['name']} (Rs. {price})")
    assert filter_res["meta"]["total"] > 0, "Expected filtered results"

    # 4. Search test: "MacBook"
    search_res = list_products(search="MacBook", db=db)
    print(f"\n[Search: 'MacBook'] Count: {search_res['meta']['total']}")
    for item in search_res["data"]:
        print(f"  - {item['name']}")
    assert search_res["meta"]["total"] >= 3, "Expected at least 3 MacBook models"

    # 5. Product Detail
    first_id = prods[0]["id"]
    detail = get_product(first_id, db=db)
    print(f"\n[Product Detail: {first_id}] Name: {detail['name']}, Specs: {len(detail['specifications'])}, Offers: {len(detail['offers'])}")
    assert len(detail["specifications"]) >= 4
    assert len(detail["offers"]) >= 1

    db.close()
    print("\nALL DIRECT ENDPOINT CHECKS PASSED PERFECTLY!")

if __name__ == "__main__":
    test_direct()

