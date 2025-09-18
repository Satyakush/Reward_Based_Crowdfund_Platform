// src/components/Header.jsx
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold text-green-400">
          CrowdFund
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="hover:text-green-300">
            Campaigns
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/create-campaign" className="font-semibold hover:text-green-300">
                Create Campaign
              </Link>
              <button onClick={handleLogout} className="rounded-md bg-red-500 px-4 py-2 font-semibold hover:bg-red-600">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="hover:text-green-300">
                Login
              </Link>
              <Link to="/register" className="rounded-md bg-green-500 px-4 py-2 font-semibold hover:bg-green-600">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;