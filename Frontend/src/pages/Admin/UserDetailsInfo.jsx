import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserById, clearError, deleteUser, verifyAdminPassword, updateUser } from "../../store/UsersSlice";
import { toast } from "sonner";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  FileText,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";

const UserDetailsInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser, loading, error, passwordVerification } = useSelector((state) => state.users);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, id]);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    setPasswordDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handlePasswordSubmit = async () => {
    if (!adminPassword.trim()) {
      setPasswordError('Password is required');
      return;
    }

    try {
      // Verify password with backend
      const result = await dispatch(verifyAdminPassword(adminPassword));
      
      if (verifyAdminPassword.fulfilled.match(result)) {
        // Password verified successfully, proceed with deletion
        toast.success(result.message || "User Is Deleted!", {
          style: { background: "#10B981", color: "#fff" },
        });

        if (currentUser?._id) {
          dispatch(deleteUser(currentUser._id));
          setPasswordDialogOpen(false);
          setAdminPassword('');
          setPasswordError('');
          // Navigate back to users list after deletion
          navigate('/admin/userList');
        }
      } else {
        // Password verification failed
        toast.success(result.message || "Incorrect password", {
          style: { background: "#EF4444", color: "#fff" },
        });
        setPasswordError(result.payload || 'Incorrect password');
      }
    } catch (error) {
      setPasswordError('Password verification failed');
    }
  };

  const handlePasswordCancel = () => {
    setPasswordDialogOpen(false);
    setAdminPassword('');
    setPasswordError('');
  };

  const handleToggleVerified = async () => {
    if (!currentUser?._id) return;
    try {
      const targetValue = !Boolean(currentUser.isverified);
      const result = await dispatch(updateUser({ userId: currentUser._id, userData: { isverified: targetValue } }));
      if (updateUser.fulfilled.match(result)) {
        toast.success(targetValue ? "User verified" : "Verification removed", {
          style: { background: targetValue ? "#10B981" : "#F59E0B", color: "#fff" },
        });
        dispatch(fetchUserById(currentUser._id));
      } else {
        toast.error(result.payload || "Failed to update verification");
      }
    } catch (err) {
      toast.error("Failed to update verification");
    }
  };
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "superAdmin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "LocalShop":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CityShop":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadge = (isOnline) => {
    return isOnline ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
        <CheckCircle className="w-4 h-4 mr-1" />
        Online
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
        <XCircle className="w-4 h-4 mr-1" />
        Offline
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <div className="animate-spin rounded-full h-17 w-18 border-b-16 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button
            onClick={() => dispatch(clearError())}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
          <p>The user you're looking for doesn't exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
            <p className="text-gray-600">
              Complete information about this user
            </p>
          </div>
        </div>

        <div className="flex gap-2">
        
          <button
            onClick={handleToggleVerified}
            className="flex cursor-pointer items-center px-4 py-2 bg-blue-300 text-white rounded-lg hover:bg-blue-400"
          >
            {currentUser?.isverified ? 'Unverify' : 'Verify'}
          </button>
          <button
            onClick={handleDeleteClick}
            className="flex cursor-pointer items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete User
          </button>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-gradient-to-r from-[var(--two3m)] to-[var(--two2m)] rounded-lg p-6 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-2xl font-medium text-gray-700">
              <img src={currentUser.profilePic} alt="U" className="rounded-full" />
              </span>
            </div>
          </div>
          <div className="ml-6 flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentUser.name}
              </h2>
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getRoleBadgeColor(
                  currentUser.role
                )}`}
              >
                <Shield className="w-4 h-4 mr-1" />
                {currentUser.role}
              </span>
              {getStatusBadge(currentUser.isOnline)}
            </div>
            <p className="text-black mb-4">{currentUser.email}</p>
            <div className="flex items-center text-sm text-gray-100">
              <Calendar className="w-4 h-4 mr-1" />
              Joined on{" "}
              {new Date(currentUser.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="mt-3">
              {currentUser?.isverified ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200">
                  <XCircle className="w-4 h-4 mr-1" />
                  Not Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Phone className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Phone</p>
                <p className="text-sm text-gray-600">
                  {currentUser.phone || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Address</p>
                <p className="text-sm text-gray-600">
                  {currentUser.address || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Business Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <Building className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Company Name
                </p>
                <p className="text-sm text-gray-600">
                  {currentUser.companyName || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Globe className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Website</p>
                <p className="text-sm text-gray-600">
                  {currentUser.companyWebsite || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Business Registration
                </p>
                <p className="text-sm text-gray-600">
                  {currentUser.businessRegistrationNO || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Additional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Task Licence
              </p>
              <p className="text-sm text-gray-600">
                {currentUser.TaskLicence || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                National ID
              </p>
              <p className="text-sm text-gray-600">
                {currentUser.NationalId || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Account Status
              </p>
              <p className="text-sm text-gray-600">
                {currentUser.isOnline ? "Active" : "Inactive"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Last Updated
              </p>
              <p className="text-sm text-gray-600">
                {new Date(currentUser.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{currentUser?.name}</strong>? This action cannot be undone. 
              This will permanently remove the user from the system and all their data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={handleDeleteCancel}
              className="cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Confirmation Dialog */}
      <AlertDialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              To delete <strong>{currentUser?.name}</strong>, please enter your admin password to confirm this action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              <label htmlFor="adminPassword" className="text-sm font-medium text-gray-700">
                Admin Password
              </label>
              <input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  setPasswordError('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter your admin password"
                autoComplete="current-password"
              />
              {passwordError && (
                <p className="text-sm text-red-600">{passwordError}</p>
              )}
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={handlePasswordCancel}
              className="cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handlePasswordSubmit}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserDetailsInfo;
