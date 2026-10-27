"""
SmartPick Backend Pytest Suite
"""
from fastapi.testclient import TestClient
try:
    from backend.main import app
except ImportError:
    from main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "SmartPick" in data["service"]

def test_get_products():
    response = client.get("/api/products")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert isinstance(data["data"], list)

def test_recommendations_endpoint():
    response = client.post("/api/recommendations", json={
        "budget_max": 3000.0,
        "intended_use": ["calls"]
    })
    assert response.status_code == 200
    data = response.json()
    assert "recommendations" in data
    assert "session_id" in data

def test_comparison_endpoint():
    response = client.post("/api/compare", json={
        "product_ids": ["p_oneplus_nord_buds_2", "p_realme_buds_air_5"]
    })
    assert response.status_code == 200
    data = response.json()
    assert "products" in data

def test_issue_report_validation():
    # Incomplete payload
    response = client.post("/api/issues", json={})
    assert response.status_code == 422 # Pydantic validation error
