import express from "express";
const router = express.Router();
import fetchProducts from "../controller/Telegram.js";
router.get("/fetch-products",fetchProducts)

export default router