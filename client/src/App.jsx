import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import CampaignDetailsPage from './pages/CampaignDetailsPage';
import MyCampaignsPage from './pages/MyCampaignsPage';
import EditCampaignPage from './pages/EditCampaignPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();
  const isCampaignPage = location.pathname === '/' || location.pathname.startsWith('/campaign/');

  return (
    <div className={`min-h-screen ${isCampaignPage ? 'campaign-background' : 'app-background'}`}>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/campaign/:id" element={<CampaignDetailsPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/create-campaign" element={<CreateCampaignPage />} />
            <Route path="/my-campaigns" element={<MyCampaignsPage />} />
            <Route path="/edit-campaign/:id" element={<EditCampaignPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default App;
