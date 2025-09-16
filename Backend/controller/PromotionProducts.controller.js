import PromotionProduct from "../model/PromotionProducts.model.js";
import Product from "../model/Products.model.js";
import cloudinary from '../Db/cloudinary.js';
import fs from 'fs';
import "dotenv/config";

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (file) => {
  if (!file) return null;
  
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'promotion-products',
      resource_type: 'auto'
    });
    
    // Remove the temporary file
    fs.unlinkSync(file.path);
    
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    // Clean up temporary file if upload fails
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    return null;
  }
};

// Get all promotional products
const getPromotionalProducts = async (req, res) => {
  try {
    const { status, owner } = req.query;
    
    let query = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Filter by owner if provided
    if (owner) {
      query.owner = owner;
    }
    
    const promotionalProducts = await PromotionProduct.find(query)
      .populate('product', 'name price image category')
      .populate('owner', 'name email role')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: promotionalProducts.length,
      data: promotionalProducts
    });
  } catch (error) {
    console.error('Get Promotional Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get promotional product by ID
const getPromotionalProductById = async (req, res) => {
  try {
    const promotionalProduct = await PromotionProduct.findById(req.params.id)
      .populate('product', 'name price image category description')
      .populate('owner', 'name email role companyName');
    
    if (!promotionalProduct) {
      return res.status(404).json({
        success: false,
        message: 'Promotional product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: promotionalProduct
    });
  } catch (error) {
    console.error('Get Promotional Product By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get active promotional products
const getActivePromotionalProducts = async (req, res) => {
  try {
    const activePromotions = await PromotionProduct.findActivePromotions();
    
    res.status(200).json({
      success: true,
      count: activePromotions.length,
      data: activePromotions
    });
  } catch (error) {
    console.error('Get Active Promotional Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get promotional products by owner
const getPromotionalProductsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    const ownerPromotions = await PromotionProduct.findByOwner(ownerId);
    
    res.status(200).json({
      success: true,
      count: ownerPromotions.length,
      data: ownerPromotions
    });
  } catch (error) {
    console.error('Get Promotional Products By Owner Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create new promotional product
const createPromotionalProduct = async (req, res) => {
  try {
    const { productId, title, description, altText } = req.body;
    
    // Input validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Promotion image is required'
      });
    }
    
    // Verify that the product exists and belongs to the user (or user is admin)
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if user owns the product or is admin
    if (product.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create promotion for this product'
      });
    }
    
    // Upload image to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file);
    if (!imageUrl) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload image'
      });
    }
    
    // Create promotional product
    const promotionalProduct = new PromotionProduct({
      product: productId,
      owner: req.user._id,
      bannerImage: imageUrl,
      title: title || '',
      description: description || '',
      altText: altText || '',
      status: 'active'
    });
    
    const savedPromotion = await promotionalProduct.save();
    
    // Populate the saved promotion with product and owner details
    await savedPromotion.populate([
      { path: 'product', select: 'name price image category' },
      { path: 'owner', select: 'name email role' }
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Promotional product created successfully',
      data: savedPromotion
    });
  } catch (error) {
    console.error('Create Promotional Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create promotional product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update promotional product
const updatePromotionalProduct = async (req, res) => {
  try {
    const { title, description, altText, status } = req.body;
    
    const promotionalProduct = await PromotionProduct.findById(req.params.id);
    
    if (!promotionalProduct) {
      return res.status(404).json({
        success: false,
        message: 'Promotional product not found'
      });
    }
    
    // Check if the user is the owner of the promotional product or is admin
    if (promotionalProduct.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this promotional product'
      });
    }
    
    // Handle image upload if provided
    let imageUrl = promotionalProduct.bannerImage;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file);
      if (!imageUrl) {
        return res.status(500).json({
          success: false,
          message: 'Failed to upload new image'
        });
      }
    }
    
    // Update fields
    promotionalProduct.title = title !== undefined ? title : promotionalProduct.title;
    promotionalProduct.description = description !== undefined ? description : promotionalProduct.description;
    promotionalProduct.altText = altText !== undefined ? altText : promotionalProduct.altText;
    promotionalProduct.status = status !== undefined ? status : promotionalProduct.status;
    promotionalProduct.bannerImage = imageUrl;
    
    const updatedPromotion = await promotionalProduct.save();
    
    // Populate the updated promotion
    await updatedPromotion.populate([
      { path: 'product', select: 'name price image category' },
      { path: 'owner', select: 'name email role' }
    ]);
    
    res.status(200).json({
      success: true,
      message: 'Promotional product updated successfully',
      data: updatedPromotion
    });
  } catch (error) {
    console.error('Update Promotional Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update promotional product',
      error: error.message
    });
  }
};

// Delete promotional product
const deletePromotionalProduct = async (req, res) => {
  try {
    const promotionalProduct = await PromotionProduct.findById(req.params.id);
    
    if (!promotionalProduct) {
      return res.status(404).json({
        success: false,
        message: 'Promotional product not found'
      });
    }
    
    // Check if the user is the owner of the promotional product or is admin
    if (promotionalProduct.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this promotional product'
      });
    }
    
    await promotionalProduct.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Promotional product deleted successfully'
    });
  } catch (error) {
    console.error('Delete Promotional Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Toggle promotional product status
const togglePromotionalProductStatus = async (req, res) => {
  try {
    const promotionalProduct = await PromotionProduct.findById(req.params.id);
    
    if (!promotionalProduct) {
      return res.status(404).json({
        success: false,
        message: 'Promotional product not found'
      });
    }
    
    // Check if the user is the owner of the promotional product or is admin
    if (promotionalProduct.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this promotional product'
      });
    }
    
    // Toggle status
    promotionalProduct.status = promotionalProduct.status === 'active' ? 'inactive' : 'active';
    await promotionalProduct.save();
    
    res.status(200).json({
      success: true,
      message: `Promotional product ${promotionalProduct.status}`,
      data: {
        id: promotionalProduct._id,
        status: promotionalProduct.status
      }
    });
  } catch (error) {
    console.error('Toggle Promotional Product Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get promotional products by product ID
const getPromotionalProductsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const promotionalProducts = await PromotionProduct.find({
      product: productId,
      status: 'active'
    }).populate('owner', 'name email role');
    
    res.status(200).json({
      success: true,
      count: promotionalProducts.length,
      data: promotionalProducts
    });
  } catch (error) {
    console.error('Get Promotional Products By Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

export {
  getPromotionalProducts,
  getPromotionalProductById,
  getActivePromotionalProducts,
  getPromotionalProductsByOwner,
  createPromotionalProduct,
  updatePromotionalProduct,
  deletePromotionalProduct,
  togglePromotionalProductStatus,
  getPromotionalProductsByProduct
};
