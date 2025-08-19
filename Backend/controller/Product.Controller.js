import Product from "../model/Products.model.js";
import path from 'path';
import cloudinary from '../Db/cloudinary.js'
import fs from 'fs';    
import "dotenv/config";
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('owner', 'name email');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('owner', 'name email');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


const createProduct = async (req, res) => {
  try {
    const { name, price, category, description, countInStock } = req.body;
    
    // Input validation
    if (!name || !price || !category || !description || countInStock === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Product image is required' });
    }

    // Upload image to Cloudinary
    let imageUrl = '';
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      
      // Remove the temporary file
      fs.unlinkSync(req.file.path);
    } catch (uploadError) {
      console.error('Error uploading to Cloudinary:', uploadError);
      return res.status(500).json({ message: 'Error uploading image', error: uploadError.message });
    }

    const newProduct = new Product({
      name,
      price,
      image: imageUrl,
      category,
      description,
      countInStock,
      rating: 0,
      numReviews: 0,
      owner: req.user._id
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ 
      message: 'Failed to create product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { name, price, image, category, description, countInStock } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if the user is the owner of the product
    if (product.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized to update this product' });
    }
    
    product.name = name || product.name;
    product.price = price || product.price;
    product.image = image || product.image;
    product.category = category || product.category;
    product.description = description || product.description;
    product.countInStock = countInStock || product.countInStock;
    
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if the user is the owner of the product or an admin
    if (product.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized to delete this product' });
    }
    
    await product.deleteOne();
    res.status(200).json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const SearchProduct=async(req,res)=>{
  try {
    
    
  } catch (error) {
    
  }
}
export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
