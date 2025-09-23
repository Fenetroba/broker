import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/Axios';

// Initial state
const initialState = {
  chats: [],         // List of users with recent messages
  currentChat: null, // Currently selected user to chat with
  messages: [],      // Messages in current chat
  loading: false,
  error: null,
  unreadCount: 0
};

/**
 * Fetches recent chats for the logged-in user
 */
export const fetchRecentChats = createAsyncThunk(
  'chat/fetchRecentChats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/chat/chats');
      return response.data?.data?.chats || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to load recent chats');
    }
  }
);

/**
 * Fetches messages between the current user and another user
 */
export const fetchDirectMessages = createAsyncThunk(
  'chat/fetchDirectMessages',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/chat/messages/user/${userId}`);
      return response.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch messages');
    }
  }
);
export const DeleteSingleMessage = createAsyncThunk(
  'chat/deleteSingleMessages',
  async (messageId, { rejectWithValue }) => {
    try {
      await api.delete(`/chat/delete/${messageId}`);
      // return the id so reducer can remove it immediately
      return messageId;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to delete message');
    }
  }
);

// Send a message to a specific user
export const sendDirectMessage = createAsyncThunk(
  'chat/sendDirectMessage',
  async ({ recipientId, content }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/chat/message', { 
        receiverId: recipientId, 
        content 
      });
      return data?.data || data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to send message');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Add a new message to current chat
    addMessage: (state, action) => {
      state.messages.unshift(action.payload);
      
      // Update last message in chats list
      if (state.currentChat) {
        const chat = state.chats.find(c => c._id === action.payload.sender._id || 
                                        c._id === action.payload.receiver._id);
        if (chat) {
          chat.lastMessage = action.payload;
        }
      }
    },
    
    // Set current active chat
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
      // Mark messages as read when opening a chat
      if (action.payload) {
        state.messages.forEach(msg => {
          if (msg.sender._id === action.payload._id && !msg.isRead) {
            msg.isRead = true;
          }
        });
      }
    },
    
    // Clear chat state
    clearChat: (state) => {
      Object.assign(state, initialState);
    } 
  }
  ,
  extraReducers: (builder) => {
    // Handle fetch recent chats
    builder.addCase(fetchRecentChats.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    
    builder.addCase(fetchRecentChats.fulfilled, (state, action) => {
      state.chats = action.payload || [];
      state.loading = false;
    });
    
    builder.addCase(fetchRecentChats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to load recent chats';
    });

    //delete single message
    builder.addCase(DeleteSingleMessage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    
    builder.addCase(DeleteSingleMessage.fulfilled, (state, action) => {
      // action.payload is the deleted messageId
      const deletedId = action.payload;
      state.messages = state.messages.filter(msg => msg._id !== deletedId);
      state.loading = false;
    });
    
    builder.addCase(DeleteSingleMessage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to delete the message';
    });
    
    // Handle fetch direct messages
    builder.addCase(fetchDirectMessages.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    
    builder.addCase(fetchDirectMessages.fulfilled, (state, action) => {
      state.messages = action.payload || [];
      state.loading = false;
    });
    
    builder.addCase(fetchDirectMessages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to load messages';
    });
    
    // Handle send direct message
    builder.addCase(sendDirectMessage.fulfilled, (state, action) => {
      if (action.payload) {
        state.messages.unshift(action.payload);
        
        // Update last message in chats
        const otherUserId = action.payload.receiver._id === state.currentChat?._id ? 
          action.payload.sender._id : action.payload.receiver._id;
          
        const chat = state.chats.find(c => c._id === otherUserId);
        if (chat) {
          chat.lastMessage = action.payload;
        }
      }
    });
  }
});

// Export actions
export const {
  addMessage,
  setCurrentChat,
  clearChat
} = chatSlice.actions;

export default chatSlice.reducer;
