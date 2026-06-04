"""Unit tests for StripeProvider (mocked Stripe API)."""

from unittest.mock import patch, MagicMock

import pytest

import os
os.environ["STRIPE_SECRET_KEY"] = "sk_test_fake"

import config  # noqa: E402
config.STRIPE_SECRET_KEY = "sk_test_fake"

from services.payments.stripe import StripeProvider, _to_cents  # noqa: E402
from services.payments.base import PaymentError  # noqa: E402


def test_to_cents():
    assert _to_cents(10.00) == 1000
    assert _to_cents(0.50) == 50
    assert _to_cents(99.99) == 9999
    assert _to_cents(0) == 0


def test_authorize_requires_customer():
    provider = StripeProvider()
    with pytest.raises(PaymentError, match="customer_id"):
        provider.authorize(100.0, "usd", "ref1")


def test_authorize_requires_payment_method():
    provider = StripeProvider()
    with pytest.raises(PaymentError, match="customer_id"):
        provider.authorize(100.0, "usd", "ref1", customer_id="cus_123")


@patch("services.payments.stripe.stripe")
def test_authorize_success(mock_stripe):
    mock_stripe.PaymentIntent.create.return_value = MagicMock(id="pi_abc123")
    provider = StripeProvider()
    result = provider.authorize(
        50.0, "usd", "session:1",
        customer_id="cus_123", payment_method_id="pm_456",
    )
    assert result.auth_ref == "pi_abc123"
    mock_stripe.PaymentIntent.create.assert_called_once()
    call_kwargs = mock_stripe.PaymentIntent.create.call_args[1]
    assert call_kwargs["amount"] == 5000
    assert call_kwargs["capture_method"] == "manual"


@patch("services.payments.stripe.stripe")
def test_capture_success(mock_stripe):
    mock_stripe.PaymentIntent.capture.return_value = MagicMock(id="pi_abc123")
    provider = StripeProvider()
    result = provider.capture("pi_abc123", 50.0)
    assert result.charge_ref == "pi_abc123"


@patch("services.payments.stripe.stripe")
def test_void_success(mock_stripe):
    provider = StripeProvider()
    provider.void("pi_abc123")
    mock_stripe.PaymentIntent.cancel.assert_called_once_with("pi_abc123")


@patch("services.payments.stripe.stripe")
def test_refund_success(mock_stripe):
    mock_stripe.Refund.create.return_value = MagicMock(id="re_xyz789")
    provider = StripeProvider()
    ref = provider.refund("pi_abc123", 25.0)
    assert ref == "re_xyz789"


def test_payout_requires_destination():
    provider = StripeProvider()
    with pytest.raises(PaymentError, match="no Stripe connected account"):
        provider.create_payout(1, 100.0, "usd")


@patch("services.payments.stripe.stripe")
def test_payout_success(mock_stripe):
    mock_stripe.Transfer.create.return_value = MagicMock(id="tr_pay123")
    provider = StripeProvider()
    result = provider.create_payout(1, 100.0, "usd", destination_account_id="acct_abc")
    assert result.payout_ref == "tr_pay123"
