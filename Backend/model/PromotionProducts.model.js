import mongoose from "mongoose";

const promotionProductSchema = new mongoose.Schema({
  // Reference to the product being promoted
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product reference is required']
  },
  
  // Reference to the shop owner who created the promotion
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner reference is required']
  },
  
  // Promotion banner image
  bannerImage: {
    type: String,
    required: [true, 'Promotion image is required']
  },
  
  // Optional title for the promotion
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
    default: ''
  },
  
  // Optional description for the promotion
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  
  // Promotion status
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  

}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Simple index for better query performance
promotionProductSchema.index({ product: 1, status: 1 });
promotionProductSchema.index({ owner: 1, status: 1 });

// Static method to find active promotional images
promotionProductSchema.statics.findActivePromotions = function() {
  return this.find({
    status: 'active'
  }).populate('product owner');
};

// Static method to find promotions by owner
promotionProductSchema.statics.findByOwner = function(ownerId) {
  return this.find({
    owner: ownerId
  }).populate('product');
};

const PromotionProduct = mongoose.model('PromotionProduct', promotionProductSchema);

export default PromotionProduct;