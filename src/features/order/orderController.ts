import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Order } from "./orderModel";
import { OrderLine } from "./orderLineModel";
import { Product } from "../product/productModel";
import { User } from "../user/userModel";
import { OrderStatus } from "./orderStatus"; // Ensure OrderStatus is imported

const addOrderLine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, productId, quantity } = req.body;

    const userRepository = getRepository(User);
    const productRepository = getRepository(Product);
    const orderRepository = getRepository(Order);
    const orderLineRepository = getRepository(OrderLine);

    const user = await userRepository.findOne(userId);
    const product = await productRepository.findOne(productId);

    if (!user || !product) {
      res.status(404).json({ message: "User or Product not found" });
      return;
    }

    let order = await orderRepository.findOne({
      where: { user, status: OrderStatus.pending }, // Use OrderStatus.pending for cart
      relations: ["orderLines"],
    });

    if (!order) {
      order = new Order();
      order.user = user;
      order.status = OrderStatus.pending; // Use OrderStatus.pending for cart
      order.orderLines = [];
      order = await orderRepository.save(order);
    }

    const orderLine = new OrderLine();
    orderLine.order = order;
    orderLine.product = product;
    orderLine.quantity = quantity;
    orderLine.unitPrice = product.price; // Assuming Product has a price field
    if (!order.orderLines) {
      order.orderLines = [];
    }
    order.orderLines.push(orderLine);

    await orderLineRepository.save(orderLine);
    await orderRepository.save(order);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne({
      where: { user: { id: userId }, status: OrderStatus.pending }, // Use OrderStatus.pending for cart
      relations: ["orderLines", "orderLines.product"],
    });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const removeOrderLine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, orderLineId } = req.body;

    const orderRepository = getRepository(Order);
    const orderLineRepository = getRepository(OrderLine);

    const order = await orderRepository.findOne({
      where: { user: { id: userId }, status: OrderStatus.pending }, // Use OrderStatus.pending for cart
      relations: ["orderLines"],
    });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const orderLine = await orderLineRepository.findOne(orderLineId);

    if (!orderLine) {
      res.status(404).json({ message: "Order line not found" });
      return;
    }

    if (order.orderLines) {
      order.orderLines = order.orderLines.filter((ol) => ol.id !== orderLineId);
    }

    await orderLineRepository.remove(orderLine);
    await orderRepository.save(order);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const checkoutOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;

    const orderRepository = getRepository(Order);

    const order = await orderRepository.findOne({
      where: { user: { id: userId }, status: OrderStatus.pending }, // Use OrderStatus.pending for cart
      relations: ["orderLines"],
    });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    order.status = OrderStatus.confirmed; // Change status to confirmed
    order.orderDate = new Date();

    await orderRepository.save(order);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export { addOrderLine, getOrder, removeOrderLine, checkoutOrder };