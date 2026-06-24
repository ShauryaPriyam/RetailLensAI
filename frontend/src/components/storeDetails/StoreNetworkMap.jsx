import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
const currentStoreIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const otherStoreIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const StoreNetworkMap = ({ store, mapStores, currentId, onNavigateStore }) => {
  const currentLat = Number(store?.Latitude);
  const currentLng = Number(store?.Longitude);
  const hasMap = Number.isFinite(currentLat) && Number.isFinite(currentLng);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium text-gray-900">Store Network Map</h2>
          <p className="text-xs text-gray-400 mt-1">
            Click any marker to jump to that store
          </p>
        </div>

        <div className="flex gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            Current Store
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            Other Stores
          </div>
        </div>
      </div>

      {hasMap ? (
        <MapContainer
          center={[currentLat, currentLng]}
          zoom={5}
          scrollWheelZoom
          className="h-125 w-full rounded-xl"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {mapStores.map((s) => {
            const lat = Number(s.Latitude);
            const lng = Number(s.Longitude);

            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

            const isCurrent = Number(s.Store) === Number(currentId);

            return (
              <Marker
                key={s.Store}
                position={[lat, lng]}
                icon={isCurrent ? currentStoreIcon : otherStoreIcon}
              >
                <Popup>
                  <div className="min-w-[220px]">
                    <p className="font-medium text-sm">{s.DisplayName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {s.City}, {s.Country}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">Store #{s.Store}</p>

                    <button
                      onClick={() => onNavigateStore(s.Store)}
                      className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 rounded-lg"
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      ) : (
        <div className="h-125 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          Map coordinates not available for this store
        </div>
      )}
    </div>
  );
};

export default StoreNetworkMap;