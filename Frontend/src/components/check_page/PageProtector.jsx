import { Navigate, useLocation } from "react-router-dom";

const PageProtector = ({ isAuthenticated, children, user }) => {
  const location = useLocation();

  // Allow unauthenticated users to access login and register pages
  if (
    !isAuthenticated &&
    (location.pathname === "/auth/login" || location.pathname === "/auth/signup")
  ) {
    return <>{children}</>;
  }

  // Redirect unauthenticated users to login for all other routes
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Authenticated users: prevent access to login/register, redirect based on role


  // Role-based route protection (optional, for extra security)

    return <>{children}</>;



};

export default PageProtector;
