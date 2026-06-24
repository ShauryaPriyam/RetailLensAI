import StoreRow from "./StoreRow";
import StoreEmptyState from "./StoreEmptyState";

const Skeleton = ({ className = "" }) => (
  <div className={`bg-gray-100 rounded-lg animate-pulse ${className}`} />
);

const StoreTable = ({
  stores,
  loading,
  searching,
  query,
  onStoreClick,
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-x-auto">
      <table className="w-full min-w-190">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
            <th className="text-left py-3 pl-4 pr-3 font-medium">ID</th>
            <th className="text-left py-3 px-3 font-medium">Name</th>
            <th className="text-left py-3 px-3 font-medium">Location</th>
            <th className="text-left py-3 px-3 font-medium">Type</th>
            <th className="text-left py-3 px-3 font-medium">Assortment</th>
            <th className="py-3 pl-3 pr-4" />
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 6 }).map((__, j) => (
                  <td key={j} className="py-3 px-3">
                    <Skeleton className="h-4" />
                  </td>
                ))}
              </tr>
            ))
          ) : searching ? (
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 6 }).map((__, j) => (
                  <td key={j} className="py-3 px-3">
                    <Skeleton className="h-4" />
                  </td>
                ))}
              </tr>
            ))
          ) : stores.length === 0 ? (
            <StoreEmptyState query={query} />
          ) : (
            stores.map((s) => (
              <StoreRow
                key={s.Store}
                store={s}
                onClick={() => onStoreClick(s.Store)}
              />
            ))
          )}
        </tbody>
      </table>

      {!loading && stores.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400">
          {query.trim()
            ? `${stores.length} result${stores.length !== 1 ? "s" : ""} for "${query}"`
            : `${stores.length} stores`}
        </div>
      )}
    </div>
  );
};

export default StoreTable;