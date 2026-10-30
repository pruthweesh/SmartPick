import os
from dotenv import load_dotenv
from datetime import timedelta

# Load environment variables from .env located in the same directory as this file
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

# JWT configuration
JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET:
    raise RuntimeError("JWT_SECRET environment variable is required but not set")

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
# Token lifetime: default 7 days if not overridden
expires_days = int(os.getenv("JWT_EXPIRE_DAYS", "7"))
JWT_EXPIRES_DELTA = timedelta(days=expires_days)

