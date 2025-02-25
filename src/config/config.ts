import dotenv from "dotenv";
import path from "path";


const envFile = `.env.${process.env.NODE_ENV || "local"}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log(`Using ${envFile} configuration`);

export default {
  databaseUrl: process.env.DATABASE_URL,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT) || 5432, 
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "production",
};
