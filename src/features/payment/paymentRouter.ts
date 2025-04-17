import express from "express";
import { PaymentService } from "./paymentService";
import { PaymentController } from "./paymentController";
import { roleMiddleware } from "../../middlewares/authMiddleware";

const paymentService = new PaymentService();
const paymentController = new PaymentController(paymentService);

const router = express.Router();

router.post("/init", paymentController.createOrder); //to initiate the payment i.e when paypal button clicked
router.post("/capture-payment", paymentController.capturePayment); //
router.post("/offline-pay", paymentController.offlinePayment);
router.get(
  "/vendor-transaction",
  roleMiddleware(["vendor"]),
  paymentController.getVendorTransactions
);
router.post(
  "/withdraw",
  roleMiddleware(["vendor"]),
  paymentController.payoutVendor
);

export default router;
