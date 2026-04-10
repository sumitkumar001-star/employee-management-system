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




connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public/uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/department", departmentRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/salary", salaryRouter);
app.use("/api/leave", leaveRouter)
app.use("/api/setting", settingRouter);
app.use("/api/dashboard", dashboardRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
