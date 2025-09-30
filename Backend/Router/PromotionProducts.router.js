import express from "express";
import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
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

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const ensureUploadsDir = async () => {
  const uploadDir = path.join(__dirname, '../uploads/promotion-products');
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
    throw error;
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await ensureUploadsDir();
      cb(null, path.join(__dirname, '../uploads/promotion-products'));
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `promotion-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({ 
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE' 
        ? 'File too large. Max size is 5MB' 
        : err.message || 'File upload failed'
    });
  }
  next();
};

// Image upload route
router.post('/upload-image', upload.single('bannerImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Return the file path or URL
    const imageUrl = `/uploads/promotion-products/${req.file.filename}`;
    res.status(200).json({ 
      success: true, 
      imageUrl,
      message: 'Image uploaded successfully' 
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error uploading image',
      error: error.message 
    });
  }
});

// Public routes
router.get('/', getPromotionalProducts);
router.get('/active', getActivePromotionalProducts);
router.get('/product/:productId', getPromotionalProductsByProduct);
router.get('/:id', getPromotionalProductById);

// Protected routes (require authentication)
router.use(protectRoute);

router.get('/owner/me', getPromotionalProductsByOwner);

router.post(
  '/',
  upload.single('bannerImage'),
  handleUploadError,
  createPromotionalProduct
);

router.put(
  '/:id',
  upload.single('bannerImage'),
  handleUploadError,
  updatePromotionalProduct
);

router.patch('/:id/toggle-status', togglePromotionalProductStatus);
router.delete('/:id', deletePromotionalProduct);

export default router;