import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import Sidebar from "../components/Sidebar";
import StoreHeader from "../components/storeDetails/StoreHeader";
import StoreNetworkMap from "../components/storeDetails/StoreNetworkMap";
import StoreStats from "../components/storeDetails/StoreStats";
import StoreInsights from "../components/storeDetails/StoreInsights";
import SimilarStores from "../components/storeDetails/SimilarStores";
import StoreErrorState from "../components/storeDetails/StoreErrorState";
import Layout from "../layout";

const StoreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [insights, setInsights] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [mapStores, setMapStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadStore = async () => {
    try {
      setLoading(true);
      setError(null);

      const [storeRes, insightRes, similarRes, mapRes] = await Promise.all([
        API.get(`stores/${id}`),
        API.get(`stores/${id}/insights`),
        API.get(`stores/${id}/similar`),
        API.get("stores/map"),
      ]);

      setStore(storeRes.data);
      setInsights(insightRes.data);
      setSimilar(similarRes.data || []);
      setMapStores(mapRes.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar active="Stores" />
        <main className="flex-1 p-8">Loading...</main>
      </div>
    );
  }

  if (error) {
    return (
      <StoreErrorState
        error={error}
        onBack={() => navigate("/stores")}
      />
    );
  }

  return (
    <Layout
      title={store?.name || "Store Details"}
      subtitle={`Store ID: ${id}`}
      active="Stores"
    >
      <div className="flex min-h-screen bg-gray-50">

        <main className="flex-1 overflow-y-auto">
          <button
            onClick={() => navigate("/stores")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-5"
          >
            Back to Stores
          </button>

          <StoreHeader store={store} insights={insights} id={id} />

          <StoreNetworkMap
            store={store}
            mapStores={mapStores}
            currentId={id}
            onNavigateStore={(storeId) => navigate(`/stores/${storeId}`)}
          />

          <StoreStats insights={insights} />

          <StoreInsights insights={insights} />

          <SimilarStores similar={similar} />
        </main>
      </div>
    </Layout>
  );
};

export default StoreDetails;