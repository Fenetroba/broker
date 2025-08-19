import { configureStore } from '@reduxjs/toolkit';
import auth from './AuthSlice';
import chat from './chatSlice';
import products from './Productsice';

export const store = configureStore({
  reducer: {
    auth:auth,
    chat:chat,
    products:products
  },
});