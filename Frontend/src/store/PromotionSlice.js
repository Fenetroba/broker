import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from '../lib/Axios';

// Helper function to create form data
const createFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value == null) return;
    
    if (key === 'bannerImage' && value instanceof File) {
      formData.append('bannerImage', value);
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};

// Common error handler
const handleAsyncError = (error) => {
  return error.response?.data || { message: 'An error occurred' };
};

// Async thunks with consistent error handling
const createAsyncThunkWithErrorHandling = (type, apiCall) => 
  createAsyncThunk(`promotions/${type}`, async (payload, { rejectWithValue }) => {
    try {
      const response = await apiCall(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  });

// Thunks
export const fetchPromotionalProducts = createAsyncThunkWithErrorHandling(
  'fetchAll',
  (params = {}) => {
    const { status, owner, page = 1, limit = 10 } = params;
    const query = new URLSearchParams({ page, limit });
    if (status) query.append('status', status);
    if (owner) query.append('owner', owner);
    return axios.get(`/promotional-products?${query}`);
  }
);

export const createPromotionalProduct = createAsyncThunkWithErrorHandling(
  'create',
  (formData) => {
    const formDataToSend = createFormData(formData);
    return axios.post('/promotional-products', formDataToSend, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
);

export const updatePromotionalProduct = createAsyncThunkWithErrorHandling(
  'update',
  ({ id, ...data }) => {
    const formDataToSend = createFormData(data);
    return axios.put(`/promotional-products/${id}`, formDataToSend, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
);

export const deletePromotionalProduct = createAsyncThunkWithErrorHandling(
  'delete',
  (id) => axios.delete(`/promotional-products/${id}`)
);

export const togglePromotionalProductStatus = createAsyncThunkWithErrorHandling(
  'toggleStatus',
  (id) => axios.patch(`/promotional-products/${id}/toggle-status`)
);

export const fetchPromotionalProductById = createAsyncThunkWithErrorHandling(
  'fetchById',
  (id) => axios.get(`/promotional-products/${id}`)
);

export const fetchPromotionalProductsByOwner = createAsyncThunkWithErrorHandling(
  'fetchByOwner',
  (ownerId) => axios.get(`/promotional-products/owner/${ownerId}`)
);

export const fetchPromotionalProductsByProduct = createAsyncThunkWithErrorHandling(
  'fetchByProduct',
  (productId) => axios.get(`/promotional-products/product/${productId}`)
);

// Initial state
const initialState = {
  entities: {},
  ids: [],
  currentId: null,
  status: 'idle',
  error: null,
  filters: {
    status: null,
    owner: null,
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  }
};

// Slice
const promotionSlice = createSlice({
  name: 'promotions',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
    setCurrentPromotion: (state, { payload }) => {
      state.currentId = payload;
    },
    setFilters: (state, { payload }) => {
      state.filters = { ...state.filters, ...payload };
    },
    clearPromotions: (state) => {
      state.entities = {};
      state.ids = [];
    }
  },
  extraReducers: (builder) => {
    const addCommonReducers = (thunk, entityKey = 'promotions') => {
      builder
        .addCase(thunk.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, { payload }) => {
          state.status = 'succeeded';
          if (Array.isArray(payload)) {
            payload.forEach(item => {
              state.entities[item._id] = item;
              if (!state.ids.includes(item._id)) {
                state.ids.push(item._id);
              }
            });
          } else if (payload && payload._id) {
            state.entities[payload._id] = payload;
            if (!state.ids.includes(payload._id)) {
              state.ids.push(payload._id);
            }
            state.currentId = payload._id;
          }
        })
        .addCase(thunk.rejected, (state, { payload }) => {
          state.status = 'failed';
          state.error = payload?.message || 'An error occurred';
        });
    };

    // Apply common reducers to all thunks
    [
      fetchPromotionalProducts,
      createPromotionalProduct,
      updatePromotionalProduct,
      deletePromotionalProduct,
      togglePromotionalProductStatus,
      fetchPromotionalProductById,
      fetchPromotionalProductsByOwner,
      fetchPromotionalProductsByProduct
    ].forEach(thunk => addCommonReducers(thunk));
  }
});

// Selectors
export const selectAllPromotions = (state) => 
  state.promotions.ids.map(id => state.promotions.entities[id]);

export const selectCurrentPromotion = (state) => 
  state.promotions.currentId ? state.promotions.entities[state.promotions.currentId] : null;

export const selectPromotionsStatus = (state) => ({
  status: state.promotions.status,
  error: state.promotions.error
});

export const selectPromotionsByProduct = createSelector(
  [selectAllPromotions, (_, productId) => productId],
  (promotions, productId) => 
    promotions.filter(p => p.productId === productId)
);

export const selectPromotionsByOwner = createSelector(
  [selectAllPromotions, (_, ownerId) => ownerId],
  (promotions, ownerId) => 
    promotions.filter(p => p.owner === ownerId)
);

// Export actions
export const { 
  resetStatus, 
  setCurrentPromotion, 
  setFilters, 
  clearPromotions 
} = promotionSlice.actions;

export default promotionSlice.reducer;