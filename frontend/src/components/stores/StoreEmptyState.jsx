import { Building2 } from "lucide-react";

const StoreEmptyState = ({ query }) => {
  return (
    <tr>
      <td colSpan={6} className="py-14 text-center">
        <Building2 size={28} className="mx-auto text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">
          {query ? `No stores matching "${query}"` : "No stores found"}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Try another search term
        </p>
      </td>
    </tr>
  );
};

export default StoreEmptyState;