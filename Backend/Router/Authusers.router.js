import express from "express";
import { Login, Register } from "../controller/Authusers.controller.js";

const route=express.Router();

route.post('/register',Register)
route.post('/login',Login)

export default route