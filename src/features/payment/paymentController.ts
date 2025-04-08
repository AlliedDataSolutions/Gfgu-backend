import { NextFunction, Request, Response } from "express";
import { PaymentService } from "./paymentService";

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  // Initializes the payment, orderId is return
  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.body;
      const result =
        await this.paymentService.createPayPalOrderFromPendingOrder(orderId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  capturePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { paypalOrderId } = req.body;
      const updatedOrder = await this.paymentService.capturePayment(
        paypalOrderId
      );
      res.json(updatedOrder);
    } catch (err) {
      next(err);
    }
  };
}
