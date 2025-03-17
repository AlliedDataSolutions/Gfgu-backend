import express from "express";
import { getAllUsers, confirmUser, setVendorStatus, getAllOrders } from "./adminController";

const router = express.Router();

router.put("/users/:userId/confirm", confirmUser);
router.put("/users/:userId/vendor-status", setVendorStatus);
router.get("/users", getAllUsers);
router.get("/all-orders", getAllOrders);

export default router;
