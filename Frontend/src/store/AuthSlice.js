import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../lib/Axios';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
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

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/check_auth'); // or your auth-check endpoint
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Not authenticated' });
    }
  }
);
export const LogOut=createAsyncThunk(

  'auth/logout',
  async(_,{rejectWithValue})=>{
    try{
      const response=await api.post('/auth/logout');
      return response.data;
    }catch(err){
      return rejectWithValue(err.response?.data || { message: 'Logout Fall' });

    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
  
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload?.message || 'Registration failed';
      })
      .addCase(LogOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LogOut.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
      
        state.error = null;
      })
      .addCase(LogOut.rejected, (state, action) => {
        state.loading = false;
        
        state.user = null;
   
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload?.message || 'Not authenticated';
      });
  },
});

export const { } = authSlice.actions;
export default authSlice.reducer;