import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Building2,
  Brain,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

import API from "../api/api"
import axios from "axios";
import MetricCard from "../components/dashboards/MetricCard";
import FactorsChart from "../components/dashboards/FactorsChart";
import StorePills from "../components/dashboards/StorePills";
import TopStoresList from "../components/dashboards/TopStoresList";
import Sidebar from "../components/Sidebar";
import Skeleton from "../components/Skeleton";
import Layout from "../layout";


const fmt = (n) => n == null ? "—" : Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
const money = (n) => n == null ? "—" : "€" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
// ─── main page 

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {

      const { data } = await API.get("dashboard");
      // console.log("API =", API);
      // console.log("Dashboard API response:", data);  
      setData(data);
      setLastUpdated(new Date());
    } catch (e) {
      setError(
        e.response?.data?.detail ||
        e.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // console.log("Dashboard data:", data);

  const overview = data?.overview ?? {};
  const factors = data?.key_sales_factors ?? [];
  const storeTypes = data?.store_types ?? {};
  const assortments = data?.assortments ?? {};
  const topStores = data?.top_performing_stores ?? [];

  return (
    <Layout
      title="Dashboard"
      subtitle="Network-wide overview across all stores"
      active="Dashboard"
    >
      <div className="flex min-h-screen bg-gray-50">
        {/* <Sidebar active="Dashboard" /> */}

        <main className="flex-1 overflow-y-auto">
          {/* status */}
          <div className="flex items-center gap-2 mb-4 text-xs text-gray-400">
            <div className={`w-1.5 h-1.5 rounded-full ${error ? "bg-red-400" : "bg-emerald-500"}`} />
            {error
              ? `Error: ${error}`
              : loading
                ? "Loading…"
                : lastUpdated
                  ? `Updated ${lastUpdated.toLocaleTimeString()}`
                  : ""}
          </div>

          {/* overview metrics */}
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">Overview</p>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))
            ) : (
              <>
                <MetricCard label="Total stores" value={fmt(overview.total_stores)} />
                <MetricCard label="Countries" value={fmt(overview.total_countries)} />
                <MetricCard label="Cities" value={fmt(overview.total_cities)} />
                <MetricCard label="Avg daily sales" value={money(overview.avg_daily_sales)} />
                <MetricCard label="Avg daily customers" value={fmt(overview.avg_daily_customers)} />
                <MetricCard label="Promo2 active" value={fmt(overview.promo2_active_stores)} />
              </>
            )}
          </div>

          {/* middle row */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* key factors */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={15} className="text-emerald-600" />
                <h2 className="text-sm font-medium text-gray-900">Key sales factors</h2>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-4" />
                  ))}
                </div>
              ) : (
                <FactorsChart factors={factors} />
              )}
            </div>

            {/* store types */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Store types &amp; assortments</h2>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                </div>
              ) : (
                <StorePills store_types={storeTypes} assortments={assortments} />
              )}
            </div>
          </div>

          {/* top stores */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-medium text-gray-900 mb-1">Top performing stores</h2>
            <p className="text-xs text-gray-400 mb-4">Ranked by average daily sales</p>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : (
              <TopStoresList stores={topStores} />
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
}