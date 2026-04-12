import mongoose from 'mongoose';

/**
 * User Schema defines the core authentication and identity details.
 * This model is used for login credentials and determining access levels (RBAC).
 */
const userSchema = new mongoose.Schema({
  // Full name of the user
  name: {
    type: String,
    required: true,
  },
  // Unique email address used for login
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Hashed password for secure authentication
  password: {
    type: String,
    required: true,
  },
  // Access level: 'admin' for management, 'employee' for staff
  role: {
    type: String,
    enum:  ['admin', 'employee'],
    required: true,
  },
  // Filename or URL of the user's profile image
  profilePicture: {
    type: String,
  },  
  // Timestamp of when the user account was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Timestamp of the last update to the user record
  updatedAt: {
    type: Date,
    default: Date.now,
  },

});

const User = mongoose.model('User', userSchema);

export default User;
