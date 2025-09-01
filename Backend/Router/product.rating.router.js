import express from 'express';
import { protectRoute } from '../middleware/Auth_user.Middleware.js';
import Product from '../model/Products.model.js';

const router = express.Router();

// Update product rating
router.post('/:productId/rate', protectRoute, async (req, res) => {
  try {
    const { rating } = req.body;
    const { productId } = req.params;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Please provide a valid rating between 1 and 5' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has already rated
    const existingRatingIndex = product.ratings.findIndex(r => r.user.toString() === userId);
    
    if (existingRatingIndex >= 0) {
      // Update existing rating
      product.ratings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      product.ratings.push({ user: userId, rating });
    }

    // Calculate new average rating
    const totalRatings = product.ratings.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = totalRatings / product.ratings.length;
    
    // Update product with new rating
    product.rating = averageRating;
    product.numReviews = product.ratings.length;

    await product.save();
    
    res.status(200).json({ 
      success: true, 
      averageRating: product.rating,
      numReviews: product.numReviews
    });

  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get product ratings
router.get('/:productId/ratings', async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findById(productId)
      .populate('ratings.user', 'name email')
      .select('ratings rating numReviews');
      
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json({
      success: true,
      ratings: product.ratings,
      averageRating: product.rating,
      numReviews: product.numReviews
    });
    
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
