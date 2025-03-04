import express from "express";
import { registerValidation, loginValidation } from "./authValidation";
import {
  register,
  login,
  confirmEmail,
  refreshToken,
  logout,
} from "./authController";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/confirm-email", confirmEmail);
router.post("/login", loginValidation, login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

// Authenticated user are allow to access some endpoint.
// Some endpoints will be restricted to particular role for example:
// Only "admin" can access this route: /users
// router.get("/users", authMiddleware, roleMiddleware(["admin"]), getAllUsers);

export default router;
