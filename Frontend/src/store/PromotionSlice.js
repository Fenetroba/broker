import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../lib/Axios';

// Async thunks for promotional products
export const fetchPromotionalProducts = createAsyncThunk(
  'promotions/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.owner) queryParams.append('owner', params.owner);
      
      const url = `/promotional-products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch promotional products' });
    }
  }
);

export const fetchActivePromotionalProducts = createAsyncThunk(
  'promotions/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/promotional-products/active');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch active promotions' });
    }
  }
);

export const fetchPromotionalProductById = createAsyncThunk(
  'promotions/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/promotional-products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch promotional product' });
    }
  }
);

export const createPromotionalProduct = createAsyncThunk(
  'promotions/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/promotional-products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create promotional product' });
    }
  }
);

export const updatePromotionalProduct = createAsyncThunk(
  'promotions/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/promotional-products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update promotional product' });
    }
  }
);

export const deletePromotionalProduct = createAsyncThunk(
  'promotions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/promotional-products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete promotional product' });
    }
  }
);

export const togglePromotionalProductStatus = createAsyncThunk(
  'promotions/toggleStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/promotional-products/${id}/toggle`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to toggle promotional product status' });
    }
  }
);

export const fetchPromotionalProductsByOwner = createAsyncThunk(
  'promotions/fetchByOwner',
  async (ownerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/promotional-products/owner/${ownerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch owner promotions' });
    }
  }
);

export const fetchPromotionalProductsByProduct = createAsyncThunk(
  'promotions/fetchByProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/promotional-products/product/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch product promotions' });
    }
  }
);

const promotionSlice = createSlice({
  name: 'promotions',
  initialState: {
    items: [],
    activePromotions: [],
    currentPromotion: null,
    ownerPromotions: [],
    productPromotions: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    createStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
    toggleStatus: 'idle',
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCreateStatus: (state) => {
      state.createStatus = 'idle';
    },
    clearUpdateStatus: (state) => {
      state.updateStatus = 'idle';
    },
    clearDeleteStatus: (state) => {
      state.deleteStatus = 'idle';
    },
    clearToggleStatus: (state) => {
      state.toggleStatus = 'idle';
    },
    setCurrentPromotion: (state, action) => {
      state.currentPromotion = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all promotional products
      .addCase(fetchPromotionalProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPromotionalProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data || action.payload;
      })
      .addCase(fetchPromotionalProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch promotional products';
      })

      // Fetch active promotional products
      .addCase(fetchActivePromotionalProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActivePromotionalProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.activePromotions = action.payload.data || action.payload;
      })
      .addCase(fetchActivePromotionalProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch active promotions';
      })

      // Fetch promotional product by ID
      .addCase(fetchPromotionalProductById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPromotionalProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentPromotion = action.payload.data || action.payload;
      })
      .addCase(fetchPromotionalProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch promotional product';
      })

      // Create promotional product
      .addCase(createPromotionalProduct.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createPromotionalProduct.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        const newPromotion = action.payload.data || action.payload;
        state.items.unshift(newPromotion);
        if (newPromotion.status === 'active') {
          state.activePromotions.unshift(newPromotion);
        }
      })
      .addCase(createPromotionalProduct.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload?.message || 'Failed to create promotional product';
      })

      // Update promotional product
      .addCase(updatePromotionalProduct.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updatePromotionalProduct.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const updatedPromotion = action.payload.data || action.payload;
        const index = state.items.findIndex(item => item._id === updatedPromotion._id);
        if (index !== -1) {
          state.items[index] = updatedPromotion;
        }
        
        // Update active promotions if status changed
        const activeIndex = state.activePromotions.findIndex(item => item._id === updatedPromotion._id);
        if (updatedPromotion.status === 'active' && activeIndex === -1) {
          state.activePromotions.unshift(updatedPromotion);
        } else if (updatedPromotion.status === 'inactive' && activeIndex !== -1) {
          state.activePromotions.splice(activeIndex, 1);
        } else if (activeIndex !== -1) {
          state.activePromotions[activeIndex] = updatedPromotion;
        }
      })
      .addCase(updatePromotionalProduct.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload?.message || 'Failed to update promotional product';
      })

      // Delete promotional product
      .addCase(deletePromotionalProduct.pending, (state) => {
        state.deleteStatus = 'loading';
        state.error = null;
      })
      .addCase(deletePromotionalProduct.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.items = state.items.filter(item => item._id !== action.payload);
        state.activePromotions = state.activePromotions.filter(item => item._id !== action.payload);
        if (state.currentPromotion?._id === action.payload) {
          state.currentPromotion = null;
        }
      })
      .addCase(deletePromotionalProduct.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.payload?.message || 'Failed to delete promotional product';
      })

      // Toggle promotional product status
      .addCase(togglePromotionalProductStatus.pending, (state) => {
        state.toggleStatus = 'loading';
        state.error = null;
      })
      .addCase(togglePromotionalProductStatus.fulfilled, (state, action) => {
        state.toggleStatus = 'succeeded';
        const toggledPromotion = action.payload.data || action.payload;
        const index = state.items.findIndex(item => item._id === toggledPromotion.id);
        if (index !== -1) {
          state.items[index].status = toggledPromotion.status;
        }
        
        // Update active promotions
        const activeIndex = state.activePromotions.findIndex(item => item._id === toggledPromotion.id);
        if (toggledPromotion.status === 'active' && activeIndex === -1) {
          const promotion = state.items.find(item => item._id === toggledPromotion.id);
          if (promotion) state.activePromotions.unshift(promotion);
        } else if (toggledPromotion.status === 'inactive' && activeIndex !== -1) {
          state.activePromotions.splice(activeIndex, 1);
        }
      })
      .addCase(togglePromotionalProductStatus.rejected, (state, action) => {
        state.toggleStatus = 'failed';
        state.error = action.payload?.message || 'Failed to toggle promotional product status';
      })

      // Fetch promotional products by owner
      .addCase(fetchPromotionalProductsByOwner.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPromotionalProductsByOwner.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ownerPromotions = action.payload.data || action.payload;
      })
      .addCase(fetchPromotionalProductsByOwner.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch owner promotions';
      })

      // Fetch promotional products by product
      .addCase(fetchPromotionalProductsByProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPromotionalProductsByProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productPromotions = action.payload.data || action.payload;
      })
      .addCase(fetchPromotionalProductsByProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch product promotions';
      });
  }
});

export const {
  clearError,
  clearCreateStatus,
  clearUpdateStatus,
  clearDeleteStatus,
  clearToggleStatus,
  setCurrentPromotion
} = promotionSlice.actions;

export default promotionSlice.reducer;
