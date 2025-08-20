import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../lib/Axios";

// Thunks aligned to backend routes mounted at /api/orders
export const createOrder = createAsyncThunk(
  "orders/create",
  async (orderPayload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`orders`, orderPayload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`orders/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const payOrder = createAsyncThunk(
  "orders/pay",
  async ({ id, paymentResult }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`orders/${id}/pay`, paymentResult);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deliverOrder = createAsyncThunk(
  "orders/deliver",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`orders/${id}/deliver`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`orders/myorders`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`orders`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`orders/${id}/status`, { status });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`orders/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  currentOrder: null,
  myOrders: [],
  allOrders: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // create
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to create order";
      })

      // fetch by id
      .addCase(fetchOrderById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch order";
      })

      // pay
      .addCase(payOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentOrder = action.payload;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to update payment";
      })

      // deliver (admin)
      .addCase(deliverOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deliverOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentOrder = action.payload;
      })
      .addCase(deliverOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to update delivery";
      })

      // my orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch my orders";
      })

      // all orders (admin)
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allOrders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch orders";
      })

      // update status (admin)
      .addCase(updateOrderStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        // update in allOrders and currentOrder if matches
        const idx = state.allOrders.findIndex((o) => o._id === action.payload._id);
        if (idx !== -1) state.allOrders[idx] = action.payload;
        if (state.currentOrder?._id === action.payload._id) state.currentOrder = action.payload;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to update order status";
      })

      // delete (admin)
      .addCase(deleteOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allOrders = state.allOrders.filter((o) => o._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to delete order";
      });
  },
});

export const { clearOrderError } = ordersSlice.actions;
export default ordersSlice.reducer;
