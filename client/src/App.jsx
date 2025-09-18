// src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom'; // 1. Import useLocation
import Header from './components/Header';
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
  const location = useLocation(); // 2. Get the current location

  // 3. Define which pages get the special background
  const campaignPages = ['/', '/campaign'];
  const useCampaignBackground = campaignPages.some(path => 
    path.includes(':id') 
      ? new RegExp(`^${path.replace(':id', '[a-zA-Z0-9]+')}$`).test(location.pathname)
      : location.pathname.startsWith(path) && (path === '/' ? location.pathname.length === 1 : true)
  );

  // A simpler way to write the logic above for our specific routes:
  const isCampaignPage = location.pathname === '/' || location.pathname.startsWith('/campaign/');

  return (
    // 4. Conditionally apply the background class
    <div className={`min-h-screen ${isCampaignPage ? 'campaign-background' : 'app-background'}`}>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create-campaign" element={<CreateCampaignPage />} />
          <Route path="/campaign/:id" element={<CampaignDetailsPage />} />
          <Route path="/my-campaigns" element={<MyCampaignsPage />} />
          <Route path="/edit-campaign/:id" element={<EditCampaignPage />} />
        </Routes>
      </main>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </div>
  );
}


export default App;