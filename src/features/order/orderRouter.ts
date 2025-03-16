import express from "express";
import {
  addOrderLine,
  getOrder,
  removeOrderLine,
  checkoutOrder,
  getUserOrders,
  getAllOrders,
  getVendorProductsOnOrders,
} from "./orderController";

const router = express.Router();

router.post("/add", addOrderLine);
router.get("/:userId", getOrder);
router.post("/remove", removeOrderLine);
router.post("/checkout", checkoutOrder);
router.get("/user-orders", getUserOrders);
router.get('/admin/all-orders', getAllOrders);
router.get('/vendor/products-on-orders/:vendorId', getVendorProductsOnOrders);
export default router;
