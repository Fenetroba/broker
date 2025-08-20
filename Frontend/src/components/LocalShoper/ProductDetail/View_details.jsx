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
import { fetchProductsById } from '@/store/ProductSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const View_details = ({ productId }) => {
  const { currentProduct, status } = useSelector(state => state.products);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
  
      dispatch(fetchProductsById(productId));
    
  }, [isOpen, dispatch, productId]);

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`text-${i < Math.floor(rating || 0) ? 'yellow-400' : 'gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-[70%] text-xs h-8 cursor-pointer hover:bg-[var(--two3m)]"
        >
          View Details
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="top" 
        className="w-full max-w-6xl mx-auto h-[90vh] overflow-y-auto bg-white"
        aria-label="Product details"
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
                      <span className="ml-2">({currentProduct.numReviews || 0} reviews)</span>
                    </div>
                  </div>
                </div>
                <Badge className={currentProduct.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {currentProduct.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
            </SheetHeader>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={currentProduct.image || 'https://via.placeholder.com/500x500?text=No+Image'}
                  alt={currentProduct.name}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                  }}
                />
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
                      ${currentProduct.price?.toFixed(2) || '0.00'}
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