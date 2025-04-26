import express from "express";
import { AdminController } from "./adminController";
import UserService from "../user/UserService";
import { OrderService } from "../order";
import { PaymentService } from "../payment/paymentService";

const userService = new UserService();
const orderService = new OrderService();
const paymentService = new PaymentService();
const adminController = new AdminController(
  userService,
  orderService,
  paymentService
);

const router = express.Router();

router.put("/users/:userId/confirm", adminController.confirmUser);
router.put("/users/:userId/vendor-status", adminController.setVendorStatus);
router.post("/users", adminController.getAllUsers);
router.delete("/users/:userId/delete", adminController.deleteUser);
router.get("/all-orders", adminController.getAllOrders);
router.post("/delivered", adminController.markDelivered);
router.get("/transaction", adminController.getAdminTransactions);

router.post("/location", adminController.createLocation);
router.delete("/location/:id", adminController.deleteLocation);

//to be reviewed:
router.put("/update-order", adminController.updateOrderLineStatus);

export default router;
