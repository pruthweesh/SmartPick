import os
from database import engine, Base
# Import all models so they are registered with Base.metadata
from models import *

if __name__ == "__main__":
    # This will create any missing tables in the SQLite DB (smartpick.db)
    Base.metadata.create_all(bind=engine)
    print("Database tables ensured.")
