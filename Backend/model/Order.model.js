import  mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    required: true,
    enum: ['PayPal', 'Stripe', 'CashOnDelivery']
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

// Calculate total price before saving
orderSchema.pre('save', function(next) {
  // Calculate items price
  this.itemsPrice = this.orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Calculate shipping price (example: free shipping over $100, otherwise $10)
  this.shippingPrice = this.itemsPrice > 100 ? 0 : 10;
  
  // Calculate tax (example: 10% tax)
  this.taxPrice = parseFloat((0.1 * this.itemsPrice).toFixed(2));
  
  // Calculate total price
  this.totalPrice = this.itemsPrice + this.shippingPrice + this.taxPrice;
  
  next();
});

// Add method to update order status
orderSchema.methods.updateStatus = async function(newStatus) {
  if (newStatus === 'Delivered') {
    this.isDelivered = true;
    this.deliveredAt = Date.now();
  }
  this.status = newStatus;
  return this.save();
};

const Order = mongoose.model('Order', orderSchema);

export default Order;