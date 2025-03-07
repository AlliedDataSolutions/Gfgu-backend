import express from "express";
import { userProfile } from "./userController";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = express.Router();

router.get("/profile", authMiddleware, userProfile);

export default router;
