"""PaymentProvider interface.

A provider performs the external money operations. The billing service layer
(``services.billing``) owns the domain model (Payment/Payout/Ledger) and calls
into a provider for the actual authorize/capture/refund/payout steps.

The interface is intentionally small and synchronous to match the demo
server's sync SQLAlchemy stack.
"""

from __future__ import annotations

import abc
from dataclasses import dataclass


class PaymentError(RuntimeError):
    """Raised when a provider operation fails."""


@dataclass
class AuthResult:
    """Result of an authorization hold."""

    auth_ref: str


@dataclass
class CaptureResult:
    """Result of capturing a previously authorized hold."""

    charge_ref: str


@dataclass
class PayoutResult:
    """Result of a payout to a mentor."""

    payout_ref: str


class PaymentProvider(abc.ABC):
    """Abstract payment provider."""

    name: str = "abstract"

    @abc.abstractmethod
    def authorize(self, amount: float, currency: str, ref: str) -> AuthResult:
        """Place a hold on the mentee's funds. ``ref`` is an idempotency hint."""

    @abc.abstractmethod
    def capture(self, auth_ref: str, amount: float) -> CaptureResult:
        """Capture (settle) a previously authorized hold."""

    @abc.abstractmethod
    def void(self, auth_ref: str) -> None:
        """Release an authorization that was never captured."""

    @abc.abstractmethod
    def refund(self, charge_ref: str, amount: float) -> str:
        """Refund a captured charge (full or partial). Returns a refund ref."""

    @abc.abstractmethod
    def create_payout(self, mentor_id: int, amount: float, currency: str) -> PayoutResult:
        """Disburse ``amount`` to a mentor."""
