import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const PromotionForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  promotion = null, 
  products = [],
  loading = false
}) => {
  
  const [formData, setFormData] = useState({
    productId: '',
    title: '',
    description: '',
    altText: '',
    bannerImage: null,
    bannerImagePreview: null
  });

  // Set form data when editing
  useEffect(() => {
    if (promotion) {
      setFormData({
        productId: promotion.product?._id || '',
        title: promotion.title || '',
        description: promotion.description || '',
        altText: promotion.altText || '',
        bannerImage: null,
        bannerImagePreview: promotion.bannerImage || null
      });
    } else {
      setFormData({
        productId: '',
        title: '',
        description: '',
        altText: '',
        bannerImage: null,
        bannerImagePreview: null
      });
    }
  }, [promotion, isOpen]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'bannerImage' && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          bannerImage: file,
          bannerImagePreview: reader.result
        }));
      };
      
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.productId) {
      toast.error('Please select a product');
      return;
    }
    
    if (!formData.bannerImage && !formData.bannerImagePreview) {
      toast.error('Please select an image for the promotion');
      return;
    }
    
    // Prepare form data for submission
    const submissionData = new FormData();
    submissionData.append('productId', formData.productId);
    submissionData.append('title', formData.title);
    submissionData.append('description', formData.description);
    submissionData.append('altText', formData.altText);
    
    // Only append bannerImage if it's a new file
    if (formData.bannerImage) {
      submissionData.append('bannerImage', formData.bannerImage);
    }
    
    try {
      await onSubmit(submissionData);
    } catch (error) {
      console.error('Error submitting promotion:', error);
      toast.error(error.message || 'Failed to save promotion');
    }
  };

  if (!isOpen) return null;
  
  // Get selected product for display
  const selectedProduct = products.find(p => p._id === formData.productId);

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          bannerImage: file,
          bannerImagePreview: reader.result
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {promotion ? 'Edit Promotion' : 'Create New Promotion'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {promotion ? 'Update the promotion details below' : 'Fill in the details to create a new promotion'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              disabled={loading}
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Selection */}
            <div>
              <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
                Product <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="productId"
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={loading || products.length === 0}
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                {products.length === 0 && (
                  <p className="mt-1 text-sm text-yellow-600">
                    No products available. Please add products first.
                  </p>
                )}
                {selectedProduct && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-700">Selected Product:</p>
                    <p className="text-sm text-gray-600">{selectedProduct.name}</p>
                    <p className="text-xs text-gray-500">Price: ${selectedProduct.price?.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
            
            {/* Alt Text */}
            <div>
              <label htmlFor="altText" className="block text-sm font-medium text-gray-700 mb-1">
                Image Alt Text
              </label>
              <input
                type="text"
                id="altText"
                name="altText"
                value={formData.altText}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Description for screen readers"
                disabled={loading}
              />
            </div>
            
            {/* Banner Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Image <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <div 
                  className={`relative group border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                    loading ? 'border-gray-200 bg-gray-50' : 'border-gray-300 hover:border-blue-400 bg-white'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {formData.bannerImagePreview ? (
                    <div className="relative">
                      <div className="relative group">
                        <img
                          src={formData.bannerImagePreview}
                          alt={formData.altText || 'Promotion banner'}
                          className="max-h-64 w-full object-contain rounded-md"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center rounded-md">
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <label 
                              className="cursor-pointer p-2 bg-white bg-opacity-90 rounded-full shadow-md hover:bg-opacity-100 transition-all"
                              title="Change image"
                            >
                              <Upload className="h-5 w-5 text-gray-700" />
                              <input
                                id="bannerImage"
                                name="bannerImage"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleChange}
                                disabled={loading}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                bannerImage: null,
                                bannerImagePreview: null
                              }))}
                              className="p-2 bg-white bg-opacity-90 rounded-full shadow-md hover:bg-opacity-100 transition-all"
                              title="Remove image"
                              disabled={loading}
                            >
                              <X className="h-5 w-5 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex flex-col sm:flex-row justify-center items-center text-sm text-gray-600">
                        <label
                          htmlFor="bannerImage"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span className="whitespace-nowrap">Upload a file</span>
                          <input
                            id="bannerImage"
                            name="bannerImage"
                            type="file"
                            className="sr-only"
                            onChange={handleChange}
                            accept="image/*"
                            disabled={loading}
                          />
                        </label>
                        <p className="mx-2 text-gray-500 hidden sm:block">or</p>
                        <p className="text-gray-500">drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="relative px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200 inline-flex items-center justify-center"
                disabled={loading || products.length === 0}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    {promotion ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{promotion ? 'Update Promotion' : 'Create Promotion'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PromotionForm;
