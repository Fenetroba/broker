import { configureStore } from '@reduxjs/toolkit';
import auth from './AuthSlice';
import chat from './chatSlice';


export const store = configureStore({
  reducer: {
    auth:auth,
    chat:chat
  },
});