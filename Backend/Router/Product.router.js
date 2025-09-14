import express from "express";
import multer from "multer";
import path from 'path';
const router = express.Router();
import { protectRoute } from "../middleware/Auth_user.Middleware.js";
import { createProduct, getProductById, getProducts, updateProduct, deleteProduct,likeProduct } from "../controller/Product.Controller.js";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
    }
  }
});

// Create uploads directory if it doesn't exist
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Protect routes that require authentication
router.post("/create-product", protectRoute, upload.single('image'), createProduct);
router.get("/get-products" ,getProducts)
router.get("/get-product/:id",getProductById)
router.put("/update-product/:id",protectRoute,updateProduct)
router.delete("/delete-product/:id",protectRoute,deleteProduct)
router.put("/like-product/:id" ,likeProduct)

export default router
