import { AppDataSource } from "../../config/db";
import { Category } from "./categoryModel";

export class CategoryService {
  private CategoryRepo = AppDataSource.getRepository(Category);

  async getAllCategory(data: any) {
    const categoryGetAll = await this.CategoryRepo.find({
    });
    return { data: categoryGetAll };
  }
}
