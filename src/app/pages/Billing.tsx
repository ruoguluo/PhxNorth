import { useEffect, useState, type ReactNode, type FormEvent } from 'react';
import { Loader2, DollarSign, RefreshCw, Receipt, Wallet, CreditCard, CheckCircle, AlertTriangle, ExternalLink, Trash2 } from 'lucide-react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../../lib/auth-context';
import {
  billingAPI,
  stripeAPI,
  walletAPI,
  type Payment,
  type Payout,
  type BillingSummary,
  type StripePaymentMethod,
  type StripeConnectStatus,
  type WalletInfo,
  type WalletTransactionInfo,
} from '../../lib/api';

function money(value: number | undefined, currency = 'USD'): string {
  if (value === undefined || value === null) return '—';
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

const STATUS_STYLES: Record<string, string> = {
  authorized: 'bg-amber-100 text-amber-800',
  captured: 'bg-emerald-100 text-emerald-800',
  paid: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-amber-100 text-amber-800',
  refunded: 'bg-gray-200 text-gray-700',
  voided: 'bg-gray-200 text-gray-700',
  failed: 'bg-red-100 text-red-800',
};

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className="bg-[#0A2463]/10 text-[#0A2463] w-11 h-11 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#ef4444' },
  },
};

function CardForm({
  clientSecret,
  onSuccess,
}: {
  clientSecret: string;
  onSuccess: (pm: StripePaymentMethod) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setCardError(null);
    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');
      const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement },
      });
      if (error) throw new Error(error.message);
      if (!setupIntent?.payment_method) throw new Error('No payment method returned');
      const pmId =
        typeof setupIntent.payment_method === 'string'
          ? setupIntent.payment_method
          : setupIntent.payment_method.id;
      const saved = await stripeAPI.savePaymentMethod(pmId);
      onSuccess(saved);
    } catch (err) {
      setCardError(err instanceof Error ? err.message : 'Card setup failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-gray-300 rounded-lg p-3 bg-white">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      {cardError && <p className="text-sm text-red-600">{cardError}</p>}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="inline-flex items-center gap-2 bg-[#0A2463] text-white px-4 py-2 rounded-lg hover:bg-[#0A2463]/90 disabled:opacity-50 text-sm"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
        Save Card
      </button>
    </form>
  );
}

