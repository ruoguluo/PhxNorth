"""Pluggable payment provider abstraction (FR-07)."""

from services.payments.base import PaymentError, PaymentProvider
from services.payments.mock import MockProvider


def get_provider(name: str | None = None) -> PaymentProvider:
    """Return the configured payment provider instance."""
    import config

    name = (name or getattr(config, "PAYMENT_PROVIDER", "mock")).lower()
    if name == "mock":
        return MockProvider()
    elif name == "stripe":
        from .stripe import StripeProvider

        return StripeProvider()
    raise ValueError(f"Unknown payment provider: {name!r}")


__all__ = ["PaymentProvider", "PaymentError", "MockProvider", "get_provider"]
