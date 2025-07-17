import express from "express";
import AuthUser from "../model/Authusers.model.js";
import bcrypt from 'bcrypt';
import env from 'dotenv';
import jwt from "jsonwebtoken";
env.config();

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

