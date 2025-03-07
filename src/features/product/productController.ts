import { Request, Response } from "express";
import { ProductService } from "./ProductService";

const productService = new ProductService();

const productGetAll = async (req: Request, res: Response) => {
  try {
    let results: any = [];
    if (req.body.category) {
      results = await productService.getProductByCategory({ id: req.body.category });
    } else {
      results = await productService.getAllProduct({}, 0, 20);
    }

    res.status(200).json(results);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};



// ✅ API handler for fetching a product by ID


const productGetById = async (req: Request, res: Response): Promise<any> => {
  try {
    const productId = req.body.id;

    if (!productId) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const result = await productService.getProductById(productId);

    if (result.error) {
      return res.status(404).json(result); // Return 404 if product not found
    }

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export { productGetAll, productGetById };

