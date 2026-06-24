import { API } from "../api/api";

export const predictSales = async (payload) => {
  const response = await API.post(
    "/forecast",
    payload
  );

  return response.data;
};