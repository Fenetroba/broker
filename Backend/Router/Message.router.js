import express from 'express';
import { protectRoute } from '../middleware/Auth_user.Middleware.js';
import {
  createMessage,
  DeletingSingleMessage,
  getDirectMessages,
  getRecentChats,
 
  getUnreadCount,
  searchMessages
} from '../controller/Message.controller.js';

const router = express.Router();

// Message routes
router.post('/message', protectRoute, createMessage); // Send a direct message
router.get('/messages/user/:userId', protectRoute, getDirectMessages); // Get messages between two users

router.get('/messages/unread-count', protectRoute, getUnreadCount); // Get unread message count
router.get('/messages/search', protectRoute, searchMessages); // Search messages

// Chat list route
router.get('/chats', protectRoute, getRecentChats); // Get recent chats for the user
router.delete('/delete/:id', protectRoute, DeletingSingleMessage); // Delete a single message by ID

export default router;
