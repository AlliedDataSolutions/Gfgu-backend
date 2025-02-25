import { DataSource } from "typeorm";
import { Credential } from "../features/auth/credentialModel";
import { User } from "../features/user/userModel";
import { Payment } from "../features/payment";
import { Order, OrderLine } from "../features/order";
import { Product, Category } from "../features/product";
import { Image } from "../features/image";
import { Vendor } from "../features/user";
import { Address } from "../features/address";
import config from "./config";


console.log(`Server is running on port ${config.username}`);

const AppDataSource = new DataSource({
  type: "postgres",
  //url: config.databaseUrl,
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  ssl: {
    rejectUnauthorized: false //true for production
  },
  synchronize: config.synchronize,
  logging: config.logging,
  entities: [
    Credential,
    User,
    Payment,
    Order,
    Product,
    Image,
    Category,
    OrderLine,
    Vendor,
    Address
  ],
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
