// middlewares/isAuthenticated.js

import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    // If token is missing
    if (!token) {
      return res.status(401).json({
        message: "User not Authenticated",
        success: false,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach userId to request object
    req.id = decoded.userId;
    next();
  } catch (error) {
    console.error("JWT Authentication Error:", error.message);

    return res.status(500).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

export default isAuthenticated;
