import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // Prevent redirect until auth state is confirmed

  return user ? children || <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;
