import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/Axios';
import { notifyUserOnline, addConnectListener } from '@/lib/socket';

// Helper function to update user status in chats array
const updateChatUserStatus = (chats, userId, isOnline, lastSeen) => {
  return chats.map(chat => {
    if (chat.user?._id === userId || chat._id === userId) {
      return {
        ...chat,
        user: {
          ...chat.user,
          isOnline,
          lastSeen: isOnline ? null : lastSeen || new Date().toISOString()
        }
      };
    }
    return chat;
  });
};

// Initial state
const initialState = {
  chats: [],         // List of users with recent messages
  currentChat: null, // Currently selected user to chat with
  messages: [],      // Messages in current chat
  loading: false,
  error: null,
  unreadCount: 0,
  onlineUsers: new Set(), // Set of user IDs that are currently online
  userStatuses: {}, // Map of user IDs to their status { isOnline, lastSeen }
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
    addMessage(state, action) {
      // Add a new message to current chat
      const { message } = action.payload;
      state.messages.push(message);
      
      // Update last message in chats list
      state.chats = state.chats.map(chat => {
        if (chat._id === message.sender || chat._id === message.recipient) {
          return {
            ...chat,
            lastMessage: message.content,
            lastMessageAt: message.createdAt
          };
        }
        return chat;
      });
    },
    
    setCurrentChat(state, action) {
      // Set current active chat
      const userId = action.payload;
      state.currentChat = userId;
      
      // Mark messages as read
      state.messages = state.messages.map(msg => ({
        ...msg,
        isRead: true
      }));
    },
    
    clearChat(state) {
      // Clear chat state
      state.currentChat = null;
      state.messages = [];
    },
    
    // Update user online status
    updateUserStatus(state, action) {
      const { userId, isOnline, lastSeen } = action.payload;
      
      // Update user statuses
      state.userStatuses = {
        ...state.userStatuses,
        [userId]: {
          isOnline,
          lastSeen: lastSeen || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
      
      // Update online users set
      if (isOnline) {
        state.onlineUsers.add(userId);
      } else {
        state.onlineUsers.delete(userId);
      }
      
      // Update status in chats
      state.chats = updateChatUserStatus(state.chats, userId, isOnline, lastSeen);
      
      // Update current chat user status if needed
      if (state.currentChat && 
          (state.currentChat._id === userId || state.currentChat === userId)) {
        state.currentChat = {
          ...state.currentChat,
          isOnline,
          lastSeen: isOnline ? null : (lastSeen || new Date().toISOString())
        };
      }
    },
    
    // Initialize socket listeners
    initializeSocketListeners(state, action) {
      const { userId } = action.payload;
      if (userId) {
        // Notify server that user is online
        notifyUserOnline(userId);
        
        // Set up listener for reconnection
        addConnectListener(() => {
          notifyUserOnline(userId);
        });
      }
    },
    
    // Update multiple users' status
    updateUsersStatus(state, action) {
      const { users } = action.payload;
      if (!Array.isArray(users)) return;
      
      users.forEach(user => {
        if (user && user._id) {
          state.userStatuses[user._id] = {
            isOnline: user.isOnline || false,
            lastSeen: user.lastSeen || null,
            updatedAt: new Date().toISOString()
          };
          
          if (user.isOnline) {
            state.onlineUsers.add(user._id);
          } else {
            state.onlineUsers.delete(user._id);
          }
          
          // Update status in chats
          state.chats = updateChatUserStatus(
            state.chats, 
            user._id, 
            user.isOnline, 
            user.lastSeen
          );
        }
      });
    }
  },
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
