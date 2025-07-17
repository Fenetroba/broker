import { Navigate, useLocation } from "react-router-dom";

// Map user roles to their home paths
const roleRedirects = {
  admin: "/admin/home",
  CityShop: "/city_shop/home",
  LocalShop: "/local_shop/home",
  // Add more roles and paths as needed
};

// Pages that all authenticated users can access
const allowedPages = [
  "/user/profile",
  "/user/profile-edit",
  "/auth/login",
  "/auth/signup",
  "/local_shop/inbox",
  "/local_shop/my_product",
  "/local_shop/order",
  "/local_shop/setting",
  "/local_shop/earning",
];

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

  // Allow authenticated users to access allowed pages (like profile)
  if (isAuthenticated && allowedPages.some(page => location.pathname.startsWith(page))) {
    return <>{children}</>;
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

  // For role-specific pages, check if user has access
  if (isAuthenticated && user && user.role) {
    const userHomePath = roleRedirects[user.role];
    
    // If user is trying to access their own role's pages, allow it
    if (userHomePath && location.pathname.startsWith(userHomePath)) {
      return <>{children}</>;
    }
    
    // If user is trying to access a different role's pages, redirect to their home
    if (userHomePath && !location.pathname.startsWith(userHomePath)) {
      // Check if it's a general page that all users can access
      const isGeneralPage = allowedPages.some(page => location.pathname.startsWith(page));
      if (!isGeneralPage) {
        return <Navigate to={userHomePath} />;
      }
    }
  }

  // Default: render children
  return <>{children}</>;
};

export default PageProtector;
