import { AppDataSource } from "../../config/db";
import { User } from "../user";
import { Request, Response } from "express";
import { AuthService } from "./AuthService";

const authService = new AuthService();

const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

const login = async (req: Request, res: Response) => {
  // Example: Trying to login
  const userRepository = AppDataSource.getRepository(User);

  const users = await userRepository.find();
  res.status(200).json(users);
};

export { register, login };
