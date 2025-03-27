import { Request, Response } from "express";
import { AppDataSource } from "../../config/db";
import { Address } from "./addressModel";
import { PaymentService } from "../payment/paymentService";
import { OrderService } from "../order/orderService";

const paymentService = new PaymentService();
const orderService = new OrderService();

export const getUserAddresses = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const addressRepo = AppDataSource.getRepository(Address);
    const addresses = await addressRepo.find({
      where: { user: { id: req.user.id } },
    });
    res.status(200).json(addresses);
    return;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const addUserAddress = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    // Only extract the fields that exist in the Address entity
    const { streetName, city, province, postalCode } = req.body;
    const addressRepo = AppDataSource.getRepository(Address);
    // Map the incoming 'city' to the entity's 'town'
    const newAddress = addressRepo.create({
      streetName,
      town: city, // Correct mapping
      province,
      postalCode,
      user: { id: req.user.id },
    });
    await addressRepo.save(newAddress);

    // Create PayPal order
    const userId = req.user.id;
    const order = await orderService.getOrder(userId);
    if (!order) {
      res.status(400).json({ message: "Order not found" });
      return;
    }

    // Calculate total amount
    let totalAmount = 0;
    if (order.orderLines) {
      for (const orderLine of order.orderLines) {
        totalAmount += orderLine.unitPrice * orderLine.quantity;
      }
    }

    const paypalOrder = await paymentService.createOrder(
      totalAmount.toString()
    );

    // Save PayPal order ID to the order
    await orderService.savePaypalOrderId(order.id, paypalOrder.id);

    res.status(201).json(newAddress);
    return;
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
