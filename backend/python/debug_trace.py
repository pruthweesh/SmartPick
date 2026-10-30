import traceback
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def safe_call(method, url, headers=None):
    try:
        resp = client.request(method, url, headers=headers)
        print(f"{method} {url} -> {resp.status_code}")
        print(resp.text)
    except Exception:
        print('Exception during request:')
        traceback.print_exc()

# Register user
reg = client.post('/api/auth/register', json={'email':'trace@example.com','password':'Password123','full_name':'Trace User'})
print('Register status', reg.status_code)
# Login
login = client.post('/api/auth/login', json={'email':'trace@example.com','password':'Password123'})
print('Login status', login.status_code)
if login.status_code != 200:
    raise SystemExit('Login failed')

token = login.json()['token']
headers = {'Authorization': f'Bearer {token}'}

safe_call('GET', '/api/auth/me', headers)
safe_call('GET', '/api/cart', headers)
safe_call('GET', '/api/user/preferences', headers)

