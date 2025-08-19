import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../lib/Axios';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isLoading: false, // For auth loading state
  // City Shop users listing
  cityShopUsers: [],
  cityShopLoading: false,
  cityShopError: null,
  LocalShopUsers: [],
  LocalShopLoading: false,
  LocalShopError: null,

  // Chat-related selections
  selectedFriendId: null,
  selectedFriend: null,
};

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      console.log(err)
      return rejectWithValue(err.response?.data || { message: 'Registration failed' });
    }
  }
);

export const LoginUser = createAsyncThunk(
  'auth/Login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'LoginUser failed' });
    }
  }
);

export const Refresh_token = createAsyncThunk(
  'auth/refresh-token',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/refresh-token');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Token refresh failed' });
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get('/auth/check_auth');
      return response.data;
    } catch (err) {
      // If checkAuth fails, try to refresh token
      if (err.response?.status === 401) {
        try {
          await dispatch(Refresh_token()).unwrap();
          // Retry checkAuth after successful refresh
          const retryResponse = await api.get('/auth/check_auth');
          return retryResponse.data;
        } catch (refreshErr) {
          return rejectWithValue({ message: 'Authentication failed' });
        }
      }
      return rejectWithValue(err.response?.data || { message: 'Not authenticated' });
    }
  }
);

export const LogOut = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Logout failed' });
    }
  }
);

export const GetVerifyedUser = createAsyncThunk(
  'auth/getVerifyedUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/get-verifyed-user');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'GetVerifyedUser failed' });
    }
  }
);

// Fetch users by role: CityShop
export const fetchCityShopUsers = createAsyncThunk(
  'auth/fetchCityShopUsers',
  async (_, { rejectWithValue }) => {
    try {
      // Explicitly request only CityShop users
      const { data } = await api.get('/auth/users', { 
        params: { 
          role: 'CityShop',
          // Add any other necessary query parameters
        } 
      });
      // Ensure we're only returning users with role 'CityShop'
      const cityShopUsers = (data?.users || data?.data || []).filter(user => 
        user.role === 'CityShop'
      );
      return cityShopUsers;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch City Shop users' });
    }
  }
);
export const fetchLocalShopUsers = createAsyncThunk(
  'auth/fetchLocalShopUsers',
  async (_, { rejectWithValue }) => {
    try {
      // Explicitly request only CityShop users
      const { data } = await api.get('/auth/users', { 
        params: { 
          role: 'LocalShop',
          // Add any other necessary query parameters
        } 
      });
      // Ensure we're only returning users with role 'CityShop'
      const cityShopUsers = (data?.users || data?.data || []).filter(user => 
        user.role === 'LocalShop'
      );
      return cityShopUsers;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch City Shop users' });
    }
  }
);

export const UpdateUserInformation = createAsyncThunk(
  'user/UpdateProfile',
  async ({ formData, config }, { rejectWithValue }) => {
    try {
      const response = await api.put('/auth/updateUserFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSelectedUserId: (state, action) => {
      state.selectedFriendId = action.payload;
    },
    // Prefer setting the whole user object when available
    setSelectedUser: (state, action) => {
      const user = action.payload || null;
      state.selectedFriend = user;
      state.selectedFriendId = user?._id || user?.id || null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload?.message || 'Registration failed';
      })

      // Login cases
      .addCase(LoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload?.message || 'Login failed';
      })

      // Logout cases
      .addCase(LogOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LogOut.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(LogOut.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload?.message || 'Logout failed';
      })

      // CheckAuth cases
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload?.message || 'Not authenticated';
      })

      // Refresh token cases
      .addCase(Refresh_token.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Refresh_token.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Don't change authentication state, just refresh the token
      })
      .addCase(Refresh_token.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload?.message || 'Token refresh failed';
      })

      // Update User Information
      .addCase(UpdateUserInformation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdateUserInformation.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(UpdateUserInformation.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload?.message || 'Update User Information failed';
      })



      // City Shop Users list
      .addCase(fetchCityShopUsers.pending, (state) => {
        state.cityShopLoading = true;
        state.cityShopError = null;
      })
      .addCase(fetchCityShopUsers.fulfilled, (state, action) => {
        state.cityShopLoading = false;
        state.cityShopUsers = action.payload || [];
      })
      .addCase(fetchCityShopUsers.rejected, (state, action) => {
        state.cityShopLoading = false;
        state.cityShopError = action.payload?.message || action.error?.message || 'Failed to fetch City Shop users';
      })
      .addCase(fetchLocalShopUsers.pending, (state) => {
        state.LocalShopLoading = true;
        state.LocalShopError = null;
      })
      .addCase(fetchLocalShopUsers.fulfilled, (state, action) => {
        state.LocalShopLoading = false;
        state.LocalShopUsers = action.payload || [];
      })
      .addCase(fetchLocalShopUsers.rejected, (state, action) => {
        state.LocalShopLoading = false;
        state.LocalShopError = action.payload?.message || action.error?.message || 'Failed to fetch Local Shop users';
      })
      
      
      
      
      ;
  },
});

export const { clearError, setLoading, setSelectedUserId, setSelectedUser } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCityShopUsers = (state) => state.auth?.cityShopUsers || [];
export const selectCityShopLoading = (state) => state.auth?.cityShopLoading || false;
export const selectCityShopError = (state) => state.auth?.cityShopError || null;
export const selectLocalShopUsers = (state) => state.auth?.LocalShopUsers || [];
export const selectLocalShopLoading = (state) => state.auth?.LocalShopLoading || false;
export const selectLocalShopError = (state) => state.auth?.LocalShopError || null;