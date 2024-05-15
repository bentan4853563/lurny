// Import statements for required modules and hooks.
import { Navigate, Outlet } from "react-router-dom";
import useAdmin from "../hooks/useAdmin"; // Adjust path as necessary
import useAuth from "../hooks/useAuth";

// This is a higher-order component that controls the rendering of admin routes.
const AdminRoute = () => {
  // Hook to check if the user has admin privileges.
  const isAdmin = useAdmin();
  // Hook to check if the user is authenticated (logged in).
  const isAuthenticate = useAuth();

  // First, we check whether the user is not an admin.
  if (!isAdmin) {
    // If the user is also not authenticated, redirect them to the sign-in page.
    if (!isAuthenticate) return <Navigate to="/signin" replace />;
    // If the user is authenticated but not an admin, redirect them to the home page.
    return <Navigate to="/" replace />;
  }

  // If the user passes both checks (isAdmin & isAuthenticate), render the children components.
  return <Outlet />;
};

// Exporting the component to be used elsewhere in the application.
export default AdminRoute;
