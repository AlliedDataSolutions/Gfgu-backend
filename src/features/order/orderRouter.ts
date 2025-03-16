import express from "express";
import {
  addOrderLine,
  getOrder,
  removeOrderLine,
  checkoutOrder,
  updateOrderLineQuantity,
  getAllOrders,
  getVendorProductsOnOrders,
} from "./orderController";

const router = express.Router();

router.post("/add", addOrderLine);
router.get("/:userId", getOrder);
router.post("/remove", removeOrderLine);
router.post("/checkout", checkoutOrder);
router.post("/update-quantity", updateOrderLineQuantity);
router.get("/admin/all-orders", getAllOrders);
router.get("/vendor/products-on-orders/:vendorId", getVendorProductsOnOrders);

export default router;
