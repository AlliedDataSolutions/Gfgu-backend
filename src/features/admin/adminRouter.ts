import express from "express";
import {
  getAllUsers,
  confirmUser,
  setVendorStatus,
  deleteUser,
  getAllOrders,
} from "./adminController";

const router = express.Router();

router.put("/users/:userId/confirm", confirmUser);
router.put("/users/:userId/vendor-status", setVendorStatus);
router.get("/users", getAllUsers);
router.get("/all-orders", getAllOrders);
router.delete("/users/:userId/delete", deleteUser);

export default router;
