import { NextFunction, Request, Response } from "express";
import { UserService } from "./UserService";


const userService = new UserService();

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
    next();
  }
};
export { userProfile };

export const updateName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName } = req.body;
    const { id } = req.user!;
    const result = await userService.updateName(id, firstName, lastName);
    res.json(result);
  } catch (err) { next(err); }
};

export const updateEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { newEmail } = req.body;
    const { id } = req.user!;
    const result = await userService.updateEmail(id, newEmail);
    res.json(result);
  } catch (err) { next(err); }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.user!;
    const result = await userService.updatePassword(id, currentPassword, newPassword);
    res.json(result);
  } catch (err) { next(err); }
};