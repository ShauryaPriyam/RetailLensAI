import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";

import Sidebar from "../components/Sidebar";
import API from "../api/api";
import StoreSearch from "../components/stores/StoreSearch";
import StoreTable from "../components/stores/StoreTable";
import Layout from "../layout";

export default function Stores() {
  const navigate = useNavigate();
  const searchTimeout = useRef(null);

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const loadStores = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await API.get("stores");
      setStores(data || []);
    } catch (e) {
      setError(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    clearTimeout(searchTimeout.current);

    const q = query.trim();

    if (!q) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);

    searchTimeout.current = setTimeout(async () => {
      try {
        const { data } = await API.get(
          `stores/search?q=${encodeURIComponent(q)}`
        );
        setSearchResults(data || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout.current);
  }, [query]);

  const displayed = query.trim() ? searchResults : stores;

  return (
    <Layout
      title="Stores"
      subtitle="View and manage stores in your network"
      active="Stores"
    >
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 overflow-y-auto">

          <StoreSearch query={query} setQuery={setQuery} />

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <StoreTable
            stores={displayed}
            loading={loading}
            searching={searching}
            query={query}
            onStoreClick={(id) => navigate(`/stores/${id}`)}
          />
        </main>
      </div>
    </Layout>
  );
}