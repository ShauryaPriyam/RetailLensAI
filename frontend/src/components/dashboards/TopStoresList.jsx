const fmt = (n) => n == null ? "—" : Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
const money = (n) => n == null ? "—" : "€" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const TopStoresList = ({ stores }) => {
  return (
     <div className="divide-y divide-gray-50">
      {stores.map((s, i) => (
        <div key={s.store} className="flex items-center gap-3 py-3">
          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-medium flex items-center justify-center shrink-0">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {s.display_name ?? `Store #${s.store}`}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {s.city}, {s.country}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-medium text-emerald-700">
              {money(s.avg_daily_sales)}
            </p>
            <p className="text-xs text-gray-400">per day</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopStoresList;