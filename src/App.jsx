import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Insights from "./pages/Insights";
import About from "./pages/About";
import Why from "./pages/Why";
import RecentURLsPage from "./pages/RecentUrlPage";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <Insights />
          </ProtectedRoute>
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="/why" element={<Why />} />
      <Route
        path="/recent-scan"
        element={
          <ProtectedRoute>
            <RecentURLsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
