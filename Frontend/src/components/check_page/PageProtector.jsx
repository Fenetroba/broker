import { Navigate, useLocation } from "react-router-dom";

// Map user roles to their home paths
const roleRedirects = {
  admin: "/admin/home",
  CityShop: "/city_shop/home",
  LocalShop: "/local_shop/home", // Fixed: removed extra space
  // Add more roles and paths as needed
};

const PageProtector = ({ isAuthenticated, children, user }) => {
  const location = useLocation();

  console.log("PageProtector Debug:", {
    isAuthenticated,
    user,
    currentPath: location.pathname,
    userRole: user?.role,
    roleRedirect: user?.role ? roleRedirects[user.role] : null
  });

  // Allow unauthenticated users to access login and register pages
  if (
    !isAuthenticated &&
    (location.pathname === "/auth/login" || location.pathname === "/auth/signup")
  ) {
    return <>{children}</>;
  }

  // Redirect unauthenticated users to login for all other routes
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  // Redirect authenticated users away from login/signup
  if (
    isAuthenticated &&
    (location.pathname.startsWith("/auth/login") || location.pathname.startsWith("/auth/signup"))
  ) {
    // If user has a role and a redirect path, use it; otherwise, go to home
    if (user && user.role && roleRedirects[user.role]) {
      return <Navigate to={roleRedirects[user.role]} />;
    }
    return <Navigate to="/" />;
  }

  // Redirect authenticated users to their home page based on role
  if (isAuthenticated && user && user.role && roleRedirects[user.role]) {
    // If already on the correct home page, render children
    if (location.pathname === roleRedirects[user.role]) {
      return <>{children}</>;
    }
    // If on a different protected page, redirect to their home
    if (!location.pathname.startsWith(roleRedirects[user.role])) {
      return <Navigate to={roleRedirects[user.role]} />;
    }
  }

  // Default: render children
  return <>{children}</>;
};

export default PageProtector;
