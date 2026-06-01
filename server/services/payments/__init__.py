"""Pluggable payment provider abstraction (FR-07)."""

from services.payments.base import PaymentError, PaymentProvider
from services.payments.mock import MockProvider


def get_provider(name: str | None = None) -> PaymentProvider:
    """Return the configured payment provider instance.

    Only the in-process ``mock`` provider is built in for now. A real
    provider (Stripe Connect, etc.) can be registered here behind the same
    ``PaymentProvider`` interface without touching call sites.
    """
    import config

    name = (name or getattr(config, "PAYMENT_PROVIDER", "mock")).lower()
    if name == "mock":
        return MockProvider()
    raise ValueError(f"Unknown payment provider: {name!r}")


__all__ = ["PaymentProvider", "PaymentError", "MockProvider", "get_provider"]
