import os, sys

# Add the project backend directory to Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(project_root)

from passlib.hash import pbkdf2_sha256
from database import SessionLocal
from models import User

pwd = "SmartPick2025!"  # admin password from DEPLOYMENT.md
hashed = pbkdf2_sha256.hash(pwd)

db = SessionLocal()
admin = db.query(User).filter(User.email == "admin@smartpick.in").first()
if admin:
    admin.hashed_password = hashed
    db.commit()
    print("Admin password re-hashed with pbkdf2_sha256")
else:
    print("Admin user not found")

db.close()
