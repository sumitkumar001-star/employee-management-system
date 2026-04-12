import User from "../models/User.js";
import bcrypt from "bcrypt";

/**
 * Handles the password update process for a user.
 * It verifies the old password before allowing the user to set a new one.
 */
const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    // Find the user in the database by their unique ID
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Compare the provided 'oldPassword' with the hashed password stored in the database
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Wrong old password" });
    }

    // Hash the new password for secure storage
    // Update the user's record with the new hashed password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate({ _id: userId }, { password: hashedPassword });

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    // Handle unexpected server errors during the password update process
    return res.status(500).json({ success: false, error: "Change password server error" });
  }
};

export { changePassword };
       