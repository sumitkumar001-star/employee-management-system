import User from "./models/User.js"
import bcrypt from 'bcrypt'
import connectDB from "./database/db.js"



const UserRegister= async()=>{
    await connectDB();
    try {
        const user = new User({
            name: 'Admin',
            email: 'admin@gmail.com',
            password: await bcrypt.hash('password123', 10),
            role: 'admin',
        });
        await user.save();
        console.log('User registered successfully');
    } catch (error) {
        console.error('Error registering user:', error);
    }
};

UserRegister();

