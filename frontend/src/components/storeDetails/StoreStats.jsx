const StoreStats = ({ insights }) => {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <p className="text-xs text-gray-400">Store Type</p>
        <h3 className="text-xl font-medium mt-2">{insights?.store_type ?? "—"}</h3>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <p className="text-xs text-gray-400">Assortment</p>
        <h3 className="text-xl font-medium mt-2">{insights?.assortment ?? "—"}</h3>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <p className="text-xs text-gray-400">Competition Distance</p>
        <h3 className="text-xl font-medium mt-2">
          {insights?.competition_distance ?? "N/A"} m
        </h3>
      </div>
    </div>
  );
};

export default StoreStats;