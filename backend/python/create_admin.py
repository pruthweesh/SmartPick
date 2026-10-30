import os
import sys
from pathlib import Path

# Add the backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
sys.path.append(str(backend_dir))

from passlib.hash import pbkdf2_sha256
from database import Base, engine, SessionLocal
from models import User

# Ensure tables exist
Base.metadata.create_all(bind=engine)

admin_email = "admin@smartpick.in"
admin_pwd = "SmartPick2025!"
hashed = pbkdf2_sha256.hash(admin_pwd)

db = SessionLocal()
admin = db.query(User).filter(User.email == admin_email).first()
if not admin:
    user_id = f"usr_{os.urandom(5).hex()}"
    admin = User(
        id=user_id,
        email=admin_email,
        hashed_password=hashed,
        full_name="Admin User",
        phone="",
        role="admin",
        is_active=True,
    )
    db.add(admin)
    db.commit()
    print("Admin account created.")
else:
    admin.hashed_password = hashed
    db.commit()
    print("Admin password updated.")

db.close()
