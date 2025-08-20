import express from 'express';
import { protectRoute, adminOnly } from "../middleware/Auth_user.Middleware.js";
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controller/Order.controller.js";

const router = express.Router();

// All order routes require authentication
router.use(protectRoute);

// Create a new order
// POST /
router.post('/', addOrderItems);

// Get current user's orders
// GET /myorders
router.get('/myorders', getMyOrders);

// Get order by ID
// GET /:id
router.get('/:id', getOrderById);

// Update order payment status
// PUT /:id/pay
router.put('/:id/pay', updateOrderToPaid);

// Admin: mark as delivered
// PUT /:id/deliver
router.put('/:id/deliver', adminOnly, updateOrderToDelivered);

// Admin: get all orders
// GET /
router.get('/', adminOnly, getOrders);

// Admin: update order status
// PUT /:id/status
router.put('/:id/status', adminOnly, updateOrderStatus);

// Admin: delete order
// DELETE /:id
router.delete('/:id', adminOnly, deleteOrder);

export default router;