import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '@/store/Productsice';
import { toast } from 'sonner';
const Create_product = () => {
 const {status}=useSelector((state)=>state.products)
  const dispatch =useDispatch()
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    category: '',
    description: '',
    image: '',
    countInStock: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0] || (e.dataTransfer?.files?.[0]);
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleImageUpload(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('countInStock', formData.countInStock);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      dispatch(createProduct(formDataToSend))
        .unwrap()
        .then(() => {
          toast.success('Product created successfully!');
          // Reset form
          setFormData({
            name: '',
            brand: '',
            price: '',
            category: '',
            description: '',
            image: '',
            countInStock: ''
          });
        })
        .catch((error) => {
          toast.error(error.message || 'Error creating product');
        });
      
    } catch (error) {
      toast.error('Error submitting form: ' + error.message);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-[var(--two2m)] mb-2  hover:bg-green-900 text-[var(--two5m)] cursor-pointer">
        <Plus className="mr-2 h-4 w-4" /> Create Products
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto pb-10 bg-green-50 rounded-2xl flex flex-col items-center">
        <form onSubmit={handleSubmit}>
          <SheetHeader className="pb-4">
            <SheetTitle className="text-3xl font-extrabold text-center">Add New Product</SheetTitle>
            <SheetDescription>
              Fill in the details below to add a new product to your inventory.
            </SheetDescription>
          </SheetHeader>

        <div className="p-6 space-y-6">
          {/* Image Upload with Drag and Drop */}
          <div className="space-y-2">
            <Label htmlFor="image">Product Image *</Label>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('image').click()}
            >
              <div className="space-y-2">
                <svg 
                  className="mx-auto h-12 w-12 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1.5" 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                  />
                </svg>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">
                    {formData.image 
                      ? 'Click to change or drop a new image' 
                      : 'Drag and drop your image here, or click to select'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Only image files are accepted (PNG, JPG, JPEG)
                  </p>
                </div>
                {formData.image && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {formData.image.name}
                    </span>
                  </div>
                )}
              </div>
              <input
                id="image"
                name="image"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                required={!formData.image}
              />
            </div>
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <Label htmlFor="brand">Brand *</Label>
            <Input
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="Enter brand name"
              required
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price *</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="pl-8"
                required
              />
            </div>
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <Label htmlFor="countInStock">Stock *</Label>
            <Input
              id="countInStock"
              name="countInStock"
              type="number"
              value={formData.countInStock}
              onChange={handleInputChange}
              placeholder="Enter stock quantity"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home & Garden</option>
              <option value="beauty">Beauty & Personal Care</option>
              <option value="sports">Sports & Outdoors</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              rows={4}
              required
            />
          </div>

          {/* Image Upload */}
          
        </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-end gap-3 w-full">
              <Button type="button" variant="outline" onClick={() => document.querySelector('[data-radix-popper-content-wrapper] button[aria-label="Close"]')?.click()}>
                Cancel
              </Button>
              <Button type="submit" disabled={status === 'loading'} className=" rounded-2xl bg-[var(--two2m)] text-[var(--two5m)] hover:bg-green-900">
                {status === 'loading' ? (     
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Product'
                )}
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default Create_product