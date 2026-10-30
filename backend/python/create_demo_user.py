import bcrypt
from database import SessionLocal
from models import User
import uuid

DEMO_EMAIL = "demo@smartpick.com"
DEMO_PASSWORD = "demo1234"

def create_demo_user():
    session = SessionLocal()
    try:
        existing = session.query(User).filter(User.email == DEMO_EMAIL).first()
        if existing:
            print("Demo user already exists.")
            return
        hashed = bcrypt.hashpw(DEMO_PASSWORD.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        demo_user = User(
            id=f"usr_{uuid.uuid4().hex[:8]}",
            email=DEMO_EMAIL,
            full_name="Demo User",
            hashed_password=hashed,
            role="user",
            is_active=True,
        )
        session.add(demo_user)
        session.commit()
        print("Demo user created.")
    finally:
        session.close()

if __name__ == "__main__":
    create_demo_user()
