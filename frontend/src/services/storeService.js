import { API } from "../api/api";

export const getStores = async () => {
  const response = await API.get("/stores");
  return response.data;
};

export const getStore = async (storeId) => {
  const response = await API.get(
    `/stores/${storeId}`
  );

  return response.data;
};

export const searchStores = async (query) => {
  const response = await API.get(
    `/stores/search?q=${query}`
  );

  return response.data;
};

export const getStoreMap = async () => {
  const response = await API.get(
    "/stores/map"
  );

  return response.data;
};

export const getSimilarStores = async (
  storeId
) => {
  const response = await API.get(
    `/stores/${storeId}/similar`
  );

  return response.data;
};

export const getStoreInsights = async (
  storeId
) => {
  const response = await API.get(
    `/stores/${storeId}/insights`
  );

  return response.data;
};