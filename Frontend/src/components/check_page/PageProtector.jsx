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
    return <Navigate to="/auth/login"  />;
  }

 if(isAuthenticated && (location.pathname.includes("/auth/login") || (location.pathname.includes("auth/signup")) )){
  return <Navigate to="/" />;

 }

 if(isAuthenticated && user.role=== 'admin'){
  return <Navigate to=''/>
 }
 if(isAuthenticated && user.role=== 'CityShop'){
  return <Navigate to=''/>
 }
 if(isAuthenticated && user.role=== 'CityShop'){
  return <Navigate to=''/>
 }

    return <>{children}</>;



};

export default PageProtector;
