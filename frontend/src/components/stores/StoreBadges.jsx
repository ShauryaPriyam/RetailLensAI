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

export const TypePill = ({ type }) => {
  if (!type) return null;
  const c = TYPE_COLORS[type] ?? { bg: "#F1EFE8", text: "#444" };

  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.text }}
    >
      Type {type}
    </span>
  );
};

export const AssortmentPill = ({ label }) => {
  if (!label) return null;
  const c = ASSORTMENT_COLORS[label] ?? { bg: "#F1EFE8", text: "#444" };

  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.text }}
    >
      {label}
    </span>
  );
};