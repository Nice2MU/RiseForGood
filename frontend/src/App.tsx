import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ActivitiesListPage from "./pages/ActivitiesListPage";
import ActivityDetailPage from "./pages/ActivityDetailPage";
import MyActivitiesPage from "./pages/MyActivitiesPage";
import AdminActivitiesPage from "./pages/AdminActivitiesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/activities" element={<ActivitiesListPage />} />
        <Route path="/activities/:id" element={<ActivityDetailPage />} />
        <Route
          path="/my-activities"
          element={
            <ProtectedRoute>
              <MyActivitiesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/activities"
          element={
            <ProtectedRoute>
              <AdminActivitiesPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
