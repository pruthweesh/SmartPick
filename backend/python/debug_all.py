import traceback
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def print_resp(name, resp):
    print(f"{name} status: {resp.status_code}")
    try:
        print(resp.json())
    except Exception:
        print(resp.text)

# Register
reg = client.post('/api/auth/register', json={'email':'debug2@example.com','password':'Password123','full_name':'Debug2'})
print('Register response')
print_resp('register', reg)

# Login
login = client.post('/api/auth/login', json={'email':'debug2@example.com','password':'Password123'})
print('Login response')
print_resp('login', login)
if login.status_code != 200:
    raise SystemExit('Login failed')

token = login.json()['token']
headers = {'Authorization': f'Bearer {token}'}

# auth/me
me = client.get('/api/auth/me', headers=headers)
print('Me response')
print_resp('me', me)

# cart
cart = client.get('/api/cart', headers=headers)
print('Cart response')
print_resp('cart', cart)

# preferences
prefs = client.get('/api/user/preferences', headers=headers)
print('Preferences response')
print_resp('prefs', prefs)

