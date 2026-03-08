import os

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "phxnorth-dev-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./phxnorth.db")
