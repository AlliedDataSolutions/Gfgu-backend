import express from "express";
import { user } from "./userController";

const router = express.Router();

router.get("/", user);

export default router;
