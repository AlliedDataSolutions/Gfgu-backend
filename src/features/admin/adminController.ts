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

  getAllOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { skip, take, productName, productDescription, vendorId, orderDate } =
        req.query;
  
      const skipNumber = skip ? parseInt(skip as string, 10) : 0;
      const takeNumber = take ? parseInt(take as string, 10) : 10;
      const orderDateDate = orderDate ? new Date(orderDate as string) : undefined;
  
      const { records, count } = await this.orderService.getAllOrders(
        skipNumber,
        takeNumber,
        productName as string,
        productDescription as string,
        vendorId as string,
        orderDateDate
      );
  
      res.status(200).json({ records, count });
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
