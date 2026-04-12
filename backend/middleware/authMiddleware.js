import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to verify the authenticity of a user via JSON Web Token (JWT).
 * This ensures that only authenticated users can access protected routes.
 */
const verifyUser = async(req,res,next) =>{
    try{
        // Extract the token from the Authorization header (Format: "Bearer <token>")
        const token = req.headers.authorization?.split(' ')[1];
        
        // If no token is provided, deny access
        if(!token){
            return res.status(401).json({success: false, error:"Token is not Provided"})
        }

        // Verify the token using the secret key stored in environment variables
        const decoded =  jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({success: false, error:"Invalid Token"})
        }

        /**
         * Extract user ID from the decoded payload.
         * Safely check for both _id and id depending on how the token was signed during login.
         */
        const userId = decoded._id || decoded.id;
        
        // Fetch the user from the database, excluding the password field for security
        const user = await User.findById(userId).select("-password");
        
        if(!user){
            return res.status(404).json({success: false, error:"User not found"})
        }

        // Attach the user object to the request so it can be accessed in subsequent controllers
        req.user = user;
        
        // Proceed to the next middleware or controller
        next();
    }catch(error){
        // Log the error for debugging and return a generic server error to the client
        console.error("JWT Verification Error:", error.message);
        return res.status(500).json({success: false, error:"Server Error"})
    }
}

export default verifyUser;