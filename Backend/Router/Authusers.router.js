import express from "express";
import multer from 'multer';
import { checkAuth, fetchCityShopUsers, getProfile, GetVerifyedUser, Login, LogOut, refreshToken, Register, UpdateUserFile } from "../controller/Authusers.controller.js";
import { protectRoute } from "../middleware/Auth_user.Middleware.js";

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const route=express.Router();

route.post('/register',Register)
route.post('/login',Login)
route.post('/logout',LogOut)
route.get('/check_auth',protectRoute ,checkAuth)
route.post("/refresh-token", refreshToken);
route.get("/users",fetchCityShopUsers)
// Update user profile with file uploads
route.put(
  "/updateUserFile",
  protectRoute,
  upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'taskLicence', maxCount: 1 },
    { name: 'nationalId', maxCount: 1 }
  ]),
  UpdateUserFile
)


export default route