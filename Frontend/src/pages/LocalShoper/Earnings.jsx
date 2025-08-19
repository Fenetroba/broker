import React, { useMemo, useState } from "react";

// Mock data (replace with real API later)
const mockTransactions = [
  { id: "TXN-1001", date: "2025-08-01", product: "Eco Bag", amount: 29.99, status: "completed", method: "Card" },
  { id: "TXN-1002", date: "2025-08-02", product: "Organic Soap", amount: 12.5, status: "completed", method: "PayPal" },
  { id: "TXN-1003", date: "2025-08-02", product: "Eco Bag", amount: 29.99, status: "refunded", method: "Card" },
  { id: "TXN-1004", date: "2025-08-05", product: "Bamboo Brush", amount: 8.0, status: "completed", method: "Card" },
  { id: "TXN-1005", date: "2025-08-07", product: "Eco Bag", amount: 29.99, status: "pending", method: "Wallet" },
  { id: "TXN-1006", date: "2025-08-10", product: "Reusable Bottle", amount: 18.75, status: "completed", method: "Card" },
];

const mockWithdrawals = [
  { id: "WD-4001", date: "2025-07-28", amount: 120.0, method: "Bank", status: "completed" },
  { id: "WD-4002", date: "2025-08-05", amount: 75.0, method: "PayPal", status: "completed" },
  { id: "WD-4003", date: "2025-08-15", amount: 90.0, method: "Bank", status: "pending" },
];

const currency = (n) => n.toLocaleString(undefined, { style: "currency", currency: "USD" });

