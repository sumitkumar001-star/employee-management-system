import mongoose from "mongoose";

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * This function uses the MONGO_URL environment variable for the connection string.
 */
const connectDB = async () => {
  try {
    // Attempt to connect to the database
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      
    }); 
    // Log success message with the host name of the connection
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
    // Log the error message if the connection fails
    console.error(`Error: ${error.message}`);
    // Terminate the process with a failure code (1) if database connection cannot be established
    process.exit(1);
  }
};

export default connectDB;   
