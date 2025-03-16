import { NextFunction, Request, Response } from "express";
import { UserService } from "../user";
import { ConfirmationStatus } from "../user/confirmationStatus";

const userService = new UserService();

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  
  try {
    const { search, role, isConfirmed, vendorStatus, page = 1, limit = 10 } = req.query;
    
    const result = await userService.getAllUsers(
      search as string,
      role as string,
      isConfirmed === "true",
      vendorStatus as string,
      Number(page),
      Number(limit)
    );

    res.status(200).json(result);
  } catch (error) {
    console.log(error)
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

export { getAllUsers, setVendorStatus, confirmUser };
