import { configureStore } from '@reduxjs/toolkit';
import auth from './AuthSlice';
import chat from './chatSlice';
import products from './ProductSlice';
import orders from './OrderSlice';
import users from './UsersSlice';
import promotions from './PromotionSlice';
import { getSocket } from '@/lib/socket';

export const store = configureStore({
  reducer: {
    auth: auth,
    chat: chat,
    products: products,
    users: users,
    orders: orders,
    promotions: promotions
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Initialize socket with store's getState function
const initializeSocket = () => {
  try {
    const socket = getSocket(store.getState);
    // Make socket globally available for components
    window.socket = socket;
    return socket;
  } catch (error) {
    console.error('Failed to initialize socket:', error);
    return null;
  }
};

// Initialize socket after store is created
initializeSocket();

export default store;