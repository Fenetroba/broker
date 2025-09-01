import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  // Message content
  content: {
    type: String,
   
  },
   pic:{
    type:String

   },
  // Sender (user who sent the message)
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Receiver (user who receives the message)
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Message status
  isRead: {
    type: Boolean,
    default: false
  },

  
  // Message type (text, order, business)
  messageType: {
    type: String,
    enum: ['text', 'order', 'business'],
    default: 'text'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

const Message = mongoose.model('Message', messageSchema);

export default Message;