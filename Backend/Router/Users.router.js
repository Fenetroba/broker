import express from "express";
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  toggleUserStatus, 
  searchUsers, 
  getUsersByRole 
} from "../controller/Users.js";
import { protectRoute } from "../middleware/Auth_user.Middleware.js";

const router = express.Router();

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superAdmin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required."
    });
  }
};

// Apply authentication and admin check to all routes
router.use(protectRoute);
router.use(adminOnly);

// User management routes
router.get("/", getAllUsers);                    // GET /api/users - Get all users
router.get("/search", searchUsers);              // GET /api/users/search?query=... - Search users
router.get("/role/:role", getUsersByRole);       // GET /api/users/role/:role - Get users by role
router.get("/:id", getUserById);                 // GET /api/users/:id - Get user by ID
router.put("/:id", updateUser);                  // PUT /api/users/:id - Update user
router.delete("/:id", deleteUser);               // DELETE /api/users/:id - Delete user
router.patch("/:id/toggle-status", toggleUserStatus); // PATCH /api/users/:id/toggle-status - Toggle user status

export default router;
