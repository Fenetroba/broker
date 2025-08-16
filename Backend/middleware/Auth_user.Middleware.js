import jwt from "jsonwebtoken";
import AuthUser from "../model/Authusers.model.js";
import env from 'dotenv'
env.config()



export const protectRoute = async (req, res, next) => {
	try {
		// 1. Get the access token from cookies
		console.log('Cookies:', req.cookies);
		const accessToken = req.cookies.accessToken;
		console.log('Access token from cookies:', accessToken ? 'Token exists' : 'No token found');
	

		if (!accessToken) {
			return res.status(401).json({ message: "Unauthorized - No access token provided" });
		}

		let decoded;
		try {
			// 2. Verify the token
			decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
			console.log('Decoded JWT:', decoded);
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Unauthorized - Access token expired" });
			}
			// Log the error for debugging
			console.log("JWT Verification Error:", error.message);
			return res.status(401).json({ message: "Unauthorized - Invalid access token" });
		}

		try {
				// 3. Find the user by ID from the token payload
			console.log('Looking for user with ID:', decoded.userId);
			const user = await AuthUser.findById(decoded.userId).select("-password");
			
			if (!user) {
				console.log('User not found with ID:', decoded.userId);
				return res.status(401).json({ message: "Unauthorized - User not found" });
			}
			
			console.log('User found:', { id: user._id, email: user.email });

			// 4. Attach user to request and proceed
			req.user = user;
			next();
		} catch (error) {
			// Log any unexpected errors
			console.log("Error in protectRoute middleware (DB):", error.message);
			return res.status(500).json({ message: "Internal server error in middleware" });
		}
	} catch (error) {
		// Log any unexpected errors
		console.log("Error in protectRoute middleware:", error.message);
		return res.status(401).json({ message: "Unauthorized - Middleware error" });
	}
};


