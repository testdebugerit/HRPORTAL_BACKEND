import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import roleRoute from "./routes/role.js";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import timsesheetRoute from "./routes/timesheet.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);
dotenv.config();
//db connection
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/hr");
    console.log("db connected");
  } catch (error) {
    throw error;
  }
};

app.use("/api/role", roleRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/timesheet", timsesheetRoute);
//error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: errorMessage,
  });
});

//response handlesr
app.use((obj, req, res, next) => {
  const statusCode = obj.status || 500;
  const message = obj.message || "Something went wrong";
  return res.status(statusCode).json({
    success: [200, 201, 204].some((a) => a == obj.status) ? true : false,
    status: statusCode,
    message: message,
    data: obj.data,
  });
});

app.listen(8000, () => {
  connectDB();
  console.log("connected");
});
