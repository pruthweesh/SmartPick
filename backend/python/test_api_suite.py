"""
Test suite for SmartPick products catalog and filters.
"""
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_endpoints():
    print("Testing /api/health...")
    r = client.get("/api/health")
    assert r.status_code == 200, f"Health check failed: {r.status_code}"
    print("Health OK:", r.json())

    # 1. All products
    r = client.get("/api/products?limit=100")
    assert r.status_code == 200
    data = r.json()
    total = data["meta"]["total"]
    prods = data["data"]
    print(f"\n[All Products] Total: {total}, Returned: {len(prods)}")
    assert total >= 100, f"Expected at least 100 products, got {total}"

    # 2. Each category
    categories = ["smartphones", "laptops", "audio", "smartwatches", "tablets", "smart-home"]
    for cat in categories:
        r = client.get(f"/api/products?category={cat}&limit=50")
        assert r.status_code == 200, f"Failed for category {cat}: {r.status_code}"
        cat_data = r.json()
        count = cat_data["meta"]["total"]
        sample = cat_data["data"][0] if cat_data["data"] else None
        print(f"[{cat.upper()}] Count: {count} | First: {sample['name'] if sample else 'None'} | Image: {sample['image_url'] if sample else 'None'}")
        assert count >= 15, f"Category {cat} has only {count} products (expected >= 15)"

    # 3. Filter test: Audio + ANC + Under 10k
    r = client.get("/api/products?category=audio&anc=true&max_price=10000")
    assert r.status_code == 200
    filter_data = r.json()
    filtered_count = filter_data["meta"]["total"]
    print(f"\n[Filter: Audio + ANC + Under 10k] Count: {filtered_count}")
    for item in filter_data["data"][:3]:
        price = min([o["current_price"] for o in item["offers"]]) if item["offers"] else 0
        print(f"  - {item['name']} (Rs. {price})")
    assert filtered_count > 0, "Expected filtered results for Audio + ANC + Under 10k"

    # 4. Filter test: Keyword search "iPhone"
    r = client.get("/api/products?search=iPhone")
    assert r.status_code == 200
    search_data = r.json()
    search_count = search_data["meta"]["total"]
    print(f"\n[Search: 'iPhone'] Count: {search_count}")
    for item in search_data["data"]:
        print(f"  - {item['name']} ({item['brand']})")
    assert search_count >= 2, "Expected iPhone search results"

    # 5. Product Detail test
    first_id = prods[0]["id"]
    r = client.get(f"/api/products/{first_id}")
    assert r.status_code == 200
    detail = r.json()
    print(f"\n[Product Detail: {first_id}] Name: {detail['name']}, Specs: {len(detail['specifications'])}, Offers: {len(detail['offers'])}")
    assert len(detail["specifications"]) >= 4, "Expected at least 4 specs"
    assert len(detail["offers"]) >= 1, "Expected at least 1 offer"

    print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_endpoints()

