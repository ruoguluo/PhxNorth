"""In-process mock payment provider for development/testing (FR-07).

Generates deterministic-looking references and always succeeds. No external
calls, no stored card data. A real provider implements the same interface.
"""

from __future__ import annotations

import uuid

from services.payments.base import (
    AuthResult,
    CaptureResult,
    PaymentError,
    PaymentProvider,
    PayoutResult,
)


class MockProvider(PaymentProvider):
    """Simulates a payment processor entirely in memory."""

    name = "mock"

    @staticmethod
    def _ref(prefix: str) -> str:
        return f"mock_{prefix}_{uuid.uuid4().hex[:16]}"

    def authorize(self, amount: float, currency: str, ref: str) -> AuthResult:
        if amount < 0:
            raise PaymentError("Authorization amount cannot be negative")
        return AuthResult(auth_ref=self._ref("auth"))

    def capture(self, auth_ref: str, amount: float) -> CaptureResult:
        if not auth_ref:
            raise PaymentError("Missing authorization reference")
        return CaptureResult(charge_ref=self._ref("ch"))

    def void(self, auth_ref: str) -> None:
        if not auth_ref:
            raise PaymentError("Missing authorization reference")
        return None

    def refund(self, charge_ref: str, amount: float) -> str:
        if not charge_ref:
            raise PaymentError("Missing charge reference")
        return self._ref("re")

    def create_payout(self, mentor_id: int, amount: float, currency: str) -> PayoutResult:
        if amount <= 0:
            raise PaymentError("Payout amount must be positive")
        return PayoutResult(payout_ref=self._ref("po"))
