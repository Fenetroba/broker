import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // { id, type, title, body, data, read, createdAt }
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action) {
      const n = { read: false, createdAt: Date.now(), ...action.payload };
      state.items.unshift(n);
    },
    markRead(state, action) {
      const id = action.payload;
      const idx = state.items.findIndex((x) => x.id === id);
      if (idx !== -1) state.items[idx].read = true;
    },
    markAllRead(state) {
      state.items.forEach((i) => (i.read = true));
    },
    removeNotification(state, action) {
      const id = action.payload;
      state.items = state.items.filter((x) => x.id !== id);
    },
    clearNotifications(state) {
      state.items = [];
    },
  },
});

export const {
  addNotification,
  markRead,
  markAllRead,
  removeNotification,
  clearNotifications,
} = notificationSlice.actions;
export default notificationSlice.reducer;