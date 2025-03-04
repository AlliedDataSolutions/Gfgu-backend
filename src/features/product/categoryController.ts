import { Request, Response } from "express";
import { CategoryService } from "./CategoryService";

const categoryService = new CategoryService();

const categoryGetAll = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.getAllCategory(req.body);
    res.status(201).json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

export { categoryGetAll };
