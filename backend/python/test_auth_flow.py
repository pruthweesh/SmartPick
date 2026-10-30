import requests, json, sys, os

def pretty_print(resp):
    print('Status:', resp.status_code)
    try:
        print(json.dumps(resp.json(), indent=2))
    except Exception:
        print(resp.text)

def main():
    base = 'http://127.0.0.1:8000'
    # Register
    reg_payload = {
        "email": "test_user_xyz@example.com",
        "password": "TestPass123!",
        "full_name": "Test User XYZ",
        "phone": "1234567890"
    }
    r = requests.post(f"{base}/api/auth/register", json=reg_payload)
    print('--- Register ---')
    pretty_print(r)
    if r.status_code != 200:
        sys.exit(1)
    token = r.json()['token']
    headers = {'Authorization': f'Bearer {token}'}
    # Auth me
    r = requests.get(f"{base}/api/auth/me", headers=headers)
    print('--- /auth/me ---')
    pretty_print(r)
    # Cart (should be empty)
    r = requests.get(f"{base}/api/cart", headers=headers)
    print('--- /cart ---')
    pretty_print(r)
    # Preferences (may not exist)
    r = requests.get(f"{base}/api/user/preferences", headers=headers)
    print('--- /user/preferences ---')
    pretty_print(r)

if __name__ == '__main__':
    main()

