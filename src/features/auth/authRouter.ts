import express from "express";
import { registerValidation, loginValidation } from "./authValidation";
import { AuthController } from "./authController";
import { AuthService } from "./AuthService";

const router = express.Router();

const authService = new AuthService();
const authController = new AuthController(authService);

router.post("/register", registerValidation, authController.register);
router.post("/confirm-email", authController.confirmEmail);
router.post("/login", loginValidation, authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);

export default router;
