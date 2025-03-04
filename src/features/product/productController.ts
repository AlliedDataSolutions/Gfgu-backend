import { Request, Response } from "express";
import { ProductService } from "./ProductService";

const productService = new ProductService();

const productGetAll = async (req: Request, res: Response) => {
  try {
    var results:any = [];
    if(req.body.category){
      results = await productService.getProductByCategory({id:req.body.category});
    }
    else{
      results = await productService.getAllProduct({},0, 20);
    }

    res.status(201).json(results);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

export { productGetAll };
