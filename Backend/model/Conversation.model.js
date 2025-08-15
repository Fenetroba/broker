import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  // Conversation name (for group chats)
  name: {
    type: String,
    trim: true
  },

  // Conversation type (direct, group)
  type: {
    type: String,
    enum: ['direct', 'group'],
    default: 'direct'
  },

  // Participants in the conversation
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser',
    required: true
  }],

  // Last message in the conversation
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },

  // Last message timestamp
  lastMessageAt: {
    type: Date,
    default: Date.now
  },

  // Conversation status
  isActive: {
    type: Boolean,
    default: true
  },

  // Created by (for group chats)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser'
  }
}, {
  timestamps: true
});

// Pre-save middleware to validate participants
conversationSchema.pre('save', function(next) {
  // Direct conversations must have exactly 2 participants
  if (this.type === 'direct' && this.participants.length !== 2) {
    return next(new Error('Direct conversations must have exactly 2 participants'));
  }

  // Group conversations must have at least 2 participants
  if (this.type === 'group' && this.participants.length < 2) {
    return next(new Error('Group conversations must have at least 2 participants'));
  }

  // Set default name for group conversations
  if (this.type === 'group' && !this.name) {
    this.name = `Group ${this.participants.length} members`;
  }

  next();
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;