import { Lightbulb } from "lucide-react";

const StoreInsights = ({ insights }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={16} className="text-emerald-600" />
        <h2 className="text-sm font-medium">AI Business Insights</h2>
      </div>

      <ul className="space-y-3">
        {insights?.insights?.map((item, idx) => (
          <li key={idx} className="flex gap-3 text-sm text-gray-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoreInsights;