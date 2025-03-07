import { AppDataSource } from "../../config/db";
import { Vendor } from "../user";
import { Product } from "./productModel";
import { Image } from "../image";

export class ProductService {
  async getProducts(
    filters: {
      search?: string;
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      vendorId?: string;
    },
    skip: number,
    take: number
  ) {
    try {
      const productRepo = AppDataSource.getRepository(Product);
      // Query builder for flexible filtering
      const query = productRepo
        .createQueryBuilder("product")
        .leftJoinAndSelect("product.images", "images") // Include product images
        .leftJoinAndSelect("product.vendor", "vendor") // Include vendor details
        .leftJoinAndSelect("product.categories", "categories"); // Include categories

      // Apply filters dynamically

      // Search by name or description
      if (filters.search) {
        query.andWhere(
          "(product.name ILIKE :search OR product.description ILIKE :search)",
          { search: `%${filters.search}%` }
        );
      }

      // Filter by category
      if (filters.category) {
        query.andWhere("categories.name = :category", {
          category: filters.category,
        });
      }

      // Filter by price range
      if (filters.minPrice !== undefined) {
        query.andWhere("product.price >= :minPrice", {
          minPrice: filters.minPrice,
        });
      }
      if (filters.maxPrice !== undefined) {
        query.andWhere("product.price <= :maxPrice", {
          maxPrice: filters.maxPrice,
        });
      }

      // Filter by vendor
      if (filters.vendorId) {
        query.andWhere("vendor.id = :vendorId", {
          vendorId: filters.vendorId,
        });
      }

      // Apply pagination
      query.skip(skip).take(take);

      // Execute the query
      return query.getMany();
    } catch (error) {
      throw new Error("Error fetching products");
    }
  }

  async getProductById(productId: string) {
    try {
      const productRepo = AppDataSource.getRepository(Product);
      return await productRepo.findOne({
        where: { id: productId },
        relations: ["categories", "images", "vendor"], // Fetch related data
      });
    } catch (error) {
      throw new Error("Product not found. Please try again later.");
    }
  }

  async createProduct(
    userId: string,
    productData: {
      name: string;
      description: string;
      price: number;
      stockLevel: number;
      imageIds: string[];
      categoryIds: string[];
    }
  ) {
    try {
      const { name, description, price, stockLevel, imageIds, categoryIds } = productData;

      const vendorRepo = AppDataSource.getRepository(Vendor);
      const imageRepo = AppDataSource.getRepository(Image);

      // Ensure user is a vendor
      const vendor = await vendorRepo.findOne({
        where: { user: { id: userId } },
      });
      if (!vendor) {
        throw new Error("Vendor not found");
      }

      // Todo: Image to be taken care of
      // Ensure at least one image is provided
      // if (!imageIds || imageIds.length === 0) {
      //   throw new Error("At least one image is required");
      // }

      // Fetch images from DB
      //const images = await imageRepo.findByIds(imageIds);
      let message = `${name} created successfully`;
      // if (images.length !== imageIds.length) {
      //   message = "Some images were not found";
      // }

      const productRepo = AppDataSource.getRepository(Product);
      const newProduct = productRepo.create({
        name,
        description,
        price,
        stockLevel,
        vendor,
        images: imageIds.map((id) => ({ id })),
        categories: categoryIds.map((id) => ({ id })),
      });

      const result = await productRepo.save(newProduct);

      return {
        message: message,
        data: result,
      };
    } catch (error) {
      console.log("error:", error);
      throw new Error("Error creating product");
    }
  }
}
