import { NextFunction, Request, Response } from "express";
import { ProductService } from "./ProductService";
import { Category } from "./categoryModel";
import { AppDataSource } from "../../config/db";

const productService = new ProductService();

const getAllCategory = async (req: Request, res: Response) => {
  try {
    const categoryRepo = AppDataSource.getRepository(Category);
    const result = await categoryRepo.find();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, category, minPrice, maxPrice, vendorId, page, limit } =
      req.query;

    // Validate query parameters
    if (minPrice && isNaN(Number(minPrice))) {
      res.status(400).json({ message: "Invalid minPrice format" });
      return;
    }
    if (maxPrice && isNaN(Number(maxPrice))) {
      res.status(400).json({ message: "Invalid maxPrice format" });
      return;
    }

    // Convert query parameters to correct types
    const filters: {
      search?: string;
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      vendorId?: string;
    } = {
      search: search ? String(search) : undefined,
      category: category ? String(category) : undefined,
      minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
      vendorId: vendorId ? String(vendorId) : undefined,
    };

    // Pagination values
    const skip = (Number(page) - 1) * Number(limit) || 0;
    const take = Number(limit) || 10; // Default to 10 per page

    const response = await productService.getProducts(filters, skip, take);

    res.status(200).json(response);
  } catch (error) {
    next();
  }
};

const getProductByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Validate ID format (UUID pattern)
    if (!id || id.length !== 36) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }

    const result = await productService.getProductById(id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, price, stockLevel, imageUrls, categoryIds } = req.body;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Convert price and stockLevel to numbers
    const parsedPrice = Number(price);
    const parsedStockLevel = Number(stockLevel);

    const data = await productService.createProduct(req.user.id, {
      name,
      description,
      price: parsedPrice,
      stockLevel: parsedStockLevel,
      imageUrls,
      categoryIds,
    });

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export { getAllCategory, getProducts, getProductByID, createProduct };
