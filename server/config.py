import os

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "phxnorth-dev-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./phxnorth.db")

# --- Billing (FR-07) ---
# Platform commission taken from each captured session payment.
# Configurable here / via env. Stored as a fraction (0.15 == 15%).
PLATFORM_FEE_PCT = float(os.getenv("PLATFORM_FEE_PCT", "0.15"))
# Default currency for payments/payouts.
BILLING_CURRENCY = os.getenv("BILLING_CURRENCY", "USD")
# Pluggable payment provider. "mock" is the only built-in for now; a real
# provider (Stripe Connect, etc.) can be added behind the same interface.
PAYMENT_PROVIDER = os.getenv("PAYMENT_PROVIDER", "mock")

# --- Stripe (FR-07 real provider) ---
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")

# --- Payout scheduler ---
# Runs a daily job that pays out mentors' captured-but-unpaid earnings.
ENABLE_PAYOUT_SCHEDULER = os.getenv("ENABLE_PAYOUT_SCHEDULER", "true").lower() == "true"
# Hour of day (server local time, 0-23) to run the payout job.
PAYOUT_SCHEDULE_HOUR = int(os.getenv("PAYOUT_SCHEDULE_HOUR", "4"))
