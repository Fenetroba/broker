import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Upload,
  X,
  Search,
  Calendar,
  Image as ImageIcon,
  Package,
  CheckCircle,
  XCircle
} from 'lucide-react';

import {
  fetchPromotionalProducts,
  createPromotionalProduct,
  updatePromotionalProduct,
  deletePromotionalProduct,
  togglePromotionalProductStatus,
  clearError,
  clearCreateStatus,
  clearUpdateStatus,
  clearDeleteStatus
} from '../../store/PromotionSlice';
import { fetchProducts } from '../../store/ProductSlice';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProductsControlled = () => {
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);
  const {
    items: promotions,
    status,
    error,
    createStatus,
    updateStatus,
    deleteStatus,
    toggleStatus
  } = useSelector((state) => state.promotions);

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    productId: '',
    title: '',
    description: '',
    altText: '',
    bannerImage: null
  });
  const [imagePreview, setImagePreview] = useState('');
  
  const fileInputRef = useRef(null);

  // Load data on component mount
  useEffect(() => {
    dispatch(fetchPromotionalProducts());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle errors and success messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (createStatus === 'succeeded') {
      toast.success('Promotional product created successfully!');
      setIsCreateDialogOpen(false);
      resetForm();
      dispatch(clearCreateStatus());
    }
  }, [createStatus, dispatch]);

  useEffect(() => {
    if (updateStatus === 'succeeded') {
      toast.success('Promotional product updated successfully!');
      setIsEditDialogOpen(false);
      resetForm();
      dispatch(clearUpdateStatus());
    }
  }, [updateStatus, dispatch]);

  useEffect(() => {
    if (deleteStatus === 'succeeded') {
      toast.success('Promotional product deleted successfully!');
      setDeleteDialogOpen(false);
      setPromotionToDelete(null);
      dispatch(clearDeleteStatus());
    }
  }, [deleteStatus, dispatch]);

  useEffect(() => {
    if (toggleStatus === 'succeeded') {
      toast.success('Promotional product status updated!');
      dispatch(clearToggleStatus());
    }
  }, [toggleStatus, dispatch]);

  // Filter promotions based on search and status
  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         promotion.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         promotion.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || promotion.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Form handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }

      setFormData(prev => ({
        ...prev,
        bannerImage: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      title: '',
      description: '',
      altText: '',
      bannerImage: null
    });
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // CRUD operations
  const handleCreate = () => {
    if (!formData.productId || !formData.bannerImage) {
      toast.error('Product selection and image are required');
      return;
    }

    const submitData = new FormData();
    submitData.append('productId', formData.productId);
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('altText', formData.altText);
    submitData.append('bannerImage', formData.bannerImage);

    dispatch(createPromotionalProduct(submitData));
  };

  const handleEdit = (promotion) => {
    setSelectedPromotion(promotion);
    setFormData({
      productId: promotion.product._id,
      title: promotion.title || '',
      description: promotion.description || '',
      altText: promotion.altText || '',
      bannerImage: null
    });
    setImagePreview(promotion.bannerImage || '');
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!formData.productId) {
      toast.error('Product selection is required');
      return;
    }

    const submitData = new FormData();
    submitData.append('productId', formData.productId);
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('altText', formData.altText);
    submitData.append('status', selectedPromotion.status);
    if (formData.bannerImage) {
      submitData.append('bannerImage', formData.bannerImage);
    }

    dispatch(updatePromotionalProduct({ id: selectedPromotion._id, formData: submitData }));
  };

  const handleDelete = (promotion) => {
    setPromotionToDelete(promotion);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deletePromotionalProduct(promotionToDelete._id));
  };

  const handleToggleStatus = (promotion) => {
    dispatch(togglePromotionalProductStatus(promotion._id));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <div className="flex  justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Promotional Products Management</h1>
            <p className="text-gray-600">Manage promotional images for products ({promotions.length} total promotions)</p>
          </div>
          <Dialog  open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Promotion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl  bg-white">
              <DialogHeader>
                <DialogTitle>Create New Promotional Product</DialogTitle>
                <DialogDescription>
                  Upload a promotional image for a product to create a new promotion.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2 ">
                  <Label htmlFor="product">Select Product *</Label>
                  <Select value={formData.productId} onValueChange={(value) => handleInputChange('productId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product._id} value={product._id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={product.image} alt={product.name} />
                              <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{product.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter promotion title"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter promotion description"
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="altText">Alt Text</Label>
                  <Input
                    id="altText"
                    value={formData.altText}
                    onChange={(e) => handleInputChange('altText', e.target.value)}
                    placeholder="Enter alt text for accessibility"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="image">Promotion Image *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image"
                    />
                    <label htmlFor="image" className="cursor-pointer">
                      <div className="text-center">
                        {imagePreview ? (
                          <div className="relative">
                            <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-lg" />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2"
                              onClick={() => {
                                setImagePreview('');
                                setFormData(prev => ({ ...prev, bannerImage: null }));
                                if (fileInputRef.current) fileInputRef.current.value = '';
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Click to upload image</p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={createStatus === 'loading'}>
                  {createStatus === 'loading' ? 'Creating...' : 'Create Promotion'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search promotions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromotions.map((promotion) => (
          <Card key={promotion._id} className="overflow-hidden">
            <div className="relative">
              <img
                src={promotion.bannerImage}
                alt={promotion.altText || promotion.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                {getStatusBadge(promotion.status)}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={promotion.product?.image} alt={promotion.product?.name} />
                  <AvatarFallback><Package className="w-4 h-4" /></AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {promotion.product?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    by {promotion.owner?.name}
                  </p>
                </div>
              </div>
              
              {promotion.title && (
                <h3 className="font-semibold text-gray-900 mb-2">{promotion.title}</h3>
              )}
              
              {promotion.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {promotion.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <Calendar className="w-3 h-3" />
                <span>Created {new Date(promotion.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(promotion)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleStatus(promotion)}
                    disabled={toggleStatus === 'loading'}
                  >
                    {promotion.status === 'active' ? (
                      <ToggleRight className="w-3 h-3 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-3 h-3 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(promotion)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPromotions.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No promotions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first promotional product.'
            }
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Promotional Product</DialogTitle>
            <DialogDescription>
              Update the promotional product details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-product">Select Product *</Label>
              <Select value={formData.productId} onValueChange={(value) => handleInputChange('productId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product._id} value={product._id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={product.image} alt={product.name} />
                          <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{product.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter promotion title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter promotion description"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-altText">Alt Text</Label>
              <Input
                id="edit-altText"
                value={formData.altText}
                onChange={(e) => handleInputChange('altText', e.target.value)}
                placeholder="Enter alt text for accessibility"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-image">Promotion Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="edit-image"
                />
                <label htmlFor="edit-image" className="cursor-pointer">
                  <div className="text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-lg" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2"
                          onClick={() => {
                            setImagePreview('');
                            setFormData(prev => ({ ...prev, bannerImage: null }));
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">Click to upload new image</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB (optional)</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateStatus === 'loading'}>
              {updateStatus === 'loading' ? 'Updating...' : 'Update Promotion'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the promotional product
              "{promotionToDelete?.title || promotionToDelete?.product?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteStatus === 'loading'}
            >
              {deleteStatus === 'loading' ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsControlled;
