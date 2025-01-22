import { DataSource } from "typeorm";
import { Credential } from "../features/auth/credential";
import { User } from "../features/user/user";
// import { OrderLine } from "../features/Order/OrderLine";
import { Payment } from "../features/Payment/payment";
import { Order } from "../features/Order/order";

const AppDataSource = new DataSource({
    type: "postgres",
    host: "db",
    port: 5432,
    username: "user123",
    password: "password123",
    database: "db123",
    synchronize: true, //set to false in production
    logging: true,
   // entities: [Credential, User,Payment, Order, OrderLine]
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