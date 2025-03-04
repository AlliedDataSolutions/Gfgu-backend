import { AppDataSource } from "../../config/db";
import { Category } from "./categoryModel";
import { Product } from "./productModel";

export class ProductService {
  private ProductRepo = AppDataSource.getRepository(Product);
  // private CategoryRepo = AppDataSource.getRepository(Product);

  async getAllProduct(filter: any, skip: number, take: number) {
   
    const productGetAll = await this.ProductRepo.find({
      skip: skip,
      take: take,
    });

    

    return {data: productGetAll};
  }


  async getProductByCategory(filter: any ) {
   
    // const productGetAll = await this.CategoryRepo.findBy(filter);

    const products = await AppDataSource.getRepository(Product).find({
      relations: ["categories"],
    });
    console.log(products);
    

    

    return {data: products};
  }
}
