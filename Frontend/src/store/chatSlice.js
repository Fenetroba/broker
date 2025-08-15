import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,
  error: null,
  unreadCount: 0
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Set conversations list
    setConversations: (state, action) => {
      state.conversations = action.payload;
      state.loading = false;
    },

    // Add a new conversation
    addConversation: (state, action) => {
      state.conversations.unshift(action.payload);
    },

    // Set current conversation
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },

    // Set messages for current conversation
    setMessages: (state, action) => {
      state.messages = action.payload;
      state.loading = false;
    },

    // Add a new message
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      
      // Update conversation's last message
      if (state.currentConversation) {
        const conversationIndex = state.conversations.findIndex(
          conv => conv._id === state.currentConversation._id
        );
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].lastMessage = action.payload;
          state.conversations[conversationIndex].lastMessageAt = new Date().toISOString();
        }
      }
    },

    // Update a message (edit)
    updateMessage: (state, action) => {
      const { messageId, content } = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg._id === messageId);
      if (messageIndex !== -1) {
        state.messages[messageIndex].content = content;
      }
    },

    // Delete a message
    deleteMessage: (state, action) => {
      const messageId = action.payload;
      state.messages = state.messages.filter(msg => msg._id !== messageId);
    },

    // Set unread count
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },

    // Clear chat state
    clearChat: (state) => {
      state.conversations = [];
      state.currentConversation = null;
      state.messages = [];
      state.unreadCount = 0;
      state.error = null;
    }
  }
});

export const {
  setLoading,
  setError,
  setConversations,
  addConversation,
  setCurrentConversation,
  setMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  setUnreadCount,
  clearChat
} = chatSlice.actions;

export default chatSlice.reducer;
