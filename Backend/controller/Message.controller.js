import Message from '../model/Message.model.js';
import AuthUser from '../model/Authusers.model.js';
import "dotenv/config";
import mongoose from 'mongoose';
// Create a new direct message
export const createMessage = async (req, res) => {
  try {
    const { content, receiverId, messageType = 'text' } = req.body;
    const senderId = req.user.id; // From auth middleware

    // Validate required fields
    if (!content || !receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Content and receiverId are required'
      });
    }

    // Check if receiver exists
    const receiver = await AuthUser.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    // Create and save the message
    const message = new Message({
      content,
      sender: senderId,
      receiver: receiverId,
      messageType
    });

    await message.save();

    // Populate sender and receiver details for the response
    await message.populate([
      { path: 'sender', select: 'name email avatar' },
      { path: 'receiver', select: 'name email avatar' }
    ]);

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get recent chats for a user
export const getRecentChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Get distinct users the current user has chatted with
    const userMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userObjectId },
            { receiver: userObjectId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userObjectId] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'authusers',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: '$user._id',
          name: '$user.name',
          email: '$user.email',
          avatar: '$user.avatar',
          lastMessage: 1,
          unreadCount: { $literal: 0 } // You can add unread count logic if needed
        }
      }
    ]);

    // Get total count of distinct counterpart users
    const totalAgg = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userObjectId },
            { receiver: userObjectId }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userObjectId] },
              '$receiver',
              '$sender'
            ]
          }
        }
      },
      { $count: 'count' }
    ]);
    const totalChats = totalAgg?.[0]?.count || 0;

    res.status(200).json({
      success: true,
      data: {
        chats: userMessages,
        total: totalChats,
        page: parseInt(page),
        totalPages: Math.ceil(totalChats / limit)
      }
    });
  } catch (error) {
    console.error('Error getting recent chats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recent chats'
    });
  }
};

// Get messages between two users
export const getDirectMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // Get messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'name email avatar')
    .populate('receiver', 'name email avatar');

    // Mark received messages as read
    await Message.updateMany(
      { 
        sender: userId,
        receiver: currentUserId,
        isRead: false 
      },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error getting direct messages:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching messages'
    });
  }
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCount = await Message.countDocuments({
      receiver: userId,
      isRead: false
    });

    res.status(200).json({
      success: true,
      data: { unreadCount }
    });

  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Search messages
export const searchMessages = async (req, res) => {
  try {
    const { query, conversationId } = req.query;
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    if (!query) return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });

    const skip = (page - 1) * limit;
    const searchFilter = {
      $or: [
        { content: { $regex: query, $options: 'i' } },
        { sender: { $in: [userId] } } // Search by sender if query is a username
      ]
    };

    // If conversationId is provided, search within that conversation
    if (conversationId) {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation || !conversation.participants.includes(userId)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
      searchFilter.conversationId = conversationId;
    } else {      // Search in all conversations where user is a participant
      const userConversations = await Conversation.find({
        participants: userId
      });
      const conversationIds = userConversations.map(c => c._id);
      searchFilter.conversationId = { $in: conversationIds };
    }

    const messages = await Message.find(searchFilter)
      .populate('sender', 'name email avatar')
      .populate('conversationId', 'name type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalResults = await Message.countDocuments(searchFilter);

    res.status(200).json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalResults / limit),
          totalResults,
          hasNext: skip + messages.length < totalResults,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error searching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
