import express from "express";
import { checkAuth, getProfile, Login, LogOut, refreshToken, Register } from "../controller/Authusers.controller.js";
import { protectRoute } from "../middleware/Auth_user.Middleware.js";

const route=express.Router();

route.post('/register',Register)
route.post('/login',Login)
route.post('/logout',LogOut)
route.get('/check_auth',protectRoute ,checkAuth)
route.post("/refresh-token", refreshToken);


export default route