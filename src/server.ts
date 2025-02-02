import express, { Application, Request, Response } from "express";
import cors from "cors";
import reflect from "reflect-metadata";
import dotenv from "dotenv";
import { initializeDatabase } from "./config/db";
import authRoute from "./features/auth/authRouter";
import userRoute from "./features/user/userRouter";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error initializing database:", err);
    process.exit(1); // Exit app if database fails to initialize
  });

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
