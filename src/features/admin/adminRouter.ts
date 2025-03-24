import express from "express";
import { AdminController } from "./adminController";
import UserService from "../user/UserService";
import { OrderService } from "../order";

const userService = new UserService();
const orderService = new OrderService();
const adminController = new AdminController(userService, orderService);

const router = express.Router();

router.put("/users/:userId/confirm", adminController.confirmUser);
router.put("/users/:userId/vendor-status", adminController.setVendorStatus);
router.post("/users", adminController.getAllUsers);
router.delete("/users/:userId/delete", adminController.deleteUser);
router.get("/all-orders", adminController.getAllOrders);
router.put("/update-order", adminController.updateOrderLineStatus);

export default router;
