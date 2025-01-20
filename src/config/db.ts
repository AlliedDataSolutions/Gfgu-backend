import { DataSource } from "typeorm";
import { Credential } from "../features/auth/credential";
import { User } from "../features/user/user";
import { Product } from "../features/product/productModel";
<<<<<<< HEAD
import { ProductImage } from "../features/product/ProductImage";
import { Image } from "../features/product/ImageModel";
=======
>>>>>>> 660ef4f (create a product table)


const AppDataSource = new DataSource({
    type: "postgres",
    host: "db",
    port: 5432,
    username: "user123",
    password: "password123",
    database: "db123",
    synchronize: true, //set to false in production
    logging: true,
<<<<<<< HEAD
    entities: [Credential, User, Product, ProductImage, Image]
=======
    entities: [Credential, User, Product]
>>>>>>> 660ef4f (create a product table)
})

let isInitialized = false;

const initializeDatabase = async () => {
  if (!isInitialized) {
    await AppDataSource.initialize();
    isInitialized = true;
    console.log("Data Source has been initialized!");
  }
};

export { AppDataSource, initializeDatabase };