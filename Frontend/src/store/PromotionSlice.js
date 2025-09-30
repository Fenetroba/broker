import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../lib/Axios';



// Helper function to handle file upload
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('bannerImage', file);
  
  const response = await axios.post(`/promotion/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true, // Include credentials if using cookies/sessions
  });
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to upload image');
  }
  
  // Return the full URL if it's not already a full URL
  const imageUrl = response.data.imageUrl;
  return imageUrl.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`;
};

// Async thunks
export const fetchPromotions = createAsyncThunk(
  'promotions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/promotion/get-promotions`);
      return response.data.data; // Assuming the backend returns { success: true, data: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch promotions');
    }
  }
);

export const createPromotion = createAsyncThunk(
     'promotions/create',
     async (promotionData, { rejectWithValue }) => {
       try {
         const formData = new FormData();
         
         // Append all form fields
         Object.keys(promotionData).forEach(key => {
           if (key === 'bannerImage' && promotionData[key] instanceof File) {
             formData.append('bannerImage', promotionData[key]);
           } else if (key === 'startDate' || key === 'endDate') {
             formData.append(key, new Date(promotionData[key]).toISOString());
           } else if (promotionData[key] !== undefined) {
             formData.append(key, promotionData[key]);
           }
         });
   
         const response = await axios.post(`${API_BASE_URL}/`, formData, {
           headers: {
             'Content-Type': 'multipart/form-data',
           },
           withCredentials: true,
         });
         
         return response.data.data;
       } catch (error) {
         return rejectWithValue(error.response?.data?.message || 'Failed to create promotion');
       }
     }
   );

export const deletePromotion = createAsyncThunk(
  'promotions/delete',
  async (promotionId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/${promotionId}`);
      return promotionId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete promotion');
    }
  }
);

// Slice
const promotionSlice = createSlice({
  name: 'promotions',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Promotions
    builder.addCase(fetchPromotions.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchPromotions.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.items = action.payload;
    });
    builder.addCase(fetchPromotions.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });

    // Create Promotion
    builder.addCase(createPromotion.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(createPromotion.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.items.push(action.payload);
    });
    builder.addCase(createPromotion.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });

    // Delete Promotion
    builder.addCase(deletePromotion.fulfilled, (state, action) => {
      state.items = state.items.filter(promotion => promotion._id !== action.payload);
    });
  },
});

export const { clearError } = promotionSlice.actions;
export default promotionSlice.reducer;

// Selectors
export const selectAllPromotions = (state) => state.promotions.items;
export const selectPromotionStatus = (state) => state.promotions.status;
export const selectPromotionError = (state) => state.promotions.error;
