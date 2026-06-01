import { useEffect, useState, type ReactNode } from 'react';
import { Loader2, DollarSign, RefreshCw, Receipt, Wallet } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import {
  billingAPI,
  type Payment,
  type Payout,
  type BillingSummary,
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
