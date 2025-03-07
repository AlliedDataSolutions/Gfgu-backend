import { AppDataSource } from "../../config/db";
import { Product } from "./productModel";

export class ProductService {
  private ProductRepo = AppDataSource.getRepository(Product);

  async getAllProduct(filter: any, skip: number, take: number) {
    try {
      const productGetAll = await this.ProductRepo.find({
        skip: skip,
        take: take,
      });

      return { data: productGetAll };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { error: "Failed to fetch products. Please try again later." };
    }
  }

  async getProductByCategory(filter: any) {
    try {
      const products = await this.ProductRepo.find({
        relations: ["categories", "images", "vendor"],
        where: { categories: filter },
      });

      console.log("Fetched products:", products);
      return { data: products };
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return { error: "Failed to fetch products by category. Please try again later." };
    }
  }

  async getProductById(productId: string) {
    try {
      const product = await this.ProductRepo.findOne({
        where: { id: productId },
        relations: ["categories", "images", "vendor"], // Fetch related data
      });

      if (!product) {
        return { error: "Product not found" };
      }

      return { data: product };
    } catch (error) {
      console.error(`Error fetching product with ID ${productId}:`, error);
      return { error: "Failed to fetch product. Please try again later." };
    }
  }
}




