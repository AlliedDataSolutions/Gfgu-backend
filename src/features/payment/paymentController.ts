import { NextFunction, Request, Response } from "express";
import { PaymentService } from "./paymentService";
import paypal from "@paypal/checkout-server-sdk";
import { client } from "../../config/paypal";
import { OrderService } from "../order/orderService";
import { OrderStatus } from "../order/orderStatus";
import { AppDataSource } from "../../config/db";
import { Order } from "../order/orderModel";

const orderService = new OrderService();

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
      console.log("response.result", response.result);
      const orderId = response.result.purchase_units[0].reference_id;

      // Update order status to confirmed
      //await orderService.updateOrderToDelivered(orderId);
      // Update order status to confirmed
      const orderRepo = AppDataSource.getRepository(Order);
      const order = await orderRepo.findOne({ where: { id: orderId } });

      if (!order) {
        throw new Error("Order not found");
      }

      order.status = OrderStatus.confirmed;
      await orderRepo.save(order);

      res.json(response.result);
    } catch (error) {
      next(error);
    }
  };
}
