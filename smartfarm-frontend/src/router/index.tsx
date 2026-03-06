import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import FarmsPage from "../pages/FarmsPage";
import CropsPage from "../pages/CropsPage";
import AssistantPage from "../pages/AssistantPage";
import DiseaseDetectionPage from "../pages/DiseaseDetectionPage";
import FertilizerPage from "../pages/FertilizerPage";
import MarketPricesPage from "../pages/MarketPricesPage";
import WeatherPage from "../pages/WeatherPage";
import Layout from "../components/Layout";







const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route index element={<DashboardPage />} />
                  <Route path="farms" element={<FarmsPage />} />
                  <Route path="crops" element={<CropsPage />} />
                  <Route path="assistant" element={<AssistantPage />} />
                  <Route path="disease-detection" element={<DiseaseDetectionPage />} />
                  <Route path="fertilizer" element={<FertilizerPage />} />
                  <Route path="market-prices" element={<MarketPricesPage />} />
                  <Route path="weather" element={<WeatherPage />} />





                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}