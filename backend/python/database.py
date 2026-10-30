"""
SmartPick SQLAlchemy Database Engine for SQLite V1
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DEFAULT_DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "smartpick.db"))
SQLITE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}")

engine = create_engine(
    SQLITE_URL,
    connect_args={"check_same_thread": False} if SQLITE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
