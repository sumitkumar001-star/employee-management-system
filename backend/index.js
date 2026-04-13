import express from "express";
import cors from "cors";
import departmentRouter from "./routes/department.js";
import connectDB from "./database/db.js";
import salaryRouter from "./routes/salary.js";
import employeeRouter from "./routes/employee.js";
import authRoutes from "./routes/auth.js";
import settingRouter from "./routes/setting.js";
import leaveRouter from "./routes/leave.js";
import dashboardRouter from "./routes/dashboard.js";

// Initialize database connection
connectDB();

const app = express();

// Enable Cross-Origin Resource Sharing for frontend-backend communication
app.use(cors({
  origin: "https://employee-management-system-pink-iota.vercel.app",
  credentials: true
}));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Serve static files (like profile pictures) from the uploads directory
app.use(express.static("public/uploads"));

// Define API routes
app.use("/api/auth", authRoutes);
app.use("/api/department", departmentRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/salary", salaryRouter);
app.use("/api/leave", leaveRouter)
app.use("/api/setting", settingRouter);
app.use("/api/dashboard", dashboardRouter);

// Start the server on the port specified in environment variables
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
