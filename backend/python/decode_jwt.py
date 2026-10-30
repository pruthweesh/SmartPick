import os, json, jwt
secret = os.getenv('JWT_SECRET', 'smartpick_super_secure_jwt_secret_key_change_in_production_2025')
# token from previous login (hardcoded)
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzcl82Njc0MWFlODVkIiwiZW1haWwiOiJ0ZXN0X3VzZXI1QGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJleHAiOjE3OTMxNzM3NDguODA1NjkzfQ.niN_5NBpGQKWbkgPr12aUihh6dlwGmLz4dyJeIK9KhE'
payload = jwt.decode(token, secret, algorithms=['HS256'])
print(json.dumps(payload, indent=2))

