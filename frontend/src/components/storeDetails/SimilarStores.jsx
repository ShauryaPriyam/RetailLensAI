import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SimilarStores = ({ similar }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Users size={16} className="text-emerald-600" />
        <h2 className="text-sm font-medium">Similar Stores</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {similar.map((s) => (
          <div
            key={s.Store}
            onClick={() => navigate(`/stores/${s.Store}`)}
            className="border border-gray-100 rounded-xl p-4 cursor-pointer hover:border-emerald-300 transition-colors"
          >
            <h3 className="text-sm font-medium">{s.DisplayName}</h3>
            <p className="text-xs text-gray-400 mt-1">
              {s.City}, {s.Country}
            </p>

            <div className="mt-3">
              <p className="text-xs text-gray-400">Similarity</p>
              <p className="text-emerald-700 font-medium">{s.similarity}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarStores;