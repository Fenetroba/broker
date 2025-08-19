import express from "express";
import AuthUser from "../model/Authusers.model.js";
import bcrypt from 'bcrypt';
import "dotenv/config";
import jwt from "jsonwebtoken";
import cloudinary from '../Db/cloudinary.js'


// Generate access and refresh tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// Set access and refresh tokens as cookies
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const Register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const UserExist = await AuthUser.findOne({ email });
    if (UserExist) {
      return res.status(400).json({ success: false, message: "the Email is alrady exist" });
    }
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "the all are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "the password length have be greter than 6" });
    }
    const HashPassword = await bcrypt.hash(password, 10);
    const user = await AuthUser.create({ name, email, password: HashPassword, role });
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: "Registration SuccessFull"
    });
  } catch (error) {
    res.status(500).json({ error, message: "the error create on registration" });
    console.log(error);
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await AuthUser.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Incorrect Password or Email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      // Generate tokens with the correct userId
      const { accessToken, refreshToken } = generateTokens(user._id);
      // Set cookies in the correct order
      setCookies(res, accessToken, refreshToken);
      return res.status(200).json({ 
        success: true, 
        message: "Login Successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      return res.status(400).json({ success: false, message: "Incorrect Password or Email" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error occurred on Login controller" });
  }
};

export const LogOut = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Authenticated",
      user: req.user,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ 
        success: false,
        message: "No refresh token provided" 
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ 
          success: false,
          message: "Refresh token expired" 
        });
      }
      return res.status(401).json({ 
        success: false,
        message: "Invalid refresh token" 
      });
    }

    // Verify user still exists
    const user = await AuthUser.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId }, 
      process.env.ACCESS_TOKEN_SECRET, 
      { expiresIn: "15m" }
    );

    // Set new access token cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.json({ 
      success: true,
      message: "Token refreshed successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

export const GetVerifyedUser=async(req,res)=>{
  try {
    const user=await AuthUser.findById(req.user.id).select("-password");
    if(!user){
      return res.status(404).json({success:false,message:"User not found"});
    }
    return res.status(200).json({success:true,message:"User found",user});  
    
  } catch (error) {
    console.log("Error in GetVerifyedUser controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// List users by role (defaults to city_shop) with optional search and pagination
export const fetchCityShopUsers = async (req, res) => {
  try {
    const {
      role = 'CityShop',
      q = '',
      page = 1,
      limit = 20,
    } = req.query;

    // Build case-insensitive role patterns to support variants like CityShop, city_shop, city-shop, etc.
    const rolePatterns = [
      new RegExp(`^${role}$`, 'i'),
      /^City[\s-]?Shop$/i,
      /^Local[\s-]?Shop$/i,
    ];
    
    // Normalize the role to handle both 'LocalShop' and 'Local_Shop' formats
    const normalizedRole = role.replace(/[_\s-]/g, '').toLowerCase();

    // Support different field names that might be used to store role/type (case-insensitive)
    const roleFilter = {
      $or: [
        { role: { $in: rolePatterns } },
        { userType: { $in: rolePatterns } },
        { UserType: { $in: rolePatterns } },
        // Also try matching with normalized role
        { role: { $regex: new RegExp(`^${normalizedRole}$`, 'i') } },
      ],
    };

    const searchFilter = q
      ? {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } },
          ],
        }
      : {};

    const filter = { ...roleFilter, ...searchFilter };

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [users, totalResults] = await Promise.all([
      AuthUser.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      AuthUser.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalResults / limitNum),
        totalResults,
        hasNext: skip + users.length < totalResults,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.log('Error in fetchCityShopUsers controller', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Upload file to Cloudinary helper function
const uploadToCloudinary = async (file) => {
  if (!file) return null;
  
  // Convert buffer to base64
  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataURI = `data:${file.mimetype};base64,${b64}`;
  
  try {
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto"
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};

export const UpdateUserFile = async (req, res) => {
    try {
        const { name, email, role, address, phone, companyName, companyWebsite, businessRegistrationNO } = req.body;
        const userId = req.user.id;
        
        // Find the user
        const user = await AuthUser.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Handle file uploads
        if (req.files) {
            // Handle profile picture
            if (req.files.profilePic) {
                user.profilePic = await uploadToCloudinary(req.files.profilePic[0]);
            }
            // Handle task license
            if (req.files.taskLicence) {
                user.TaskLicence = await uploadToCloudinary(req.files.taskLicence[0]);
            }
            // Handle national ID
            if (req.files.nationalId) {
                user.NationalId = await uploadToCloudinary(req.files.nationalId[0]);
            }
        }

        // Update user fields if provided
        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (address) user.address = address;
        if (phone) user.phone = phone;
        if (companyName) user.companyName = companyName;
        if (companyWebsite) user.companyWebsite = companyWebsite;
        if (businessRegistrationNO) user.businessRegistrationNO = businessRegistrationNO;

        // Save the updated user
        await user.save();
        
        // Return updated user data (excluding sensitive info)
        const { password: _, refreshToken: __, ...userData } = user.toObject();
        
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: userData
        });
        
    } catch (error) {
        console.error("Error in UpdateUserFile controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

// export const Pictures=async(req,res)=>{

//   try {
//     const {Pic}=req.body;
   
//     const Userid=req.user._id;


//     const UploadImgToCloud=await cloudinary.uploader.upload(Pic);

//     const UpdateUserProfile=await AuthUser.findByIdAndUpdate(Userid,{profilePic:UploadImgToCloud.secure_url},{new:true})

//     return res.status(200).json({success:true,UpdateUserProfile})
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({
//       success: false,
//       message: 'Internal Server Error'
//     });
//   }

// }
