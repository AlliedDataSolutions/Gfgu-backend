import "./config/config";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "reflect-metadata";
import { initializeDatabase } from "./config/db";
import authRoute from "./features/auth/authRouter";
import userRoute from "./features/user/userRouter";
import productRoute from "./features/product/productRouter";
import { notFoundMiddleware, handleError } from "./middlewares/handleError";
import addressRouter from "./features/address/addressRouter";
import { authMiddleware, roleMiddleware } from "./middlewares/authMiddleware";
import orderRouter from "./features/order/orderRouter";
import adminRouter from "./features/admin/adminRouter";
import paymentRouter from "./features/payment/paymentRouter";
import imageRouter from "./features/upload/imageRouter";

const app: Application = express();

// Middleware
app.use(express.json({ limit: "2mb" })); // Adjust the limit as needed

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", authMiddleware, userRoute);
app.use("/api/address", authMiddleware, addressRouter);
app.use("/api/product", authMiddleware, productRoute);
app.use("/api/order", authMiddleware, orderRouter);
app.use("/api/admin", authMiddleware, roleMiddleware(["admin"]), adminRouter);
app.use("/api/payment", authMiddleware, paymentRouter);
app.use("/api/upload", authMiddleware, imageRouter);

app.get("/api/test", (req: Request, res: Response) => {
  res.status(201).json({ message: "testing works" });
});

// Custom error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  notFoundMiddleware(req, res, next);
});

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
