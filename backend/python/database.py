"""
SmartPick SQLAlchemy Database Engine for SQLite V1
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLITE_URL = os.getenv("DATABASE_URL", "sqlite:///./smartpick.db")

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
