import { io } from 'socket.io-client';

// Create a singleton Socket.IO client
let socket;

export function getSocket() {
  if (!socket) {
    socket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

export default getSocket;
