import { NextFunction, Request, Response } from "express";
import { UserService } from "./UserService";

const userService = new UserService();

const userProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const userProfile = await userService.user(req.user?.id);
    if (!userProfile) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(userProfile);
  } catch (error) {
    next();
  }
};
export { userProfile };
