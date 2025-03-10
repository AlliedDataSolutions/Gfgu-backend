import { AppDataSource } from "../../config/db";
import { User } from "./userModel";
import { Request, Response } from "express";
import { UserService } from "./UserService";

const userService = new UserService();

const userProfile = async (req: Request, res: Response) => {
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
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { userProfile };
