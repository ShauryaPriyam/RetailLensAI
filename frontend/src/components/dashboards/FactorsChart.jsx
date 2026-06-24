import React from "react";

const FACTOR_COLORS = [
  "#1D9E75",
  "#5DCAA5",
  "#378ADD",
  "#BA7517",
  "#D4537E",
];

const FactorsChart = ({ factors = [] }) => {
  if (!factors.length) {
    return (
      <p className="text-sm text-gray-400">
        No factor data available
      </p>
    );
  }

  const max = Math.max(...factors.map((f) => f.importance));

  return (
    <div className="space-y-4">
      {factors.map((f, i) => (
        <div key={f.factor}>
          {/* Top row */}
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">
              {f.factor}
            </span>

            <span className="text-xs text-gray-400 shrink-0">
              {f.importance.toFixed(1)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(f.importance / max) * 100}%`,
                background:
                  FACTOR_COLORS[i % FACTOR_COLORS.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FactorsChart;