import express from "express";
import { AdminController } from "./adminController";
import UserService from "../user/UserService";

const userService = new UserService();
const userController = new AdminController(userService);

const router = express.Router();

router.put("/users/:userId/confirm", userController.confirmUser);
router.put("/users/:userId/vendor-status", userController.setVendorStatus);
router.post("/users", userController.getAllUsers);
router.delete("/users/:userId/delete", userController.deleteUser);

export default router;
