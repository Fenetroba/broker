import express from "express";
import multer from "multer";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();

// Import middleware and controllers
import { protectRoute } from "../middleware/Auth_user.Middleware.js";
import {
  getPromotionalProducts,
  getPromotionalProductById,
  getActivePromotionalProducts,
  getPromotionalProductsByOwner,
  createPromotionalProduct,
  updatePromotionalProduct,
  deletePromotionalProduct,
  togglePromotionalProductStatus,
  getPromotionalProductsByProduct
} from "../controller/PromotionProducts.controller.js";

// Get current directory for file uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/promotion-products');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'promotion-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

// ===================
// PUBLIC ROUTES
// ===================

// GET /api/promotional-products - Get all promotional products (with optional filtering)
router.get("/", getPromotionalProducts);

// GET /api/promotional-products/active - Get only active promotional products
router.get("/active", getActivePromotionalProducts);

// GET /api/promotional-products/:id - Get promotional product by ID
router.get("/:id", getPromotionalProductById);

// GET /api/promotional-products/product/:productId - Get promotional products by product ID
router.get("/product/:productId", getPromotionalProductsByProduct);

// GET /api/promotional-products/owner/:ownerId - Get promotional products by owner
router.get("/owner/:ownerId", getPromotionalProductsByOwner);

// ===================
// PROTECTED ROUTES
// ===================

// POST /api/promotional-products - Create new promotional product (requires authentication)
router.post(
  "/", 
  protectRoute, 
  upload.single('bannerImage'), 
  handleUploadError,
  createPromotionalProduct
);

// PUT /api/promotional-products/:id - Update promotional product (requires authentication)
router.put(
  "/:id", 
  protectRoute, 
  upload.single('bannerImage'), 
  handleUploadError,
  updatePromotionalProduct
);

// PATCH /api/promotional-products/:id/toggle - Toggle promotional product status (requires authentication)
router.patch("/:id/toggle", protectRoute, togglePromotionalProductStatus);

// DELETE /api/promotional-products/:id - Delete promotional product (requires authentication)
router.delete("/:id", protectRoute, deletePromotionalProduct);



export default router;
