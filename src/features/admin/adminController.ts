import { NextFunction, Request, Response } from "express";
import { OrderService } from "../order/orderService";
import { FilterUsers, UserService } from "../user";
import { ConfirmationStatus } from "../user/confirmationStatus";
import { OrderLineStatus } from "../order/orderStatus";
import { PaymentService } from "../payment/paymentService";
import { Location, DeliveryDay } from "./locationModel";
import { AppDataSource } from "../../config/db";
import { ILike } from "typeorm";

export class AdminController {
  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private paymentService: PaymentService
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
      const {
        skip,
        take,
        productName,
        productDescription,
        vendorId,
        orderDate,
      } = req.query;

      const skipNumber = skip ? parseInt(skip as string, 10) : 0;
      const takeNumber = take ? parseInt(take as string, 10) : 10;
      const orderDateDate = orderDate
        ? new Date(orderDate as string)
        : undefined;

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

  markDelivered = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderLineId } = req.body;
      const updated = await this.orderService.markOrderLineDelivered(
        orderLineId
      );
      res.json(updated);
    } catch (err) {
      next(err);
    }
  };

  //to be reviewed:
  updateOrderLineStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { orderLineId, status } = req.body;

      if (!orderLineId || !status) {
        res
          .status(400)
          .json({ message: "OrderLineId and status are required" });
        return;
      }

      if (!Object.values(OrderLineStatus).includes(status)) {
        res.status(400).json({ message: "Invalid order line status" });
        return;
      }

      const updatedOrderLine = await this.orderService.updateOrderLineStatus(
        orderLineId,
        status
      );
      res.status(200).json(updatedOrderLine);
    } catch (error) {
      next(error);
    }
  };

  getAdminTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { skip, take } = req.query;
      const skipNumber = skip ? parseInt(skip as string, 10) : 0;
      const takeNumber = take ? parseInt(take as string, 10) : 10;

      const { transactions, count } =
        await this.paymentService.getAdminTransactions(skipNumber, takeNumber);
      res.status(200).json({ transactions, count });
    } catch (error) {
      next(error);
    }
  };

  createLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { city, deliveryday, time } = req.body;

      if (!Object.values(DeliveryDay).includes(deliveryday)) {
        res.status(400).json({ message: "Invalid delivery day" });
        return;
      }

      const existingLocation = await AppDataSource.getRepository(
        Location
      ).findOne({
        where: { city: ILike(city) , deliveryday },
      });

      if (existingLocation) {
        res.status(400).json({ message: "Delivery day already exists" });
        return;
      }

      const location = new Location();
      location.city = city;
      location.deliveryday = deliveryday;
      location.time = time;

      await AppDataSource.getRepository(Location).save(location);

      res
        .status(201)
        .json({ message: "Location created successfully", location });
    } catch (error) {
      next(error);
    }
  };

  deleteLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const location = await AppDataSource.getRepository(Location).findOne({
        where: { id: id },
      });

      if (!location) {
        res.status(404).json({ message: "Location not found" });
        return;
      }

      await AppDataSource.getRepository(Location).remove(location);

      res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
