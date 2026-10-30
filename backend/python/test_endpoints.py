import json
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# Register user (ignore if already exists)
reg = client.post('/api/auth/register', json={'email':'test3@example.com','password':'Password123','full_name':'Test User3'})
print('Register:', reg.status_code, reg.text)

# Login
login = client.post('/api/auth/login', json={'email':'test3@example.com','password':'Password123'})
print('Login:', login.status_code, login.text)
if login.status_code != 200:
    raise SystemExit('Login failed')

token = login.json()['token']
headers = {'Authorization': f'Bearer {token}'}

def call(method, path):
    resp = client.request(method, path, headers=headers)
    print(f'{method} {path} ->', resp.status_code)
    try:
        print(resp.json())
    except Exception:
        print(resp.text)

call('GET', '/api/auth/me')
call('GET', '/api/cart')
call('GET', '/api/user/preferences')

