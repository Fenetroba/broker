import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { createPromotionalProduct, selectPromotionsStatus } from '@/store/PromotionSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const userCategories = [
  { id: 'localshop', name: 'Local Shop' },
  { id: 'cityshop', name: 'City Shop' },
  { id: 'guest', name: 'Guest Homepage' }
];

const ProductDisplay = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector(selectPromotionsStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('localshop');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
    bannerImage: null,
    userCategory: 'localshop'
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setFormData(prev => ({
      ...prev,
      userCategory: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      const resultAction = await dispatch(createPromotionalProduct(formDataToSend));
      
      if (createPromotionalProduct.fulfilled.match(resultAction)) {
        toast.success("Promotional product created successfully!");
        navigate('/admin/promotions');
      }
    } catch (error) {
      toast.error(error.message || "Failed to create promotional product");
    } finally {
      setIsLoading(false);
    }
  };

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
                        className="capitalize shadow-2xl cursor-pointer"
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Summer Sale"
                    className="bg-background"
                    required
                  />
                </div>

                {/* Discount Percentage */}
                <div className="space-y-2">
                  <Label htmlFor="discountPercentage">Discount Percentage *</Label>
                  <div className="relative">
                    <Input
                      id="discountPercentage"
                      name="discountPercentage"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.discountPercentage}
                      onChange={handleChange}
                      placeholder="e.g., 20"
                      className="pl-8 bg-background"
                      required
                    />
                    <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">%</span>
                  </div>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-background"
                    required
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    className="bg-background"
                    required
                  />
                </div>
              </div>

              {/* Banner Image */}
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
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter promotion details, terms, and conditions"
                  rows={4}
                  className="bg-background"
                />
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
                  className="min-w-[160px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
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