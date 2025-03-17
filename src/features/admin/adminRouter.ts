import express from "express";
import {
  getAllUsers,
  confirmUser,
  setVendorStatus,
  deleteUser,
} from "./adminController";

const router = express.Router();

router.put("/users/:userId/confirm", confirmUser);
router.put("/users/:userId/vendor-status", setVendorStatus);
router.post("/users", getAllUsers);
router.delete("/users/:userId/delete", deleteUser);

export default router;
