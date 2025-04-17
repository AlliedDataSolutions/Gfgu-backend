import express from "express";
import {
  addOrderLine,
  getOrder,
  removeOrderLine,
  updateOrderLineQuantity,
  vendorOrderLine,
  clearCart,
} from "./orderController";
import { roleMiddleware } from "../../middlewares/authMiddleware";

const router = express.Router();

router.post("/add", addOrderLine);
router.get("/", getOrder);
router.delete("/remove/:orderLineId", removeOrderLine);
router.put("/update-quantity", updateOrderLineQuantity);
router.delete("/clear", clearCart);
router.get(
  "/vendor/orderline",
  roleMiddleware(["vendor", "admin"]),
  vendorOrderLine
);

export default router;
