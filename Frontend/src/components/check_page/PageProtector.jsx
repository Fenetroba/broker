import { Navigate, useLocation } from "react-router-dom";

const PageProtector = ({ isAuthenticated, children, user }) => {
  const location = useLocation();

  // Allow unauthenticated users to access login and register pages
  if (
    !isAuthenticated &&
    (location.pathname === "/auth/login" || location.pathname === "/auth/register")
  ) {
    return <>{children}</>;
  }

  // Redirect unauthenticated users to login for all other routes
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Authenticated users: prevent access to login/register, redirect based on role
  if (
    isAuthenticated &&
    (location.pathname === "/auth/login" || location.pathname === "/auth/register")
  ) {
    if (user?.role === "parent") return <Navigate to="/parent/home" />;
    if (user?.role === "child") return <Navigate to="/child/home" />;
    return <Navigate to="/admin/home" />;
  }

  // Role-based route protection (optional, for extra security)
  if (user?.role === "parent" && location.pathname.startsWith("/parent")) {
    return <>{children}</>;
  }
  if (user?.role === "child" && location.pathname.startsWith("/child")) {
    return <>{children}</>;
  }
  if (user?.role === "admin" && location.pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  // If role doesn't match the route, redirect to their home
  if (user?.role === "parent") return <Navigate to="/parent/home" />;
  if (user?.role === "child") return <Navigate to="/child/home" />;
  return <Navigate to="/admin/home" />;
};

export default PageProtector;
