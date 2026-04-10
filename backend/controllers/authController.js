import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    return res
      .status(200)
      .json({ success: true, token, message: "Login successful", user });
  } catch (error) {
    // Log the actual error on the server for debugging
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "An internal server error occurred." });
  }
};

const verifyUser = async (req, res, next) => {
  return res.status(200).json({ success: true, user: req.user});
};


export { login , verifyUser};
