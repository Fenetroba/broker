import React, { useRef } from "react";
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
import { Camera, User, Mail, Phone, MapPin, IdCard, Building, Globe, List } from "lucide-react";

const sampleUser = {
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  username: "johndoe",
  email: "john.doe@example.com",
  fullName: "John Doe",
  phone: "+1 555-123-4567",
  location: "San Francisco, CA",
};

const EditProfile = () => {
  const fileInputRef = useRef(null);

  return (
    <section className="min-h-screen bg-[var(--two5m)] py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">

          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
          
            
            <CardContent className="p-8">
              <form className="space-y-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4 p-6  bg-[var(--two2m)] rounded-2xl">
                  <div className="relative">
                    <Avatar className="h-24 w-24 bg-gradient-to-br from-green-400 to-blue-400 border-4 border-white shadow-lg">
                      <AvatarImage src={sampleUser.avatar} alt={sampleUser.username} />
                      <AvatarFallback className="text-2xl font-bold">
                        {sampleUser.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2">
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 w-8 rounded-full bg-green-500 hover:bg-green-600 p-0"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
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
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      Change Profile Picture
                    </Button>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      defaultValue={sampleUser.fullName}
                      className="rounded-xl border-gray-400 focus:border-green-200 focus:ring-green-100 h-12"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      defaultValue={sampleUser.username}
                      className="rounded-xl border-gray-400 focus:border-green-500 focus:ring-green-500 h-12"
                      placeholder="Enter your username"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={sampleUser.email}
                      className="rounded-xl border-gray-400 focus:border-green-500 focus:ring-green-500 h-12"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Phone */}
                 
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="text"
                      defaultValue={sampleUser.phone}
                      className="rounded-xl border-gray-400 focus:border-green-500 focus:ring-green-500 h-12"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {/*              Company Name */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Company Name
                    </Label>
                    <Input
                      id="Company_Name"
                      type="text"
                      defaultValue=""
                      className="rounded-xl border-gray-400 focus:border-green-500 focus:ring-green-500 h-12"
                      placeholder="Enter your Company Name (Optional)"
                    />
                  </div>
                  {/*  Company Website Link */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Company Website Link <p className="font-bold">(Optional)</p>
                    </Label>
                    <Input
                      id="Company_Name"
                      type="text"
                      defaultValue=""
                      className="rounded-xl border-gray-400 focus:border-green-500 focus:ring-green-500 h-12"
                      placeholder="Enter your Company Website Link (Optional)"
                    />
                  </div>
                  {/*  Business Registration Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <List className="h-4 w-4" />
                     Business Registration Number <p className="font-bold">(Optional)</p>
                    </Label>
                    <Input
                      id="Company_Name"
                      type="number"
                      defaultValue=""
                      className="rounded-xl border-gray-400 focus:border-green-500 focus:ring-green-500 h-12"
                      placeholder=""
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <List className="h-4 w-4" />
                   Task Licence <p className="font-bold">(Optional)</p>
                    </Label>
                    <Input
                      id="Company_Name"
                      type="file"
                      defaultValue=""
                      className="rounded-xl border-gray-400 focus:border-green-500 focus:ring-green-500 h-12"
                      placeholder=""
                    />
                  </div>
                  {/* Location */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      type="text"
                      defaultValue={sampleUser.location}
                      className="rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 h-12"
                      placeholder="Enter your location"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <IdCard className="h-4 w-4" />
                      National Id
                    </Label>
                    <Input
                      id="National_id"
                      type="file"
                    
                      className="rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 h-12"
                      placeholder="Enter your location"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-100">
                  <Link to="/alluser_profile/profile" className="w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto rounded-xl border-2 border-gray-300 cursor-pointer hover:border-gray-400 h-12 px-8"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto bg-[var(--two2m)] hover:text-[var(--two2m)] hover:bg-[var(--two4m)] cursor-pointer text-white rounded-xl h-12 px-8 shadow-lg"
                  >
                    Save Changes
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