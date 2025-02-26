import "./config/config"; 
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import "reflect-metadata"; 
import { errors } from "celebrate";
import { initializeDatabase } from "./config/db";
import authRoute from "./features/auth/authRouter";
import userRoute from "./features/user/userRouter";
import handleError from "./middlewares/handleError";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

// Handle celebrate validation errors
//app.use(errors());

// Custom error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  handleError(err, req, res, next);
});

// Start the server after initializing the database
initializeDatabase()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error initializing database:", err);
    process.exit(1); // Exit app if database fails to initialize
  });
