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
        .leftJoin("product.vendor", "vendor") // Join vendor but don't fetch full entity
        .leftJoin("product.images", "images") 
        .leftJoin("product.categories", "categories")
        .addSelect([
          "vendor.id",
          "vendor.businessName",
          "vendor.businessDescription", // Only fetch these vendor fields
          "images.id",
          "images.url", // Only fetch image URLs
          "categories.id",
          "categories.type",
          "categories.description", // Fetch category type and description
        ]);

      // Apply filters dynamically

      // Search by name or description
      if (filters.search) {
        query.andWhere(
          "(product.name ILIKE :search OR product.description ILIKE :search OR categories.description ILIKE :search)",
          { search: `%${filters.search}%` }
        );
      }

      // Filter by category
      if (filters.category) {
        query.andWhere("categories.type ILIKE :category", {
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
      imageUrls: string[];
      categoryIds: string[];
    }
  ) {
    try {
      const { name, description, price, stockLevel, imageUrls, categoryIds } =
        productData;

      const vendorRepo = AppDataSource.getRepository(Vendor);
      const imageRepo = AppDataSource.getRepository(Image);
      const productRepo = AppDataSource.getRepository(Product);

      // Ensure user is a vendor
      const vendor = await vendorRepo.findOne({
        where: { user: { id: userId } },
      });
      if (!vendor) {
        throw new Error("Vendor not found");
      }

      if (!imageUrls || imageUrls.length === 0) {
        throw new Error("At least one image is required");
      }

      // Create Image entities and associate URLs
      const images = imageUrls.map((url: string) => {
        const image = new Image();
        image.url = url;
        return image;
      });

      // Save Images and Link to Product
      const savedImages = await imageRepo.save(images);

      const newProduct = productRepo.create({
        name,
        description,
        price,
        stockLevel,
        vendor,
        images: savedImages,
        categories: (categoryIds ?? []).map((id) => ({ id })),
      });

      const result = await productRepo.save(newProduct);

      let message = `${name} created successfully`;
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
