import { NextFunction, Request, Response } from "express";
import { UserService } from "./UserService";



const userProfile = async (req: Request, res: Response, next: NextFunction) => {
  const userService = new UserService();
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
    // next();
    res.status(500).json(error)
  }
};
export { userProfile };
