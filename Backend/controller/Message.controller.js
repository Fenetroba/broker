import Message from '../model/Message.model.js';
import Conversation from '../model/Conversation.model.js';
import AuthUser from '../model/Authusers.model.js';

// Create a new message
export const createMessage = async (req, res) => {
  try {
    const { content, receiverId, conversationId, messageType = 'text' } = req.body;
    const senderId = req.user.id; // From auth middleware

    // Validate required fields
    if (!content || (!receiverId && !conversationId)) return res.status(400).json({
      success: false,
      message: 'Content and either receiverId or conversationId are required'
    });

    let conversation;

    // If conversationId is provided, use existing conversation
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found'
        });
      }

      // Check if sender is a participant
      if (!conversation.participants.includes(senderId)) {
        return res.status(403).json({
          success: false,
          message: 'You are not a participant in this conversation'
        });
      }
    } else {      // Create or find direct conversation
      conversation = await Conversation.findOne({
        type: 'direct',
        participants: { $all: [senderId, receiverId] }
      });

      if (!conversation) {
        // Create new direct conversation
        conversation = new Conversation({
          type: 'direct',
          participants: [senderId, receiverId]
        });
        await conversation.save();
      }
    }

    // Create the message
    const message = new Message({
      content,
      sender: senderId,
      receiver: receiverId || null, // null for group chats
      conversationId: conversation._id,
      messageType
    });

    await message.save();

    // Update conversation's last message
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Populate sender details
    await message.populate('sender', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
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

// Get messages for a conversation
export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 50 } = req.query;

    // Validate conversation exists and user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({
      success: false,
      message: 'Conversation not found'
    });

    if (!conversation.participants.includes(userId)) return res.status(403).json({
      success: false,
      message: 'You are not a participant in this conversation'
    });

    // Get messages with pagination
    const skip = (page - 1) * limit;
    const messages = await Message.find({ conversationId })
      .populate('sender', 'name email avatar')
      .populate('receiver', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Mark messages as read
    await Message.updateMany(
      { 
        conversationId, 
        sender: { $ne: userId },
        isRead: false 
      },
      { $set: { isRead: true } }
    );

    // Get total count for pagination
    const totalMessages = await Message.countDocuments({ conversationId });

    res.status(200).json({
      success: true,
      data: {
        messages: messages.reverse(), // Show oldest first
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalMessages / limit),
          totalMessages,
          hasNext: skip + messages.length < totalMessages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get user's conversations
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const conversations = await Conversation.find({
      participants: userId,
      isActive: true
    })
    .populate('participants', 'name email avatar')
    .populate('lastMessage', 'content sender createdAt')
    .populate('createdBy', 'name email avatar')
    .sort({ lastMessageAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    // Get total count
    const totalConversations = await Conversation.countDocuments({
      participants: userId,
      isActive: true
    });

    res.status(200).json({
      success: true,
      data: {
        conversations,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalConversations / limit),
          totalConversations,
          hasNext: skip + conversations.length < totalConversations,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Create a new conversation (for group chats)
export const createConversation = async (req, res) => {
  try {
    const { name, participants, type = 'direct' } = req.body;
    const createdBy = req.user.id;

    // Validate participants
    if (!participants || participants.length < 1) return res.status(400).json({
      success: false,
      message: 'At least one participant is required'
    });

    // Add creator to participants if not already included
    if (!participants.includes(createdBy)) {
      participants.push(createdBy);
    }

    // Validate all participants exist
    const existingUsers = await AuthUser.find({
      _id: { $in: participants }
    });

    if (existingUsers.length !== participants.length) return res.status(400).json({
      success: false,
      message: 'Some participants do not exist'
    });

    // For direct conversations, check if already exists
    if (type === 'direct' && participants.length === 2) {
      const existingConversation = await Conversation.findOne({
        type: 'direct',
        participants: { $all: participants }
      });

      if (existingConversation) {
        return res.status(400).json({
          success: false,
          message: 'Direct conversation already exists',
          data: existingConversation
        });
      }
    }

    const conversation = new Conversation({
      name,
      type,
      participants,
      createdBy
    });

    await conversation.save();

    await conversation.populate('participants', 'name email avatar');
    await conversation.populate('createdBy', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Conversation created successfully',
      data: conversation
    });

  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update message (edit)
export const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) return res.status(400).json({
      success: false,
      message: 'Content is required'
    });

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({
      success: false,
      message: 'Message not found'
    });

    // Only sender can edit their message
    if (message.sender.toString() !== userId) return res.status(403).json({
      success: false,
      message: 'You can only edit your own messages'
    });

    message.content = content;
    await message.save();

    await message.populate('sender', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Message updated successfully',
      data: message
    });

  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({
      success: false,
      message: 'Message not found'
    });

    // Only sender can delete their message
    if (message.sender.toString() !== userId) return res.status(403).json({
      success: false,
      message: 'You can only delete your own messages'
    });

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({
      success: false,
      message: 'Conversation not found'
    });

    if (!conversation.participants.includes(userId)) return res.status(403).json({
      success: false,
      message: 'You are not a participant in this conversation'
    });

    const result = await Message.updateMany(
      {
        conversationId,
        sender: { $ne: userId },
        isRead: false
      },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} messages marked as read`
    });

  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
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
export const Pictures=async(req,res)=>{

  try {
    const {Pic}=req.body;
   
    const Userid=req.user._id;


    const UploadImgToCloud=await cloudinary.uploader.upload(Pic);

    const UpdateUserProfile=await User.findByIdAndUpdate(Userid,{Pic:UploadImgToCloud.secure_url},{new:true})

    return res.status(200).json({success:true,UpdateUserProfile})
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }

}
