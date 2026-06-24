export const storeType = (s) => {
  if (s.StoreType_a) return "A";
  if (s.StoreType_b) return "B";
  if (s.StoreType_c) return "C";
  if (s.StoreType_d) return "D";
  return null;
};

export const assortmentLabel = (s) => {
  if (s.Assortment_a) return "Basic";
  if (s.Assortment_b) return "Extra";
  if (s.Assortment_c) return "Extended";
  return null;
};