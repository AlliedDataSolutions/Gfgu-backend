import express from "express";
import { PaymentService } from "./paymentService";
import { PaymentController } from "./paymentController";

const paymentService = new PaymentService();
const paymentController = new PaymentController(paymentService);

const router = express.Router();

router.post("/init", paymentController.createOrder); //to initiate the payment i.e when paypal button clicked
router.post("/capture-payment", paymentController.capturePayment); // 

export default router;
