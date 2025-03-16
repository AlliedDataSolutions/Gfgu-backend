import express from "express";
import {
  addOrderLine,
  getOrder,
  removeOrderLine,
  checkoutOrder,
} from "./orderController";

const router = express.Router();

router.post("/add", addOrderLine);
router.get("/:userId", getOrder);
router.post("/remove", removeOrderLine);
router.post("/checkout", checkoutOrder);

export default router;
