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
    const order = await orderService.addOrderLine(userId, productId, quantity);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userId = req.user.id;
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

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userId = req.user.id;
    const order = await orderService.removeOrderLine(userId, orderLineId);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const checkoutOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userId = req.user.id;
    const order = await orderService.checkoutOrder(userId);
    res.status(200).json(order);
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
    const orderLine = await orderService.updateOrderLineQuantity(
      userId,
      orderLineId,
      quantity
    );
    res.status(200).json(orderLine);
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userId = req.user.id;
    const orders = await orderService.getUserOrders(userId);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const getVendorProductsOnOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== "vendor") {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { vendorId } = req.params;
    const products = await orderService.getVendorProductsOnOrders(vendorId);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export {
  addOrderLine,
  getOrder,
  removeOrderLine,
  checkoutOrder,
  updateOrderLineQuantity,
  getUserOrders,
  getAllOrders,
  getVendorProductsOnOrders,
};
