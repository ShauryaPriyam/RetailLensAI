import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Forecast from "./pages/Forecast";
import Stores from "./pages/Stores";
import StoreDetails from "./pages/StoreDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/stores/:id" element={<StoreDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;