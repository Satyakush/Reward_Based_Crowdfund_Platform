import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

const ProtectedRoute = () => {
  const { user, authLoading } = useContext(AuthContext);
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
};

export default ProtectedRoute;
