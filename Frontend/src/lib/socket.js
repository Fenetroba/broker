import { io } from 'socket.io-client';

// Create a singleton Socket.IO client
let socket;

// Track online status
let isConnected = false;
let connectListeners = [];
let disconnectListeners = [];

const setupSocketListeners = (getState) => {
  if (!socket) return;

  socket.on('connect', () => {
    console.log('Socket connected');
    isConnected = true;
    
    // Notify all connect listeners
    connectListeners.forEach(callback => callback());
    
    // Re-authenticate if we have a user
    try {
      const state = getState();
      if (state?.auth?.user?._id) {
        socket.emit('user_online', state.auth.user._id);
      }
    } catch (error) {
      console.error('Error getting auth state:', error);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    isConnected = false;
    
    // Notify all disconnect listeners
    disconnectListeners.forEach(callback => callback(reason));
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  // Handle user status changes
  socket.on('user_status_change', (data) => {
    const { dispatch } = store;
    dispatch({
      type: 'chat/updateUserStatus',
      payload: {
        userId: data.userId,
        isOnline: data.isOnline,
        lastSeen: data.lastSeen
      }
    });
  });
};

export function getSocket(getState) {
  if (!socket) {
    socket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });
    
    if (getState && typeof getState === 'function') {
      setupSocketListeners(getState);
    } else {
      console.warn('getState function not provided to getSocket');
    }
  }
  
  return socket;
}

export function addConnectListener(callback) {
  if (typeof callback === 'function') {
    connectListeners.push(callback);
    
    // If already connected, call the callback immediately
    if (isConnected) {
      callback();
    }
  }
  
  // Return cleanup function
  return () => {
    connectListeners = connectListeners.filter(cb => cb !== callback);
  };
}

export function addDisconnectListener(callback) {
  if (typeof callback === 'function') {
    disconnectListeners.push(callback);
  }
  
  // Return cleanup function
  return () => {
    disconnectListeners = disconnectListeners.filter(cb => cb !== callback);
  };
}

export function isSocketConnected() {
  return isConnected && socket?.connected;
}

export function notifyUserOnline(userId) {
  if (socket?.connected && userId) {
    socket.emit('user_online', userId);
  }
}

export function getOnlineUsers(callback) {
  if (socket?.connected && typeof callback === 'function') {
    socket.emit('get_online_users');
    socket.once('online_users_list', callback);
  }
}

export default getSocket;
