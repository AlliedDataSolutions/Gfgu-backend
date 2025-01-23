import { DataSource } from "typeorm";
import { Credential } from "../features/auth/credentialModel";
import { User } from "../features/user/userModel";
import { Payment } from "../features/payment";
import { Order } from "../features/order";
import { Product, Category } from "../features/product";
import { Image } from "../features/image";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "user123",
  password: "password123",
  database: "db123",
  synchronize: true, //set to false in production
  logging: true,
  entities: [Credential, User, Payment, Order, Product, Image, Category],
});

let isInitialized = false;

const initializeDatabase = async () => {
  if (!isInitialized) {
    await AppDataSource.initialize();
    isInitialized = true;
    console.log("Data Source has been initialized!");
  }
};

export { AppDataSource, initializeDatabase };
