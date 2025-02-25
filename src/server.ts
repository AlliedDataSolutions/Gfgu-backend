import "./config/config"; 
import express, { Application, Request, Response } from "express";
import cors from "cors";
import reflect from "reflect-metadata";
import { initializeDatabase } from "./config/db";
import authRoute from "./features/auth/authRouter";
import userRoute from "./features/user/userRouter";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);


initializeDatabase().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("Error initializing database:", err);
  process.exit(1); // Exit app if database fails to initialize
});