import React, { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductsById, updateProductRating } from '@/store/ProductSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Star } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
// import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const View_details = ({ productId, isOpen, onClose }) => {
  const { currentProduct, status } = useSelector(state => state.products);
  const [internalIsOpen, setIsOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isRating, setIsRating] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (!isOpen || !productId) return;
    dispatch(fetchProductsById(productId));
  }, [isOpen, dispatch, productId]);

  useEffect(() => {
    if (currentProduct?.ratings && user) {
      const userRating = currentProduct.ratings.find(r => r.user === user.id);
      if (userRating) {
        setUserRating(userRating.rating);
      }
    }
  }, [currentProduct, user]);

  const handleRating = async (rating) => {
    if (!user) {
      toast.error('Please login to rate this product');
      return;
    }
    
    try {
      setIsRating(true);
      await dispatch(updateProductRating({ productId, rating })).unwrap();
      await dispatch(fetchProductsById(productId));
      toast.success('Rating submitted successfully');
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error(error.message || 'Failed to submit rating');
    } finally {
      setIsRating(false);
    }
  };

  const renderStars = (rating, interactive = false, size = 'md') => {
    return Array(5).fill(0).map((_, i) => {
      const ratingValue = i + 1;
      const isFilled = ratingValue <= (hoverRating || userRating || rating || 0);
      
      return interactive ? (
        <button
          key={i}
          type="button"
          className={`${size === 'md' ? 'text-2xl' : 'text-lg'} ${
            isFilled ? 'text-yellow-400' : 'text-gray-300'
          } transition-colors focus:outline-none`}
          onMouseEnter={() => setHoverRating(ratingValue)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => handleRating(ratingValue)}
          disabled={isRating}
          aria-label={`Rate ${ratingValue} out of 5`}
        >
          <Star className={`w-5 h-5 ${isFilled ? 'fill-current' : ''}`} />
        </button>
      ) : (
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < Math.floor(rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
        />
      );
    });
  };

  // Use the controlled isOpen prop if provided, otherwise use internal state
  const sheetOpen = isOpen !== undefined ? isOpen : internalIsOpen;
  
  const handleOpenChange = (open) => {
    if (!open && onClose) {
      onClose();
    }
    if (isOpen === undefined) {
      setIsOpen(open);
    }
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={handleOpenChange}>
      <SheetContent 
        side="top" 
        className="w-full max-w-6xl mx-auto h-[90vh] overflow-y-auto bg-white z-[9999]"
        onInteractOutside={(e) => {
          // Prevent closing when clicking on the rating stars
          if (e.target.closest('.rating-stars')) {
            e.preventDefault();
          }
        }}
        // aria-label="Product details"
      >
        {status === 'loading' ? (
          <>
            <SheetHeader>
              <VisuallyHidden asChild>
                <SheetTitle>Loading product details</SheetTitle>
              </VisuallyHidden>
              <VisuallyHidden asChild>
                <SheetDescription>We are fetching the product information.</SheetDescription>
              </VisuallyHidden>
            </SheetHeader>
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--two2m)]" />
            </div>
          </>
        ) : currentProduct ? (
          <div className="max-w-5xl mx-auto p-6">
            <SheetHeader className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <SheetTitle className="text-2xl font-bold text-gray-800">
                    {currentProduct.name}
                  </SheetTitle>
                  <VisuallyHidden asChild>
                    <SheetDescription>Product details for {currentProduct.name}</SheetDescription>
                  </VisuallyHidden>
                  <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                    <span>Category: {currentProduct.category || 'N/A'}</span>
                    <span>•</span>
                    <div className="flex items-center">
                      {renderStars(currentProduct.rating || 0)}
                      <span className="ml-2 text-sm">
                        ({currentProduct.numReviews || 0} {currentProduct.numReviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  </div>
                </div>
                <Badge className={currentProduct.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {currentProduct.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
            </SheetHeader>

            {/* Rating Section */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Rate this product</h3>
              <div className="flex items-center space-x-2">
                <div className="flex rating-stars" onMouseLeave={() => setHoverRating(0)}>
                  {renderStars(0, true, 'lg')}
                </div>
                <span className="text-sm text-gray-600">
                  {userRating ? 'Your rating: ' + userRating + ' stars' : 'Click to rate'}
                </span>
                {isRating && (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin text-gray-500" />
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Image with Zoom Effect */}
              <div className="relative bg-gray-100 rounded-lg overflow-hidden group h-[400px]">
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={currentProduct.image || 'https://via.placeholder.com/500x500?text=No+Image'}
                    alt={currentProduct.name}
                    className="w-full h-full object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-150"
                    style={{
                      transformOrigin: 'center center',
                      willChange: 'transform',
                      maxWidth: '100%',
                      height: 'auto',
                    }}
                    onMouseMove={(e) => {
                      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - left) / width) * 100;
                      const y = ((e.clientY - top) / height) * 100;
                      e.currentTarget.style.transformOrigin = `${x}% ${y}%`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transformOrigin = 'center center';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Product Details */}
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">
                    {currentProduct.description || 'No description available.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold">
                      {currentProduct.price?.toFixed(2) || '0.00'} Birr
                    </span>
                  </div>

                  {currentProduct.countInStock > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available Quantity:</span>
                      <span className="font-medium">{currentProduct.countInStock} units</span>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Additional Information</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Brand: {currentProduct.brand || 'Not specified'}</li>
                      <li>• Product ID: {currentProduct._id || 'N/A'}</li>
                      {currentProduct.createdAt && (
                        <li>• Added on: {new Date(currentProduct.createdAt).toLocaleDateString()}</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {currentProduct.specifications?.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentProduct.specifications.map((spec, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <h4 className="font-medium text-gray-700">{spec.key}</h4>
                      <p className="text-gray-600">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <SheetHeader>
              <VisuallyHidden asChild>
                <SheetTitle>Unable to load product details</SheetTitle>
              </VisuallyHidden>
              <VisuallyHidden asChild>
                <SheetDescription>An error occurred while fetching the product data.</SheetDescription>
              </VisuallyHidden>
            </SheetHeader>
            <div className="text-center py-12">
              <p className="text-gray-500">Unable to load product details.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => dispatch(fetchProductsById(productId))}
              >
                Retry
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
      
 
};

export default View_details;