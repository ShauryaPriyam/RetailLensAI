import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Brain,
  TrendingUp,
  CalendarDays,
  BarChart3,
  ChevronDown,
} from "lucide-react";

import API from "../api/api";
import Sidebar from "../components/Sidebar";
import Skeleton from "../components/Skeleton";
import MetricCard from "../components/dashboards/MetricCard";

// ─── constants ────────────────────────────────────────────────────────────────

const money = (n) =>
  n == null
    ? "—"
    : "€" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const fmt = (n) =>
  n == null
    ? "—"
    : Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const STATE_HOLIDAY_OPTIONS = [
  { value: "0", label: "None" },
  { value: "a", label: "Public holiday" },
  { value: "b", label: "Easter" },
  { value: "c", label: "Christmas" },
];

// ─── sub-components 
function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white
        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
        placeholder:text-gray-300 ${className}`}
      {...props}
    />
  );
}

function Select({ options, className = "", ...props }) {
  return (
    <div className="relative">
      <select
        className={`w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-8 ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-9 h-5 rounded-full transition-colors ${checked ? "bg-emerald-500" : "bg-gray-200"
          }`}
      >
        <span
          className={`block w-3.5 h-3.5 rounded-full bg-white shadow transition-transform mx-0.5 ${checked ? "translate-x-4" : "translate-x-0"
            }`}
        />
      </button>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}
// Mini sparkline-style bar chart for the range forecast
function ForecastChart({ data }) {
  if (!data?.length) return null;

  const max = Math.max(...data.map((d) => d.sales));
  const min = Math.min(...data.map((d) => d.sales));
  const range = max - min || 1;

  // Show at most 30 bars comfortably
  const items = data.slice(0, 60);

  return (
    <div>
      <div className="flex items-end gap-0.5 h-24">
        {items.map((d, i) => {
          const pct = ((d.sales - min) / range) * 80 + 20; // 20–100%
          return (
            <div
              key={i}
              className="flex-1 min-w-0 group relative"
              style={{ height: "100%" }}
            >
              <div
                className="w-full rounded-t transition-all duration-300 bg-emerald-400 group-hover:bg-emerald-600"
                style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
              />
              {/* tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex
                flex-col items-center z-10 pointer-events-none whitespace-nowrap">
                <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 leading-tight">
                  <p className="font-medium">{money(d.sales)}</p>
                  <p className="text-gray-400">{d.date}</p>
                </div>
                <div className="w-1.5 h-1.5 bg-gray-900 rotate-45 -mt-0.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* x-axis labels – first, middle, last */}
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-gray-400">{items[0]?.date}</span>
        <span className="text-xs text-gray-400">
          {items[Math.floor(items.length / 2)]?.date}
        </span>
        <span className="text-xs text-gray-400">{items[items.length - 1]?.date}</span>
      </div>
    </div>
  );
}

function ForecastTable({ data }) {
  return (
    <div className="overflow-auto max-h-64">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
            <th className="text-left py-2 font-medium">#</th>
            <th className="text-left py-2 font-medium">Date</th>
            <th className="text-right py-2 font-medium">Predicted sales</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((row, i) => (
            <tr key={row.date} className="hover:bg-gray-50 transition-colors">
              <td className="py-2.5 text-gray-300 text-xs w-6">{i + 1}</td>
              <td className="py-2.5 text-gray-700">{row.date}</td>
              <td className="py-2.5 text-right font-medium text-emerald-700">
                {money(row.sales)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function Forecast() {
  // ── single-day form
  const [singleForm, setSingleForm] = useState({
    store: "",
    date: new Date().toISOString().split("T")[0],
    promo: false,
    school_holiday: false,
    state_holiday: "0",
    customers: 0,
    open: true,
  });
  const [singleResult, setSingleResult] = useState(null);
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleError, setSingleError] = useState(null);

  // ── range form
  const [rangeForm, setRangeForm] = useState({
    store: "",
    start_date: new Date().toISOString().split("T")[0],
    days: 14,
    promo: false,
    school_holiday: false,
    state_holiday: "0",
    customers: 0,
    open: true,
  });
  const [rangeResult, setRangeResult] = useState(null);
  const [rangeLoading, setRangeLoading] = useState(false);
  const [rangeError, setRangeError] = useState(null);

  // ── which tab
  const [tab, setTab] = useState("single"); // "single" | "range"

  // ── single forecast
  const runSingle = async () => {
    setSingleLoading(true);
    setSingleError(null);
    setSingleResult(null);
    try {
      const payload = {
        ...singleForm,
        store: Number(singleForm.store),
        promo: singleForm.promo ? 1 : 0,
        school_holiday: singleForm.school_holiday ? 1 : 0,
        open: singleForm.open ? 1 : 0,
        customers: Number(singleForm.customers) || 0,
      };
      const { data } = await API.post("forecast", payload);
      setSingleResult(data);
    } catch (e) {
      setSingleError(e.response?.data?.detail || e.message);
    } finally {
      setSingleLoading(false);
    }
  };

  // ── range forecast
  const runRange = async () => {
    setRangeLoading(true);
    setRangeError(null);
    setRangeResult(null);
    try {
      const payload = {
        ...rangeForm,
        store: Number(rangeForm.store),
        days: Number(rangeForm.days),
        promo: rangeForm.promo ? 1 : 0,
        school_holiday: rangeForm.school_holiday ? 1 : 0,
        open: rangeForm.open ? 1 : 0,
        customers: Number(rangeForm.customers) || 0,
      };
      const { data } = await API.post("forecast/range", payload);
      setRangeResult(data);
    } catch (e) {
      setRangeError(e.response?.data?.detail || e.message);
    } finally {
      setRangeLoading(false);
    }
  };

  // ── shared field updater
  const sf = (key) => (val) => setSingleForm((p) => ({ ...p, [key]: val }));
  const rf = (key) => (val) => setRangeForm((p) => ({ ...p, [key]: val }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="Forecast" />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* header */}
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-gray-900">Forecast</h1>
          <p className="text-sm text-gray-400 mt-1">
            Predict sales for any store on a single day or across a date range
          </p>
        </div>

        {/* tabs */}
        <div className="flex gap-1 mb-6 bg-white border border-gray-100 rounded-xl p-1 w-fit shadow-sm">
          {[
            { id: "single", label: "Single day", icon: CalendarDays },
            { id: "range", label: "Date range", icon: BarChart3 },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors ${tab === id
                  ? "bg-emerald-50 text-emerald-800 font-medium"
                  : "text-gray-500 hover:text-gray-800"
                }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* ── SINGLE DAY ── */}
        {tab === "single" && (
          <div className="grid grid-cols-3 gap-4 items-start">
            {/* form */}
            <div className="col-span-1 bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-medium text-gray-900">Parameters</h2>

              <FormField label="Store ID">
                <Input
                  type="number"
                  placeholder="e.g. 42"
                  value={singleForm.store}
                  onChange={(e) => sf("store")(e.target.value)}
                />
              </FormField>

              <FormField label="Date">
                <Input
                  type="date"
                  value={singleForm.date}
                  onChange={(e) => sf("date")(e.target.value)}
                />
              </FormField>

              <FormField label="Customers">
                <Input
                  type="number"
                  min={0}
                  placeholder="e.g. 500"
                  value={singleForm.customers}
                  onChange={(e) => sf("customers")(e.target.value)}
                />
              </FormField>

              <FormField label="State holiday">
                <Select
                  options={STATE_HOLIDAY_OPTIONS}
                  value={singleForm.state_holiday}
                  onChange={(e) => sf("state_holiday")(e.target.value)}
                />
              </FormField>

              <div className="space-y-3 pt-1">
                <Toggle
                  label="Promotion active"
                  checked={singleForm.promo}
                  onChange={sf("promo")}
                />
                <Toggle
                  label="School holiday"
                  checked={singleForm.school_holiday}
                  onChange={sf("school_holiday")}
                />
                <Toggle
                  label="Store open"
                  checked={singleForm.open}
                  onChange={sf("open")}
                />
              </div>

              <button
                onClick={runSingle}
                disabled={singleLoading || !singleForm.store}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700
                  text-white text-sm font-medium rounded-lg py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {singleLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Predicting…
                  </>
                ) : (
                  <>
                    <TrendingUp size={14} />
                    Run forecast
                  </>
                )}
              </button>

              {singleError && (
                <p className="text-xs text-red-500 mt-1">{singleError}</p>
              )}
            </div>

            {/* result */}
            <div className="col-span-2 space-y-4">
              {singleLoading && (
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              )}

              {singleResult && !singleLoading && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <MetricCard
                      label="Predicted sales"
                      value={money(singleResult.prediction)}
                      sub={`Store #${singleResult.store}`}
                    />
                    <MetricCard
                      label="Date"
                      value={singleForm.date}
                      sub="Forecast target"
                    />
                  </div>

                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                    <h2 className="text-sm font-medium text-gray-900 mb-1">
                      Forecast summary
                    </h2>
                    <p className="text-xs text-gray-400 mb-4">
                      Based on provided store conditions
                    </p>

                    <div className="grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
                      {[
                        ["Store", `#${singleResult.store}`],
                        ["Date", singleForm.date],
                        ["Promotion", singleForm.promo ? "Active" : "None"],
                        ["School holiday", singleForm.school_holiday ? "Yes" : "No"],
                        [
                          "State holiday",
                          STATE_HOLIDAY_OPTIONS.find(
                            (o) => o.value === singleForm.state_holiday
                          )?.label ?? "—",
                        ],
                        [
                          "Customers",
                          singleForm.customers ? fmt(singleForm.customers) : "Not set",
                        ],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <p className="text-xs text-gray-400">{k}</p>
                          <p className="font-medium text-gray-800 mt-0.5">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {!singleResult && !singleLoading && (
                <div className="bg-white border border-gray-100 rounded-xl p-10 shadow-sm flex flex-col items-center justify-center text-center">
                  <TrendingUp size={32} className="text-gray-200 mb-3" />
                  <p className="text-sm font-medium text-gray-400">No forecast yet</p>
                  <p className="text-xs text-gray-300 mt-1">
                    Fill in the parameters and run a forecast to see results here
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── DATE RANGE ── */}
        {tab === "range" && (
          <div className="grid grid-cols-3 gap-4 items-start">
            {/* form */}
            <div className="col-span-1 bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-medium text-gray-900">Parameters</h2>

              <FormField label="Store ID">
                <Input
                  type="number"
                  placeholder="e.g. 42"
                  value={rangeForm.store}
                  onChange={(e) => rf("store")(e.target.value)}
                />
              </FormField>

              <FormField label="Start date">
                <Input
                  type="date"
                  value={rangeForm.start_date}
                  onChange={(e) => rf("start_date")(e.target.value)}
                />
              </FormField>

              <FormField label="Days">
                <Input
                  type="number"
                  min={1}
                  max={365}
                  placeholder="14"
                  value={rangeForm.days}
                  onChange={(e) => rf("days")(e.target.value)}
                />
              </FormField>

              <FormField label="Customers">
                <Input
                  type="number"
                  min={0}
                  placeholder="e.g. 500"
                  value={rangeForm.customers}
                  onChange={(e) => rf("customers")(e.target.value)}
                />
              </FormField>

              <FormField label="State holiday">
                <Select
                  options={STATE_HOLIDAY_OPTIONS}
                  value={rangeForm.state_holiday}
                  onChange={(e) => rf("state_holiday")(e.target.value)}
                />
              </FormField>

              <div className="space-y-3 pt-1">
                <Toggle
                  label="Promotion active"
                  checked={rangeForm.promo}
                  onChange={rf("promo")}
                />
                <Toggle
                  label="School holiday"
                  checked={rangeForm.school_holiday}
                  onChange={rf("school_holiday")}
                />
                <Toggle
                  label="Store open"
                  checked={rangeForm.open}
                  onChange={rf("open")}
                />
              </div>

              <button
                onClick={runRange}
                disabled={rangeLoading || !rangeForm.store}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700
                  text-white text-sm font-medium rounded-lg py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {rangeLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Predicting…
                  </>
                ) : (
                  <>
                    <BarChart3 size={14} />
                    Run forecast
                  </>
                )}
              </button>

              {rangeError && (
                <p className="text-xs text-red-500 mt-1">{rangeError}</p>
              )}
            </div>

            {/* results */}
            <div className="col-span-2 space-y-4">
              {rangeLoading && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-20" />
                    ))}
                  </div>
                  <Skeleton className="h-48" />
                </div>
              )}

              {rangeResult && !rangeLoading && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <MetricCard
                      label="Total sales"
                      value={money(rangeResult.total_sales)}
                      sub={`Over ${rangeResult.days} days`}
                    />
                    <MetricCard
                      label="Avg daily sales"
                      value={money(rangeResult.average_sales)}
                      sub="Per day"
                    />
                    <MetricCard
                      label="Days forecast"
                      value={fmt(rangeResult.days)}
                      sub={`Store #${rangeResult.store}`}
                    />
                  </div>

                  {/* chart */}
                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                    <h2 className="text-sm font-medium text-gray-900 mb-1">
                      Sales over time
                    </h2>
                    <p className="text-xs text-gray-400 mb-4">
                      Hover bars to see individual day forecasts
                    </p>
                    <ForecastChart data={rangeResult.forecast} />
                  </div>

                  {/* table */}
                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                    <h2 className="text-sm font-medium text-gray-900 mb-1">
                      Daily breakdown
                    </h2>
                    <p className="text-xs text-gray-400 mb-4">
                      Scroll to see all {rangeResult.days} days
                    </p>
                    <ForecastTable data={rangeResult.forecast} />
                  </div>
                </>
              )}

              {!rangeResult && !rangeLoading && (
                <div className="bg-white border border-gray-100 rounded-xl p-10 shadow-sm flex flex-col items-center justify-center text-center">
                  <BarChart3 size={32} className="text-gray-200 mb-3" />
                  <p className="text-sm font-medium text-gray-400">No forecast yet</p>
                  <p className="text-xs text-gray-300 mt-1">
                    Set your date range and run a forecast to see results here
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}