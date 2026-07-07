import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Guard for authenticated-only routes
export const PrivateRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Guard for login/register pages (redirect to dashboard if logged in)
export const PublicRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};
