import os
import json
from fastapi.testclient import TestClient
from main import app, JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRES_DELTA
from datetime import datetime, timedelta
import jwt

client = TestClient(app)

# Register a test user (ignore if already exists)
register_data = {
    "email": "test@example.com",
    "password": "Password123",
    "full_name": "Test User"
}
resp = client.post("/api/auth/register", json=register_data)
print('Register status:', resp.status_code, resp.json() if resp.status_code != 400 else 'already exists')

# Login
login_data = {"email": "test@example.com", "password": "Password123"}
resp = client.post("/api/auth/login", json=login_data)
print('Login status:', resp.status_code, resp.json())
if resp.status_code != 200:
    raise SystemExit('Login failed')

token = resp.json()["token"]
headers = {"Authorization": f"Bearer {token}"}

# Helper to call endpoint and print result
def call(method, url):
    resp = client.request(method, url, headers=headers)
    print(f"{method} {url} -> {resp.status_code}")
    try:
        print(resp.json())
    except Exception:
        print(resp.text)

call("GET", "/api/auth/me")
call("GET", "/api/cart")
call("GET", "/api/user/preferences")

