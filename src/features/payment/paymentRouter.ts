import express from "express";
import { PaymentService } from "./paymentService";
import { PaymentController } from "./paymentController";

const paymentService = new PaymentService();
const paymentController = new PaymentController(paymentService);

const router = express.Router();

router.put("/init", paymentController.createOrder);
router.put("/capture-payment", paymentController.capturePayment);

export default router;
