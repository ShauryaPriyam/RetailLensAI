import { MapPin } from "lucide-react";

const StoreHeader = ({ store, insights, id }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mb-6">
      <h1 className="text-2xl font-medium text-gray-900">
        {store?.DisplayName ?? `Store #${id}`}
      </h1>

      <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
        <MapPin size={14} />
        {store?.City}, {store?.Country}
      </div>

      <div className="flex gap-2 mt-4 flex-wrap">
        <span className="px-3 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700">
          Type {insights?.store_type ?? "—"}
        </span>

        <span className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
          {insights?.assortment ?? "—"}
        </span>

        {insights?.competition_distance != null && (
          <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
            {Number(insights.competition_distance).toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}{" "}
            m to competitor
          </span>
        )}
      </div>
    </div>
  );
};

export default StoreHeader;