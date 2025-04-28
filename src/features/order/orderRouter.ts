import express from "express";
import {
  addOrderLine,
  getOrder,
  removeOrderLine,
  updateOrderLineQuantity,
  vendorOrderLine,
  clearCart,
  getUserOrderHistory,
} from "./orderController";
import { roleMiddleware } from "../../middlewares/authMiddleware";
import { generateInvoice } from "./invoiceController";

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
router.get("/history", getUserOrderHistory);
router.get("/:orderId/invoice", (req, res, next) => {
  generateInvoice(req, res).catch(next);
});

export default router;
