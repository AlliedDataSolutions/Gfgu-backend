import { NextFunction, Request, Response } from "express";
import { FilterUsers, UserService } from "../user";
import { ConfirmationStatus } from "../user/confirmationStatus";

const userService = new UserService();

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: FilterUsers = req.body;
    const result = await userService.getAllUsers(filter);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

const confirmUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await userService.confirmUser(userId);
    res.status(200).json({ message: "User confirmed successfully", user });
  } catch (error) {
    next(error);
  }
};

const setVendorStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    if (!Object.values(ConfirmationStatus).includes(status)) {
      res.status(400).json({ message: "Invalid vendor status" });
      return;
    }
    const vendor = await userService.setVendorStatus(userId, status);
    res
      .status(200)
      .json({ message: "Vendor status updated successfully", vendor });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const result = await userService.deleteUser(userId);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export { getAllUsers, setVendorStatus, confirmUser, deleteUser };
