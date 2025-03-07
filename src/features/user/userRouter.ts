import express from "express";
import { userProfile } from "./userController";

const router = express.Router();

router.get("/profile", userProfile);

export default router;
