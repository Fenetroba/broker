import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { createPromotion, selectPromotionStatus, selectPromotionError, clearError } from '@/store/PromotionSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const userCategories = [
  { id: 'localshop', name: 'Local Shop' },
  { id: 'cityshop', name: 'City Shop' },
  { id: 'guest', name: 'Guest Homepage' }
];

const ProductDisplay = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector(selectPromotionStatus);
  const error = useSelector(selectPromotionError);
  const [activeTab, setActiveTab] = useState('localshop');
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    bannerImage: null,
    userCategory: 'localshop',
    status: 'active'
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'bannerImage' && files && files[0]) {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setFormData(prev => ({
      ...prev,
      userCategory: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.description || !formData.startDate || !formData.endDate || !formData.bannerImage) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      await dispatch(createPromotion(formData)).unwrap();
      toast.success('Promotion created successfully!');
      // Reset form
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        bannerImage: null,
        userCategory: activeTab,
        status: 'active'
      });
      setImagePreview('');
    } catch (error) {
      toast.error(error || 'Failed to create promotion');
    }
  };
  
  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <div className=" py-8">
      <div className="">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Promotion</h1>
          <p className="text-muted-foreground mt-2">
            Add a new promotional offer for your users
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="shadow-sm p-6">
            <CardTitle className="text-xl">Promotion Details</CardTitle>
            <CardDescription>
              Fill in the details for your promotional offer
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Category Tabs */}
              <div className="space-y-4">
                <Label>Display For</Label>
                <Tabs 
                  value={activeTab} 
                  onValueChange={handleTabChange}
                  className="w-full"
                >
                  <TabsList className="grid  w-full grid-cols-3">
                    {userCategories.map((category) => (
                      <TabsTrigger 
                        key={category.id} 
                        value={category.id}
                        className="capitalize shadow-3xl shadow-emerald-700 cursor-pointer bg-[var(two2m)"
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter promotion title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('.')[0]}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate || new Date().toISOString().split('.')[0]}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Banner Image *</Label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-accent/50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Plus className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {formData.bannerImage 
                            ? formData.bannerImage.name 
                            : 'Click to upload banner (1200x400px)'}
                        </p>
                      </div>
                      <Input 
                        type="file" 
                        name="bannerImage"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                        required
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-32 w-auto object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter promotion details, terms, and conditions"
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="min-w-[160px] bg-[var(--two2m)] text-white hover:bg-[var(--two4m)] cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                     
                      Create Promotion
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDisplay;