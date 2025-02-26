import express from "express";
import { registerValidation } from "./registerValidation";
import { login, register } from "./authController";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", login);

export default router;
