import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../lib/Axios';

// Update with your backend URL

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/product/get-products`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchProductsById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/product/get-product/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/product/create-product`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);
export const likeProduct = createAsyncThunk(
  'products/like',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/product/like-product/${productId}`);
      return { productId, isLiked: response.data.isLiked };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);


export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/product/update-product/${id}`,
        productData,
        
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/product/delete-product/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProductRating = createAsyncThunk(
  'products/updateRating',
  async ({ productId, rating }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/product/${productId}/rate`, { rating });
      return { productId, rating: response.data.averageRating, numReviews: response.data.numReviews };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    currentProduct: null
  },
  reducers: {
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Handle like product
    builder.addCase(likeProduct.fulfilled, (state, action) => {
      const { productId, isLiked } = action.payload;
      // Update in items array
      const productIndex = state.items.findIndex(p => p._id === productId);
      if (productIndex !== -1) {
        state.items[productIndex].isLiked = isLiked;
      }
      // Update current product if it's the one being liked
      if (state.currentProduct?._id === productId) {
        state.currentProduct.isLiked = isLiked;
      }
    });

    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch products';
      })

      // fetch Product By id
      .addCase(fetchProductsById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductsById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch product by id';
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to create product';
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to update product';
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to delete product';
      });
  }
});

export const { setCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;