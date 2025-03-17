import express from "express";
import {
  addOrderLine,
  getOrder,
  removeOrderLine,
  checkoutOrder,
  updateOrderLineQuantity,
  vendorOrderLine,
} from "./orderController";
import { authMiddleware, roleMiddleware } from "../../middlewares/authMiddleware";

const router = express.Router();

router.post("/add", addOrderLine);
router.get("/:userId", getOrder);
router.post("/remove", removeOrderLine);
router.post("/checkout", checkoutOrder);
router.post("/update-quantity", updateOrderLineQuantity);
router.get("/vendor/vendorOrderLine/:vendorId", authMiddleware, roleMiddleware(["vendor", "admin"]), vendorOrderLine);

export default router;
