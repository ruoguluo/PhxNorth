"""Stripe Connect payment provider (FR-07).

Implements the PaymentProvider interface using Stripe's PaymentIntent
(authorize/capture/void), Refund, and Transfer APIs.

All amounts are converted from float dollars to integer cents for Stripe.
"""

from __future__ import annotations

import stripe

import config
from services.payments.base import (
    AuthResult,
    CaptureResult,
    PaymentError,
    PaymentProvider,
    PayoutResult,
)


def _to_cents(amount: float) -> int:
    return int(round(amount * 100))


class StripeProvider(PaymentProvider):
    name = "stripe"

    def __init__(self) -> None:
        key = config.STRIPE_SECRET_KEY
        if not key:
            raise PaymentError("STRIPE_SECRET_KEY is not configured")
        stripe.api_key = key

    def authorize(self, amount: float, currency: str, ref: str, *, customer_id: str | None = None, payment_method_id: str | None = None) -> AuthResult:
        if amount < 0:
            raise PaymentError("Authorization amount cannot be negative")
        if not customer_id or not payment_method_id:
            raise PaymentError("Stripe requires customer_id and payment_method_id for authorization")
        try:
            intent = stripe.PaymentIntent.create(
                amount=_to_cents(amount), currency=currency.lower(), capture_method="manual",
                customer=customer_id, payment_method=payment_method_id, confirm=True, off_session=True,
                metadata={"ref": ref},
            )
            return AuthResult(auth_ref=intent.id)
        except stripe.StripeError as e:
            raise PaymentError(f"Stripe authorization failed: {e}") from e

    def capture(self, auth_ref: str, amount: float) -> CaptureResult:
        if not auth_ref:
            raise PaymentError("Missing authorization reference")
        try:
            intent = stripe.PaymentIntent.capture(auth_ref, amount_to_capture=_to_cents(amount))
            return CaptureResult(charge_ref=intent.id)
        except stripe.StripeError as e:
            raise PaymentError(f"Stripe capture failed: {e}") from e

    def void(self, auth_ref: str) -> None:
        if not auth_ref:
            raise PaymentError("Missing authorization reference")
        try:
            stripe.PaymentIntent.cancel(auth_ref)
        except stripe.StripeError as e:
            raise PaymentError(f"Stripe void failed: {e}") from e

    def refund(self, charge_ref: str, amount: float) -> str:
        if not charge_ref:
            raise PaymentError("Missing charge reference")
        try:
            refund = stripe.Refund.create(payment_intent=charge_ref, amount=_to_cents(amount))
            return refund.id
        except stripe.StripeError as e:
            raise PaymentError(f"Stripe refund failed: {e}") from e

    def create_payout(self, mentor_id: int, amount: float, currency: str, *, destination_account_id: str | None = None) -> PayoutResult:
        if amount <= 0:
            raise PaymentError("Payout amount must be positive")
        if not destination_account_id:
            raise PaymentError(f"Mentor {mentor_id} has no Stripe connected account")
        try:
            transfer = stripe.Transfer.create(
                amount=_to_cents(amount), currency=currency.lower(),
                destination=destination_account_id, metadata={"mentor_id": str(mentor_id)},
            )
            return PayoutResult(payout_ref=transfer.id)
        except stripe.StripeError as e:
            raise PaymentError(f"Stripe payout failed: {e}") from e
