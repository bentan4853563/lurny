import { Navigate, Outlet } from "react-router-dom";
import useAdmin from "../hooks/useAdmin"; // Adjust path as necessary
import useAuth from "../hooks/useAuth";

const AdminRoute = () => {
  const isAdmin = useAdmin();
  const isAuthenticate = useAuth();

  if (!isAdmin) {
    if (!isAuthenticate) return <Navigate to="/signin" replace />;
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
