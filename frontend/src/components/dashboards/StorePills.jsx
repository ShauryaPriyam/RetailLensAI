import React from 'react'
const TYPE_COLORS = {
  A: { bg: "#E1F5EE", text: "#085041" },
  B: { bg: "#E6F1FB", text: "#0C447C" },
  C: { bg: "#FAEEDA", text: "#633806" },
  D: { bg: "#FBEAF0", text: "#72243E" },
};

const ASSORTMENT_COLORS = {
  Basic: { bg: "#EEEDFE", text: "#3C3489" },
  Extra: { bg: "#FAECE7", text: "#712B13" },
  Extended: { bg: "#EAF3DE", text: "#27500A" },
};

const StorePills = ({ store_types, assortments }) => {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Store type</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(store_types).map(([key, count]) => {
            const c = TYPE_COLORS[key] ?? { bg: "#F1EFE8", text: "#444441" };
            return (
              <span
                key={key}
                className="text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ background: c.bg, color: c.text }}
              >
                Type {key} · {count}
              </span>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Assortment</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(assortments).map(([key, count]) => {
            const c = ASSORTMENT_COLORS[key] ?? { bg: "#F1EFE8", text: "#444441" };
            return (
              <span
                key={key}
                className="text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ background: c.bg, color: c.text }}
              >
                {key} · {count}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default StorePills
