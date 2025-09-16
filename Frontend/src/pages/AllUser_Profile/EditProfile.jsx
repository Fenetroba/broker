import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  IdCard,
  Building,
  Globe,
  List,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { UpdateUserInformation } from "@/store/AuthSlice";

const EditProfile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  const nationalIdRef = useRef(null);
  const taskLicenceRef = useRef(null);

  const [userData, setUserData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profilePic: user?.profilePic || "",
    address: user?.address || "",
    phone: user?.phone || "",
    companyName: user?.companyName || "",
    companyWebsite: user?.companyWebsite || "",
    businessRegistrationNO: user?.businessRegistrationNO || "",
    taskLicence: user?.TaskLicence || "",
    nationalId: user?.NationalId || "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!userData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    
    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!userData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(userData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (userData.companyWebsite && !/^https?:\/\/.+/.test(userData.companyWebsite)) {
      newErrors.companyWebsite = "Please enter a valid website URL (starting with http:// or https://)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Handle file input change
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      setUserData(prev => ({
        ...prev,
        [fieldName]: file
      }));

      // For profile picture preview
      if (fieldName === 'profilePic') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUserData(prev => ({
            ...prev,
            profilePicPreview: reader.result
          }));
        };
        reader.readAsDataURL(file);
      }
      
      // Clear any existing errors for this field
      if (errors[fieldName]) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: undefined
        }));
      }
    }
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Add all form fields to formData
      Object.keys(userData).forEach(key => {
        // Skip preview data
        if (key === 'profilePicPreview') return;
        
        // Handle file uploads - use correct field names for backend
        if (key === 'profilePic' || key === 'taskLicence' || key === 'nationalId') {
          if (userData[key] instanceof File) {
            // Map frontend field names to backend field names
            const backendFieldName = key === 'taskLicence' ? 'taskLicence' : 
                                   key === 'nationalId' ? 'nationalId' : 'profilePic';
            formData.append(backendFieldName, userData[key]);
          }
        } else {
          // Add other fields
          formData.append(key, userData[key] || '');
        }
      });
      
      // Dispatch the action with formData
      const resultAction = await dispatch(UpdateUserInformation({ 
        formData, 
        config: { 
          headers: { 
            'Content-Type': 'multipart/form-data' 
          } 
        } 
      }));
      
      if (UpdateUserInformation.fulfilled.match(resultAction)) {
        // Handle success
        toast.success('Profile updated successfully!');
        // Clear any existing errors
        setErrors({});
      } else if (UpdateUserInformation.rejected.match(resultAction)) {
        // Handle error
        const errorMessage = resultAction.error?.message || resultAction.payload?.message || 'Failed to update profile';
        toast.error(errorMessage);
        
        // Set field-specific errors if available
        if (resultAction.error?.field) {
          setErrors({ [resultAction.error.field]: errorMessage });
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating the profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[var(--two5m)] py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4 p-6  bg-[var(--two2m)] rounded-2xl">
                  <div className="relative">
                    <Avatar className="h-24 w-24 bg-gradient-to-br from-green-400 to-blue-400 border-4 border-white shadow-lg">
                      <AvatarImage 
                        src={userData.profilePicPreview || userData.profilePic} 
                        alt={userData.name} 
                      />
                      <AvatarFallback className="text-2xl font-bold">
                        {userData.name ? userData.name.split(' ').map(n => n[0]).join('') : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2">
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 w-8 rounded-full bg-green-500 hover:bg-green-600 p-0"
                        onClick={() =>
                          fileInputRef.current && fileInputRef.current.click()
                        }
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-center  ">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full px-6 bg-green-50"
                      onClick={() =>
                        fileInputRef.current && fileInputRef.current.click()
                      }
                    >
                      Change Profile Picture
                    </Button>
                    <Input
                      type="file"
                      name="profilePic"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={(e) => handleFileChange(e, 'profilePic')}
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      name="name"
                      type="text"
                      value={userData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`rounded-xl border-gray-400 focus:border-green-200 focus:ring-green-100 h-12 ${
                        errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <div className="flex items-center gap-1 text-red-500 text-sm">
                        <AlertCircle className="h-3 w-3" />
                        {errors.name}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`rounded-xl border-gray-400 focus:border-green-500 focus:ring-green-500 h-12 ${
                        errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <div className="flex items-center gap-1 text-red-500 text-sm">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`rounded-xl border-gray-400 focus:border-green-500 focus:ring-green-500 h-12 ${
                        errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <div className="flex items-center gap-1 text-red-500 text-sm">
                        <AlertCircle className="h-3 w-3" />
                        {errors.phone}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="nationalId"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <IdCard className="h-4 w-4" />
                      National ID
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="nationalId"
                        type="file"
                        name="nationalId"
                        accept="image/*"
                        ref={nationalIdRef}
                        className="rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 h-12"
                        onChange={(e) => handleFileChange(e, 'nationalId')}
                      />
                      {userData.nationalId && typeof userData.nationalId === 'string' && (
                        <div className="text-sm text-gray-600">
                          Current: <span className="font-medium">Uploaded</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Upload a clear image of your National ID (Max 5MB)</p>
                  </div>
                  {/* Company Information - Only show for non-admin users */}
                  {user?.role !== 'admin' && (
                    <>
                      {/* Company Name */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="companyName"
                          className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                        >
                          <Building className="h-4 w-4" />
                          Company Name
                        </Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          type="text"
                          value={userData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          className="rounded-xl border-gray-400 focus:border-green-500 focus:ring-green-500 h-12"
                          placeholder="Enter your Company Name (Optional)"
                        />
                      </div>

                      {/* Company Website Link */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="companyWebsite"
                          className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                        >
                          <Globe className="h-4 w-4" />
                          Company Website Link
                          <span className="text-gray-500 font-normal">(Optional)</span>
                        </Label>
                        <Input
                          id="companyWebsite"
                          name="companyWebsite"
                          type="url"
                          value={userData.companyWebsite}
                          onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                          className={`rounded-xl border-gray-400 focus:border-green-500 focus:ring-green-500 h-12 ${
                            errors.companyWebsite ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
                          }`}
                          placeholder="https://example.com"
                        />
                        {errors.companyWebsite && (
                          <div className="flex items-center gap-1 text-red-500 text-sm">
                            <AlertCircle className="h-3 w-3" />
                            {errors.companyWebsite}
                          </div>
                        )}
                      </div>

                      {/* Business Registration Number */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="businessRegistrationNO"
                          className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                        >
                          <List className="h-4 w-4" />
                          Business Registration Number
                          <span className="text-gray-500 font-normal">(Optional)</span>
                        </Label>
                        <Input
                          id="businessRegistrationNO"
                          name="businessRegistrationNO"
                          type="text"
                          value={userData.businessRegistrationNO}
                          onChange={(e) => handleInputChange('businessRegistrationNO', e.target.value)}
                          className="rounded-xl border-gray-400 focus:border-green-500 focus:ring-green-500 h-12"
                          placeholder="Enter business registration number"
                        />
                      </div>

                      {/* Task Licence */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="taskLicence"
                          className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                        >
                          <List className="h-4 w-4" />
                          Task Licence
                          <span className="text-gray-500 font-normal">(Optional)</span>
                        </Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id="taskLicence"
                            type="file"
                            name="taskLicence"
                            accept="image/*"
                            ref={taskLicenceRef}
                            className="rounded-xl border-gray-400 focus:border-green-500 focus:ring-green-500 h-12"
                            onChange={(e) => handleFileChange(e, 'taskLicence')}
                          />
                          {userData.taskLicence && typeof userData.taskLicence === 'string' && (
                            <div className="text-sm text-gray-600">
                              Current: <span className="font-medium">Uploaded</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">Upload a clear image of your Task Licence (Max 5MB)</p>
                      </div>
                    </>
                  )}

                  {/* Location */}
                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="address"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      Location
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      name="address"
                      value={userData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 h-12"
                      placeholder="Enter your location"
                    />
                  </div>
               
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full px-8 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                    onClick={() => window.history.back()}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-full px-8 py-2 bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
                    disabled={!userData.name || !userData.email || !userData.phone || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EditProfile;