export function Billing() {
  const { user } = useAuth();
  const role = user?.role || 'mentee';

  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runningPayout, setRunningPayout] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Stripe Connect (mentor)
  const [connectStatus, setConnectStatus] = useState<StripeConnectStatus | null>(null);

  // Card management (mentee)
  const [cardInfo, setCardInfo] = useState<StripePaymentMethod | null>(null);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [setupSecret, setSetupSecret] = useState<string | null>(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [removingCard, setRemovingCard] = useState(false);

  // Wallet (mentee)
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [walletTxns, setWalletTxns] = useState<WalletTransactionInfo[]>([]);
  const [topUpAmount, setTopUpAmount] = useState<number>(10);
  const [toppingUp, setToppingUp] = useState(false);
  const [savingReload, setSavingReload] = useState(false);
  const [reloadEnabled, setReloadEnabled] = useState(false);
  const [reloadThreshold, setReloadThreshold] = useState(5);
  const [reloadAmount, setReloadAmount] = useState(20);

  const currency = summary?.currency || 'USD';

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [sum, pays] = await Promise.all([
        billingAPI.summary(),
        billingAPI.listPayments(),
      ]);
      setSummary(sum);
      setPayments(pays);
      if (role === 'mentor' || role === 'admin') {
        try {
          setPayouts(await billingAPI.listPayouts());
        } catch {
          setPayouts([]);
        }
      }
      if (role === 'mentee') {
        try {
          const w = await walletAPI.get();
          setWallet(w);
          setReloadEnabled(w.auto_reload_enabled);
          setReloadThreshold(w.auto_reload_threshold);
          setReloadAmount(w.auto_reload_amount);
          const txns = await walletAPI.transactions();
          setWalletTxns(txns);
        } catch { /* wallet may not exist yet */ }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load billing data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load Stripe Connect status for mentors
  useEffect(() => {
    if (role === 'mentor') {
      stripeAPI.getStatus().then(setConnectStatus).catch(() => {});
    }
  }, [role]);

  // Load card info for mentees
  useEffect(() => {
    if (role === 'mentee') {
      stripeAPI.getPaymentMethod().then(setCardInfo).catch(() => {});
    }
  }, [role]);

  async function handleInitCardForm() {
    setShowCardForm(true);
    if (!stripePromise) {
      const promise = stripeAPI.getPublishableKey().then((r) => loadStripe(r.publishable_key));
      setStripePromise(promise);
    }
    if (!setupSecret) {
      try {
        const intent = await stripeAPI.createSetupIntent();
        setSetupSecret(intent.client_secret);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create setup intent');
      }
    }
  }

  function handleCardSaved(pm: StripePaymentMethod) {
    setCardInfo(pm);
    setShowCardForm(false);
    setSetupSecret(null);
    setNotice('Card saved successfully.');
  }

  async function handleRemoveCard() {
    setRemovingCard(true);
    try {
      await stripeAPI.removePaymentMethod();
      setCardInfo({ has_card: false });
      setNotice('Card removed.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove card');
    } finally {
      setRemovingCard(false);
    }
  }

  async function handleConnectStripe() {
    try {
      const result = await stripeAPI.connect();
      window.location.href = result.onboarding_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start Stripe onboarding');
    }
  }

  async function handleViewDashboard() {
    try {
      const result = await stripeAPI.getDashboardLink();
      window.open(result.url, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open Stripe dashboard');
    }
  }

  async function handleRunPayouts() {
    setRunningPayout(true);
    setNotice(null);
    try {
      const result = await billingAPI.runPayouts();
      setNotice(
        `Created ${result.payouts_created} payout(s), disbursed ${money(result.total_disbursed, currency)}.`
      );
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payout run failed');
    } finally {
      setRunningPayout(false);
    }
  }

  async function handleTopUp() {
    setToppingUp(true);
    try {
      await walletAPI.topUp(topUpAmount);
      const w = await walletAPI.get();
      setWallet(w);
      const txns = await walletAPI.transactions();
      setWalletTxns(txns);
      setNotice(`Added $${topUpAmount.toFixed(2)} to your wallet.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Top-up failed');
    } finally {
      setToppingUp(false);
    }
  }

  async function handleSaveAutoReload() {
    setSavingReload(true);
    try {
      const w = await walletAPI.updateAutoReload({
        enabled: reloadEnabled,
        threshold: reloadThreshold,
        amount: reloadAmount,
      });
      setWallet(w);
      setNotice('Auto-reload settings saved.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save settings');
    } finally {
      setSavingReload(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-600">
            {role === 'admin'
              ? 'Platform revenue, fees, and mentor payouts'
              : role === 'mentor'
                ? 'Your earnings and payouts'
                : 'Your payments and charges'}
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
      )}
      {notice && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm">{notice}</div>
      )}

      {/* Stripe Connect (mentor) */}
      {role === 'mentor' && (
        <div className="mb-8">
          {!connectStatus?.connected && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-700 w-10 h-10 rounded-lg flex items-center justify-center">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Stripe Connect</p>
                  <p className="text-sm text-blue-700">Connect your Stripe account to receive payouts</p>
                </div>
              </div>
              <button
                onClick={handleConnectStripe}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Connect Stripe
              </button>
            </div>
          )}
          {connectStatus?.connected && connectStatus.status === 'active' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 text-emerald-700 w-10 h-10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">Stripe Connected</p>
                  <p className="text-sm text-emerald-700">Your account is active and ready to receive payouts</p>
                </div>
              </div>
              <button
                onClick={handleViewDashboard}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" /> View Dashboard
              </button>
            </div>
          )}
          {connectStatus?.connected && !connectStatus.payouts_enabled && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 text-amber-700 w-10 h-10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-amber-900">Setup Incomplete</p>
                  <p className="text-sm text-amber-700">Complete your Stripe setup to receive payouts</p>
                </div>
              </div>
              <button
                onClick={handleConnectStripe}
                className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 text-sm font-medium"
              >
                Continue Setup
              </button>
            </div>
          )}
        </div>
      )}

      {/* Wallet (mentee) */}
      {role === 'mentee' && wallet && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Wallet</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Balance + Top-up row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
              {/* Balance */}
              <div className="flex items-center gap-4">
                <div className="bg-emerald-100 text-emerald-700 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">${wallet.balance.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Available credit</p>
                </div>
              </div>

              {/* Top-up controls */}
              <div className="flex flex-wrap items-center gap-2">
                {[5, 10, 20].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTopUpAmount(amt)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      topUpAmount === amt
                        ? 'bg-[#0A2463] text-white border-[#0A2463]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#0A2463] hover:text-[#0A2463]'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(Math.max(1, Number(e.target.value)))}
                    className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2463]/30 focus:border-[#0A2463]"
                  />
                </div>
                <button
                  onClick={handleTopUp}
                  disabled={toppingUp}
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-1.5 rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm font-medium"
                >
                  {toppingUp ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
                  Top Up
                </button>
              </div>
            </div>

            {/* Auto-reload settings */}
            <div className="border-t border-gray-200 pt-5 mb-6">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="auto-reload-toggle"
                  checked={reloadEnabled}
                  onChange={(e) => setReloadEnabled(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#0A2463] focus:ring-[#0A2463]"
                />
                <div className="flex-1">
                  <label htmlFor="auto-reload-toggle" className="font-medium text-gray-900 text-sm cursor-pointer">
                    Auto-reload
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Automatically add funds when your balance drops below a threshold.
                  </p>

                  {reloadEnabled && (
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 whitespace-nowrap">When below $</label>
                        <input
                          type="number"
                          min={1}
                          step={1}
                          value={reloadThreshold}
                          onChange={(e) => setReloadThreshold(Math.max(1, Number(e.target.value)))}
                          className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2463]/30 focus:border-[#0A2463]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 whitespace-nowrap">Add $</label>
                        <input
                          type="number"
                          min={1}
                          step={1}
                          value={reloadAmount}
                          onChange={(e) => setReloadAmount(Math.max(1, Number(e.target.value)))}
                          className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2463]/30 focus:border-[#0A2463]"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSaveAutoReload}
                  disabled={savingReload}
                  className="inline-flex items-center gap-2 bg-[#0A2463] text-white px-3 py-1.5 rounded-lg hover:bg-[#0A2463]/90 disabled:opacity-50 text-sm font-medium"
                >
                  {savingReload ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Save
                </button>
              </div>
            </div>

            {/* Transaction history */}
            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Transactions</h3>
              {walletTxns.length === 0 ? (
                <p className="text-sm text-gray-500">No transactions yet.</p>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {walletTxns.map((txn) => (
                    <div
                      key={txn.id}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 text-sm"
                    >
                      <div>
                        <p className="text-gray-800">{txn.description || txn.type}</p>
                        {txn.created_at && (
                          <p className="text-xs text-gray-400">
                            {new Date(txn.created_at).toLocaleDateString()}{' '}
                            {new Date(txn.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                      <span
                        className={`font-medium ${txn.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                      >
                        {txn.amount >= 0 ? '+' : ''}${txn.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {role === 'mentee' && (
          <>
            <SummaryCard label="Total spent" value={money(summary?.total_spent, currency)} icon={<DollarSign className="w-5 h-5" />} />
            <SummaryCard label="Sessions paid" value={String(summary?.captured_count ?? 0)} icon={<Receipt className="w-5 h-5" />} />
          </>
        )}
        {role === 'mentor' && (
          <>
            <SummaryCard label="Total earnings" value={money(summary?.total_earnings, currency)} icon={<DollarSign className="w-5 h-5" />} />
            <SummaryCard label="Pending payout" value={money(summary?.pending_payout, currency)} icon={<Wallet className="w-5 h-5" />} />
            <SummaryCard label="Paid out" value={money(summary?.paid_out, currency)} icon={<Receipt className="w-5 h-5" />} />
          </>
        )}
        {role === 'admin' && (
          <>
            <SummaryCard label="GMV" value={money(summary?.gmv, currency)} icon={<DollarSign className="w-5 h-5" />} />
            <SummaryCard label="Fees collected" value={money(summary?.fees_collected, currency)} icon={<Wallet className="w-5 h-5" />} />
            <SummaryCard
              label={`Mentor earnings${summary?.platform_fee_pct !== undefined ? ` (fee ${(summary.platform_fee_pct * 100).toFixed(0)}%)` : ''}`}
              value={money(summary?.mentor_earnings, currency)}
              icon={<Receipt className="w-5 h-5" />}
            />
          </>
        )}
      </div>

      {role === 'admin' && (
        <div className="mb-8">
          <button
            onClick={handleRunPayouts}
            disabled={runningPayout}
            className="inline-flex items-center gap-2 bg-[#0A2463] text-white px-4 py-2 rounded-lg hover:bg-[#0A2463]/90 disabled:opacity-50"
          >
            {runningPayout ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
            Run mentor payouts now
          </button>
          <p className="text-xs text-gray-500 mt-1">
            Payouts also run automatically on a daily schedule.
          </p>
        </div>
      )}

      {/* Payment Method (mentee) */}
      {role === 'mentee' && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Payment Method</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            {cardInfo?.has_card ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 text-gray-700 w-10 h-10 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {cardInfo.brand ?? 'Card'} ending in {cardInfo.last4 ?? '••••'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Expires {String(cardInfo.exp_month ?? '--').padStart(2, '0')}/{String(cardInfo.exp_year ?? '--').slice(-2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleInitCardForm}
                    className="inline-flex items-center gap-1.5 text-sm text-[#0A2463] hover:text-[#0A2463]/80 font-medium"
                  >
                    <CreditCard className="w-4 h-4" /> Change Card
                  </button>
                  <button
                    onClick={handleRemoveCard}
                    disabled={removingCard}
                    className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    {removingCard ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 text-sm mb-3">No payment method on file. Add a card to pay for sessions.</p>
                {!showCardForm && (
                  <button
                    onClick={handleInitCardForm}
                    className="inline-flex items-center gap-2 bg-[#0A2463] text-white px-4 py-2 rounded-lg hover:bg-[#0A2463]/90 text-sm font-medium"
                  >
                    <CreditCard className="w-4 h-4" /> Add Payment Method
                  </button>
                )}
              </div>
            )}

            {showCardForm && stripePromise && setupSecret && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  {cardInfo?.has_card ? 'Enter new card details' : 'Enter your card details'}
                </p>
                <Elements stripe={stripePromise}>
                  <CardForm clientSecret={setupSecret} onSuccess={handleCardSaved} />
                </Elements>
              </div>
            )}

            {showCardForm && (!stripePromise || !setupSecret) && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading payment form…
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payments table */}
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        {role === 'mentor' ? 'Earning history' : 'Payment history'}
      </h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        {payments.length === 0 ? (
          <p className="p-6 text-gray-500 text-sm">No payments yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">#</th>
                <th className="px-4 py-2 font-medium">Session</th>
                <th className="px-4 py-2 font-medium">Amount</th>
                {role !== 'mentee' && <th className="px-4 py-2 font-medium">Earnings</th>}
                {role === 'admin' && <th className="px-4 py-2 font-medium">Fee</th>}
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="px-4 py-2 text-gray-700">{p.id}</td>
                  <td className="px-4 py-2 text-gray-700">{p.session_id ?? '—'}</td>
                  <td className="px-4 py-2 text-gray-900 font-medium">{money(p.amount, p.currency)}</td>
                  {role !== 'mentee' && (
                    <td className="px-4 py-2 text-gray-700">{money(p.mentor_earnings, p.currency)}</td>
                  )}
                  {role === 'admin' && (
                    <td className="px-4 py-2 text-gray-700">{money(p.platform_fee, p.currency)}</td>
                  )}
                  <td className="px-4 py-2"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-2 text-gray-500">
                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Payouts table (mentor + admin) */}
      {(role === 'mentor' || role === 'admin') && (
        <>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Payouts</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {payouts.length === 0 ? (
              <p className="p-6 text-gray-500 text-sm">No payouts yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                  <tr>
                    <th className="px-4 py-2 font-medium">#</th>
                    {role === 'admin' && <th className="px-4 py-2 font-medium">Mentor</th>}
                    <th className="px-4 py-2 font-medium">Amount</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((po) => (
                    <tr key={po.id} className="border-t border-gray-100">
                      <td className="px-4 py-2 text-gray-700">{po.id}</td>
                      {role === 'admin' && <td className="px-4 py-2 text-gray-700">{po.mentor_id}</td>}
                      <td className="px-4 py-2 text-gray-900 font-medium">{money(po.amount, po.currency)}</td>
                      <td className="px-4 py-2"><StatusBadge status={po.status} /></td>
                      <td className="px-4 py-2 text-gray-500">
                        {po.created_at ? new Date(po.created_at).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
