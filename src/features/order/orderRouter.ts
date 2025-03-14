import express from "express";
import {
  addOrderLine,
  getOrder,
  removeOrderLine,
  checkoutOrder,
} from "./orderController";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = express.Router();

router.post("/add", authMiddleware, addOrderLine);
router.get("/:userId", authMiddleware, getOrder);
router.post("/remove", authMiddleware, removeOrderLine);
router.post("/checkout", authMiddleware, checkoutOrder);

export default router;