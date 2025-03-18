import { NextFunction, Request, Response } from "express";
import { OrderService } from "./orderService";

const orderService = new OrderService();

const addOrderLine = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, quantity } = req.body;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userId = req.user?.id;
    await orderService.addOrderLine(userId, productId, quantity);
    res.status(201).json({ message: "Order has been added" });
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const order = await orderService.getOrder(userId);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const removeOrderLine = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderLineId } = req.params;

    const userId = req.user?.id;
    await orderService.removeOrderLine(userId!, orderLineId);
    res.status(200).json({ message: "Order line removed" });
  } catch (error) {
    next(error);
  }
};

const updateOrderLineQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderLineId, quantity } = req.body;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userId = req.user.id;
    console.log(
      `Updating order line quantity for user: ${userId}, orderLineId: ${orderLineId}, quantity: ${quantity}`
    );
    await orderService.updateOrderLineQuantity(userId, orderLineId, quantity);
    res.status(200).json({ message: "Order updated" });
  } catch (error) {
    console.error("Error updating order line quantity:", error);
    next(error);
  }
};

const vendorOrderLine = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const orderLines = await orderService.vendorOrderLine(userId);
    res.status(200).json(orderLines);
  } catch (error) {
    next(error);
  }
};

export {
  addOrderLine,
  getOrder,
  removeOrderLine,
  updateOrderLineQuantity,
  vendorOrderLine,
};
