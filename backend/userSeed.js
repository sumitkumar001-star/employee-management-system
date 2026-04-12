import User from "./models/User.js"
import bcrypt from 'bcrypt'
import connectDB from "./database/db.js"
import dotenv from "dotenv"

dotenv.config()

const UserRegister= async()=>{
    // Establish connection to the MongoDB database
    await connectDB();
    try {
        // Create a new User instance with administrative privileges
        const user = new User({
            name: 'Admin',
            email: 'admin@gmail.com',
            // Hash the password before saving for security
            password: await bcrypt.hash('password123', 10),
            role: 'admin',
        });
        // Persist the admin user to the database
        await user.save();
        console.log('User registered successfully');
    } catch (error) {
        console.error('Error registering user:', error);
    }
};

UserRegister();
