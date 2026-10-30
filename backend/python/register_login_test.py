import json, requests, sys
base = 'http://127.0.0.1:8000/api'
payload = {
    'email': 'test_user5@example.com',
    'password': 'TestPass123!',
    'full_name': 'Test User',
    'phone': '1234567890'
}
# Register
reg = requests.post(f'{base}/auth/register', json=payload)
print('REGISTER status', reg.status_code)
print('REGISTER body', reg.text)
# If registration succeeded (or already exists), attempt login
login = requests.post(f'{base}/auth/login', json=payload)
print('LOGIN status', login.status_code)
print('LOGIN body', login.text)
if login.status_code == 200:
    token = login.json().get('token')
    headers = {'Authorization': f'Bearer {token}'}
    # Test protected endpoint /auth/me
    me = requests.get(f'{base}/auth/me', headers=headers)
    print('ME status', me.status_code)
    print('ME body', me.text)
    # Test protected /cart
    cart = requests.get(f'{base}/cart', headers=headers)
    print('CART status', cart.status_code)
    print('CART body', cart.text)
else:
    print('Login failed, cannot test protected routes')

