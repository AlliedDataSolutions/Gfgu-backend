import { NextFunction, Request, Response } from "express";
import { PaymentService } from "./paymentService";

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  // Initializes the payment, orderId is return
  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, selectedAddressId } = req.body;
      const result =
        await this.paymentService.createPayPalOrderFromPendingOrder(
          orderId,
          selectedAddressId
        );
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
      res.json({ updatedOrder });
    } catch (err) {
      next(err);
    }
  };

  offlinePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, selectedAddressId } = req.body;
      const updatedOrder = await this.paymentService.processOfflinePayment(
        orderId,
        selectedAddressId
      );
      res.status(200).json(updatedOrder);
    } catch (error) {
      next(error);
    }
  };

  payoutVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount } = req.body;

      const userId = req.user?.id;

      if (!userId) throw new Error("User not found");

      const result = await this.paymentService.payoutToVendor(
        userId,
        parseFloat(amount)
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  getVendorTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const transactions = await this.paymentService.getVendorTransactions(
        req.user?.id
      );
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  };
}
