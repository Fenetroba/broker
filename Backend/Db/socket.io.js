import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const HttpServer = http.createServer(app);

// Store active users
const activeUsers = new Map();

const io = new Server(HttpServer, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true
    },
    pingTimeout: 10000,
    pingInterval: 5000
});

io.on('connection', (socket) => {
    console.log("User connected:", socket.id);

    // Handle user joining
    socket.on('user_online', (userId) => {
        try {
            if (userId) {
                // Store user's socket ID and user ID
                activeUsers.set(socket.id, userId);
                
                // Join user's personal room
                socket.join(String(userId));
                console.log(`User ${userId} (${socket.id}) is now online`);
                
                // Broadcast to all clients that this user is online
                io.emit('user_status_change', {
                    userId,
                    isOnline: true,
                    lastSeen: new Date()
                });
            }
        } catch (err) {
            console.error('Error in user_online:', err);
        }
    });

    // Handle private messages
    socket.on('private_message', ({ to, message }) => {
        io.to(String(to)).emit('new_message', {
            from: activeUsers.get(socket.id),
            message,
            timestamp: new Date()
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const userId = activeUsers.get(socket.id);
        if (userId) {
            // Remove from active users
            activeUsers.delete(socket.id);
            
            // Check if user has other active connections
            const userHasOtherConnections = Array.from(activeUsers.values())
                .some(id => id === userId);
            
            // Only mark as offline if no other connections exist
            if (!userHasOtherConnections) {
                console.log(`User ${userId} (${socket.id}) is now offline`);
                io.emit('user_status_change', {
                    userId,
                    isOnline: false,
                    lastSeen: new Date()
                });
            }
        }
        console.log("User disconnected:", socket.id);
    });

    // Get all online users
    socket.on('get_online_users', () => {
        const onlineUserIds = Array.from(new Set(activeUsers.values()));
        socket.emit('online_users_list', onlineUserIds);
    });
});

export { io, app, HttpServer };