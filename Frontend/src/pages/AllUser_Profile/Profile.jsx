import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import National_Id from '../../assets/cityBanner.png'
import { useSelector } from "react-redux";


const Profile = () => {
  const {user}=useSelector((state)=>state.auth)

  return (
    <section>
      <div className="container mx-auto bg-[var(--two5m)] h-full p-4 md:p-10 m-4 md:m-10 rounded-2xl">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="border-0 shadow-green-900 rounded-2xl">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-20 w-20 bg-green-400">
                <AvatarImage
                  src={user?.profilePic || ''}
                  alt={user?.name || ''}
                />
                <AvatarFallback>
                  {user?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {user?.name || ''}
                </CardTitle>
                <CardDescription className="text-lg">
                  {user?.email || ''}
                </CardDescription>
                <Badge variant="secondary" className="mt-2">
                  {user?.role || ''}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Profile Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-green-900">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Full Name
                  </h3>
                  <p className="mt-1">{user?.name || ''}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Phone Number
                  </h3>
                  <p className="mt-1">{user?.phone || ''}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Location
                  </h3>
                  <p className="mt-1">{user?.address || ''}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    National Id
                  </h3>
          
                  <img className="mt-1 w-50 " src={user?.nationalId || ''} alt="national id" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-green-900 rounded-2xl">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Member Since
                  </h3>
                  <p className="mt-1">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Last Updated
                  </h3>
                  <p className="mt-1">
                    {new Date(user?.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Account Status
                  </h3>
                  <p className="mt-1">
                    <Badge
                      variant={user?.isActive ? "success" : "destructive"}
                    >
                      {user?.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Link to='/user/profile-edit'>
            
            <Button variant="outline "className="bg-[var(--two3m)] text-white rounded-2xl cursor-pointer">Edit Profile</Button>
            
            </Link>
            <Link to="/local_shop/home">
              {" "}
              <Button variant="outline" className="bg-[var(--two2m)] text-white rounded-2xl cursor-pointer">
                Back To Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
