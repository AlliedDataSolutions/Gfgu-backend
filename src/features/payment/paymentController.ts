import { NextFunction, Request, Response } from "express";
import { PaymentService } from "./paymentService";
import paypal from "@paypal/checkout-server-sdk";
import { client } from "@src/config/paypal";

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  // Initializes the payment, orderId is return
  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount } = req.body;
      const result = await this.paymentService.createOrder(amount);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  // To finalize payment, Admin receives full payment
  capturePayment = async (req: Request, res: Response, next: NextFunction) => {
    const { orderID } = req.body;
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    //request.requestBody({});

    try {
      const response = await client.execute(request);
      res.json(response.result);
    } catch (error) {
      next(error);
    }
  };
}
