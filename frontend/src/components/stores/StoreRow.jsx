import { MapPin, ChevronRight } from "lucide-react";
import { TypePill, AssortmentPill } from "./StoreBadges";
import { storeType, assortmentLabel } from "../../utils/storeHelpers";

const StoreRow = ({ store, onClick }) => {
  const type = storeType(store);
  const assortment = assortmentLabel(store);

  return (
    <tr
      className="hover:bg-gray-50 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <td className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900 w-14">
        #{store.Store}
      </td>

      <td className="py-3 px-3 text-sm text-gray-800">
        {store.DisplayName ?? `Store #${store.Store}`}
      </td>

      <td className="py-3 px-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin size={11} className="shrink-0" />
          {store.City}, {store.Country}
        </span>
      </td>

      <td className="py-3 px-3">
        <TypePill type={type} />
      </td>

      <td className="py-3 px-3">
        <AssortmentPill label={assortment} />
      </td>

      <td className="py-3 pl-3 pr-4 text-right">
        <ChevronRight
          size={15}
          className="text-gray-300 group-hover:text-gray-500 transition-colors ml-auto"
        />
      </td>
    </tr>
  );
};

export default StoreRow;