import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";

const AdminRoute = () => {
  const { user, loading } = useAuth();

  // Prevents flashing the protected page before checking auth status
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-gray-300 border-t-gray-400 rounded-full"
        />
      </div>
    );
  }

  // Check if the user is logged in
  if (user) {
    const loginTimestamp = localStorage.getItem("loginTimestamp");
    const currentTime = new Date().getTime();
    const oneHour = 60 * 60 * 1000;

    // If the login timestamp is older than 1 hour, redirect to login
    if (!loginTimestamp || currentTime - loginTimestamp > oneHour) {
      localStorage.removeItem("loginTimestamp");
      return <Navigate to="/login" replace />;
    }

    // Update the login timestamp
    localStorage.setItem("loginTimestamp", currentTime);
    return <Outlet />;
  }

  // If user is not logged in, redirect to login
  return <Navigate to="/login" replace />;
};

export default AdminRoute;
