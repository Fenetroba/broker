import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../src/lib/Axios';


// Async thunks for API calls
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/users`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`/users/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'users/toggleUserStatus',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/users/${userId}/toggle-status`);
      return { userId, isOnline: response.data.data.isOnline };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle user status');
    }
  }
);

export const searchUsers = createAsyncThunk(
  'users/searchUsers',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/users/search?query=${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search users');
    }
  }
);

export const getUsersByRole = createAsyncThunk(
  'users/getUsersByRole',
  async (role, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/users/role/${role}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users by role');
    }
  }
);

export const verifyAdminPassword = createAsyncThunk(
  'users/verifyAdminPassword',
  async (password, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/users/verify-password`, { password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password verification failed');
    }
  }
);

// Initial state
const initialState = {
  users: [],
  currentUser: null,
  filteredUsers: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedRole: 'all',
  totalUsers: 0,
  passwordVerification: {
    loading: false,
    error: null,
    verified: false
  }
};

// Users slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload;
    },
    filterUsers: (state) => {
      let filtered = state.users;
      
      // Filter by role
      if (state.selectedRole !== 'all') {
        filtered = filtered.filter(user => user.role === state.selectedRole);
      }
      
      // Filter by search query
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(user => 
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.companyName.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
        );
      }
      
      state.filteredUsers = filtered;
    },
    clearUsers: (state) => {
      state.users = [];
      state.filteredUsers = [];
      state.currentUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.filteredUsers = action.payload.data;
        state.totalUsers = action.payload.count;
        state.error = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.data;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.data;
        const index = state.users.findIndex(user => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
        // Update filtered users as well
        const filteredIndex = state.filteredUsers.findIndex(user => user._id === updatedUser._id);
        if (filteredIndex !== -1) {
          state.filteredUsers[filteredIndex] = updatedUser;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const deletedUserId = action.payload;
        state.users = state.users.filter(user => user._id !== deletedUserId);
        state.filteredUsers = state.filteredUsers.filter(user => user._id !== deletedUserId);
        state.totalUsers -= 1;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Toggle user status
      .addCase(toggleUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, isOnline } = action.payload;
        const userIndex = state.users.findIndex(user => user._id === userId);
        if (userIndex !== -1) {
          state.users[userIndex].isOnline = isOnline;
        }
        const filteredIndex = state.filteredUsers.findIndex(user => user._id === userId);
        if (filteredIndex !== -1) {
          state.filteredUsers[filteredIndex].isOnline = isOnline;
        }
        state.error = null;
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Search users
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredUsers = action.payload.data;
        state.error = null;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get users by role
      .addCase(getUsersByRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersByRole.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredUsers = action.payload.data;
        state.error = null;
      })
      .addCase(getUsersByRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Verify admin password
      .addCase(verifyAdminPassword.pending, (state) => {
        state.passwordVerification.loading = true;
        state.passwordVerification.error = null;
        state.passwordVerification.verified = false;
      })
      .addCase(verifyAdminPassword.fulfilled, (state, action) => {
        state.passwordVerification.loading = false;
        state.passwordVerification.verified = true;
        state.passwordVerification.error = null;
      })
      .addCase(verifyAdminPassword.rejected, (state, action) => {
        state.passwordVerification.loading = false;
        state.passwordVerification.verified = false;
        state.passwordVerification.error = action.payload;
      });
  }
});

export const {
  clearError,
  setSearchQuery,
  setSelectedRole,
  filterUsers,
  clearUsers
} = usersSlice.actions;

export default usersSlice.reducer;