const Badge = ({ children, tone = "gray" }) => (
  <span
    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
      tone === "green"
        ? "bg-green-100 text-green-800"
        : tone === "yellow"
        ? "bg-yellow-100 text-yellow-800"
        : tone === "red"
        ? "bg-red-100 text-red-800"
        : "bg-gray-100 text-gray-800"
    }`}
  >
    {children}
  </span>
);

const Section = ({ title, children, right }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {right}
    </div>
    {children}
  </div>
);

const SimpleBar = ({ value, max, label }) => {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-600">
        <span>{label}</span>
        <span>{currency(value)}</span>
      </div>
      <div className="h-2 w-full rounded bg-gray-100">
        <div className="h-full rounded bg-[var(--two3m)]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const downloadCSV = (rows, filename) => {
  if (!rows || rows.length === 0) return;
  const header = Object.keys(rows[0]);
  const csv = [header.join(","), ...rows.map((r) => header.map((h) => `${r[h]}`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const Earnings = () => {
  const [range, setRange] = useState({ from: "2025-08-01", to: "2025-08-31" });
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("monthly"); // daily | weekly | monthly | yearly

  const filteredTransactions = useMemo(() => {
    const from = range.from ? new Date(range.from) : null;
    const to = range.to ? new Date(range.to) : null;
    return mockTransactions.filter((t) => {
      const d = new Date(t.date);
      const inRange = (!from || d >= from) && (!to || d <= to);
      const matches = !search || t.product.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search);
      return inRange && matches;
    });
  }, [range, search]);

  const totals = useMemo(() => {
    const lifetime = mockTransactions.filter((t) => t.status !== "refunded").reduce((s, t) => s + t.amount, 0);
    const pending = mockTransactions.filter((t) => t.status === "pending").reduce((s, t) => s + t.amount, 0);
    const withdrawn = mockWithdrawals.filter((w) => w.status === "completed").reduce((s, w) => s + w.amount, 0);
    const balance = Math.max(0, lifetime - withdrawn);
    return { lifetime, pending, withdrawn, balance };
  }, []);

  const byProduct = useMemo(() => {
    const map = new Map();
    filteredTransactions.forEach((t) => {
      if (t.status === "refunded") return;
      map.set(t.product, (map.get(t.product) || 0) + t.amount);
    });
    return [...map.entries()].map(([product, total]) => ({ product, total })).sort((a, b) => b.total - a.total);
  }, [filteredTransactions]);

  const byDay = useMemo(() => {
    const map = new Map();
    filteredTransactions.forEach((t) => {
      if (t.status === "refunded") return;
      map.set(t.date, (map.get(t.date) || 0) + t.amount);
    });
    return [...map.entries()].map(([date, total]) => ({ date, total })).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredTransactions]);

  const periodSeries = useMemo(() => {
    if (period === "daily") return byDay.map((d) => ({ label: d.date, total: d.total }));
    if (period === "weekly") {
      const map = new Map();
      filteredTransactions.forEach((t) => {
        if (t.status === "refunded") return;
        const d = new Date(t.date);
        const first = new Date(d.getFullYear(), 0, 1);
        const week = Math.ceil(((d - first) / 86400000 + first.getDay() + 1) / 7);
        const key = `${d.getFullYear()}-W${week}`;
        map.set(key, (map.get(key) || 0) + t.amount);
      });
      return [...map.entries()].map(([label, total]) => ({ label, total }));
    }
    if (period === "monthly") {
      const map = new Map();
      filteredTransactions.forEach((t) => {
        if (t.status === "refunded") return;
        const d = new Date(t.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        map.set(key, (map.get(key) || 0) + t.amount);
      });
      return [...map.entries()].map(([label, total]) => ({ label, total }));
    }
    if (period === "yearly") {
      const map = new Map();
      filteredTransactions.forEach((t) => {
        if (t.status === "refunded") return;
        const d = new Date(t.date);
        const key = `${d.getFullYear()}`;
        map.set(key, (map.get(key) || 0) + t.amount);
      });
      return [...map.entries()].map(([label, total]) => ({ label, total }));
    }
    return [];
  }, [filteredTransactions, period, byDay]);

  const maxSeries = Math.max(1, ...periodSeries.map((p) => p.total));

  return (
    <div className="mx-auto max-w-6xl p-4">
      {/* Summary */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Lifetime Earnings</div>
          <div className="mt-1 text-2xl font-semibold">{currency(totals.lifetime)}</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Current Balance</div>
          <div className="mt-1 text-2xl font-semibold">{currency(totals.balance)}</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Pending Earnings</div>
          <div className="mt-1 text-2xl font-semibold">{currency(totals.pending)}</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Withdrawn</div>
          <div className="mt-1 text-2xl font-semibold">{currency(totals.withdrawn)}</div>
        </div>
      </div>

      {/* Filters */}
      <Section
        title="Filters & Search"
        right={
          <button
            onClick={() => downloadCSV(filteredTransactions, "transactions.csv")}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Export CSV
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          <label className="text-sm">
            <div className="mb-1 text-gray-700">From</div>
            <input
              type="date"
              value={range.from}
              onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
            />
          </label>
          <label className="text-sm">
            <div className="mb-1 text-gray-700">To</div>
            <input
              type="date"
              value={range.to}
              onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <div className="mb-1 text-gray-700">Search (Product or Transaction ID)</div>
            <input
              type="text"
              placeholder="e.g. Eco Bag or TXN-1001"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
            />
          </label>
          <label className="text-sm">
            <div className="mb-1 text-gray-700">Period</div>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </label>
        </div>
      </Section>

      {/* Charts & Breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Section title={`Earnings (${period})`}>
          <div className="space-y-2">
            {periodSeries.length === 0 && (
              <div className="text-sm text-gray-500">No data</div>
            )}
            {periodSeries.map((p) => (
              <SimpleBar key={p.label} value={p.total} max={maxSeries} label={p.label} />
            ))}
          </div>
        </Section>

        <Section title="Earnings per Product" right={<div className="text-sm text-gray-500">Top {byProduct.length}</div>}>
          <div className="space-y-2">
            {byProduct.length === 0 && <div className="text-sm text-gray-500">No data</div>}
            {byProduct.map((p) => (
              <SimpleBar key={p.product} value={p.total} max={byProduct[0]?.total || 1} label={p.product} />
            ))}
          </div>
        </Section>

        <Section title="Withdrawals / Payouts" right={<div className="text-sm text-gray-500">History</div>}>
          <div className="max-h-64 overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 bg-gray-50 text-xs text-gray-600">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Method</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockWithdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-mono text-xs text-gray-700">{w.id}</td>
                    <td className="px-3 py-2">{w.date}</td>
                    <td className="px-3 py-2">{currency(w.amount)}</td>
                    <td className="px-3 py-2">{w.method}</td>
                    <td className="px-3 py-2">
                      <Badge tone={w.status === "completed" ? "green" : w.status === "pending" ? "yellow" : "gray"}>{w.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      {/* Recent Transactions */}
      <Section
        title="Recent Transactions"
        right={
          <button
            onClick={() => downloadCSV(filteredTransactions, "transactions.csv")}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Export CSV
          </button>
        }
      >
        <div className="max-h-80 overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-gray-50 text-xs text-gray-600">
              <tr>
                <th className="px-3 py-2">Txn ID</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Method</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-mono text-xs text-gray-700">{t.id}</td>
                  <td className="px-3 py-2">{t.date}</td>
                  <td className="px-3 py-2">{t.product}</td>
                  <td className="px-3 py-2">{currency(t.amount)}</td>
                  <td className="px-3 py-2">{t.method}</td>
                  <td className="px-3 py-2">
                    <Badge
                      tone={t.status === "completed" ? "green" : t.status === "pending" ? "yellow" : t.status === "refunded" ? "red" : "gray"}
                    >
                      {t.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Payment Methods (optional placeholder) */}
      <Section
        title="Payment Methods"
        right={<button className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">Manage</button>}
      >
        <div className="text-sm text-gray-600">Linked: Bank • PayPal • Wallet</div>
      </Section>
    </div>
  );
};

export default Earnings;