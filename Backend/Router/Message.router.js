import express from 'express';
import { protectRoute } from '../middleware/Auth_user.Middleware.js';
import {
  createMessage,
  getConversationMessages,
  getUserConversations,
  createConversation,
  updateMessage,
  deleteMessage,
  markMessagesAsRead,
  getUnreadCount,
  searchMessages
} from '../controller/Message.controller.js';

const router = express.Router();

// Message routes
router.post('/message', protectRoute, createMessage); // Send a message
router.get('/conversation/:conversationId/messages', protectRoute, getConversationMessages); // Get messages in a conversation
router.patch('/message/:messageId', protectRoute, updateMessage); // Edit a message
router.delete('/message/:messageId', protectRoute, deleteMessage); // Delete a message
router.patch('/conversation/:conversationId/mark-read', protectRoute, markMessagesAsRead); // Mark messages as read
router.get('/messages/unread-count', protectRoute, getUnreadCount); // Get unread message count
router.get('/messages/search', protectRoute, searchMessages); // Search messages

// Conversation routes
router.get('/conversations', protectRoute, getUserConversations); // Get user's conversations
router.post('/conversation', protectRoute, createConversation); // Create a conversation (group/direct)

export default router;
