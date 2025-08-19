import jwt from "jsonwebtoken";
import AuthUser from "../model/Authusers.model.js";
import "dotenv/config";



export const protectRoute = async (req, res, next) => {
	try {
		// 1. Get the access token from cookies
	
		const accessToken = req.cookies.accessToken;
	
	

		if (!accessToken) {
			return res.status(401).json({ message: "Unauthorized - No access token provided" });
		}

		let decoded;
		try {
			// 2. Verify the token
			decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
		
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
			
			const user = await AuthUser.findById(decoded.userId).select("-password");
			
			if (!user) {
		
				return res.status(401).json({ message: "Unauthorized - User not found" });
			}
			
			

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



// Middleware to restrict access to admin users only
export const adminOnly = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden - Admins only" });
    }
    next();
  } catch (error) {
    console.log("Error in adminOnly middleware:", error.message);
    return res.status(500).json({ message: "Internal server error in middleware" });
  }
};
