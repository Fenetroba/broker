import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../lib/Axios';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isLoading: false, // For auth loading state
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

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
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
      });
  },
});

export const { clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;