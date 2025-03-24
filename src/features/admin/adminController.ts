import { NextFunction, Request, Response } from "express";
import { OrderService } from "../order/orderService";
import { FilterUsers, UserService } from "../user";
import { ConfirmationStatus } from "../user/confirmationStatus";
import { OrderLineStatus } from "../order/orderStatus";

export class AdminController {
  constructor(
    private userService: UserService,
    private orderService: OrderService
  ) {}

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter: FilterUsers = req.body;
      const result = await this.userService.getAllUsers(filter);
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  };

  confirmUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const user = await this.userService.confirmUser(userId);
      res.status(200).json({ message: "User confirmed successfully", user });
    } catch (error) {
      next(error);
    }
  };

  setVendorStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const { status } = req.body;
      if (!Object.values(ConfirmationStatus).includes(status)) {
        res.status(400).json({ message: "Invalid vendor status" });
        return;
      }
      const vendor = await this.userService.setVendorStatus(userId, status);
      res
        .status(200)
        .json({ message: "Vendor status updated successfully", vendor });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const result = await this.userService.deleteUser(userId);
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  };

  getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.role !== "admin") {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { page, limit, productName, productDescription, vendorId, orderDate } = req.query;

      const skip = (Number(page) - 1) * Number(limit) || 0;
      const take = Number(limit) || 10;

      const orders = await this.orderService.getAllOrders(
        skip,
        take,
        productName as string,
        productDescription as string,
        vendorId as string,
        orderDate ? new Date(orderDate as string) : undefined
      );

      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  };

  updateOrderLineStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderLineId, status } = req.body;

      if (!orderLineId || !status) {
        res.status(400).json({ message: "OrderLineId and status are required" });
        return;
      }

      if (!Object.values(OrderLineStatus).includes(status)) {
        res.status(400).json({ message: "Invalid order line status" });
        return;
      }

      const updatedOrderLine = await this.orderService.updateOrderLineStatus(orderLineId, status);
      res.status(200).json(updatedOrderLine);
    } catch (error) {
      next(error);
    }
  };
}
