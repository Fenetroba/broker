import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth, Refresh_token, LogOut } from '../store/AuthSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, isLoading, error } = useSelector((state) => state.auth);

  // Check authentication status on mount
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated, isLoading]);

  // Manual refresh token function
  const refreshToken = useCallback(async () => {
    try {
      await dispatch(Refresh_token()).unwrap();
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, [dispatch]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await dispatch(LogOut()).unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [dispatch]);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return hasRole('admin');
  }, [hasRole]);

  // Check if user is shop owner
  const isShopOwner = useCallback(() => {
    return hasRole('LocalShop') || hasRole('CityShop');
  }, [hasRole]);

  return {
    user,
    isAuthenticated,
    loading,
    isLoading,
    error,
    refreshToken,
    logout,
    hasRole,
    isAdmin,
    isShopOwner,
  };
}; 