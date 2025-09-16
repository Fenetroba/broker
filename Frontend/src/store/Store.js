import { configureStore } from '@reduxjs/toolkit';
import auth from './AuthSlice';
import chat from './chatSlice';
import products from './ProductSlice';
import orders from './OrderSlice';
import users from './UsersSlice';
import promotions from './PromotionSlice';

export const store = configureStore({
  reducer: {
    auth:auth,
    chat:chat,
    products:products,
    users:users,
    orders:orders,
    promotions:promotions
  },
});