import dotenv from "dotenv";
import path from "path";


const envFile = `.env.${process.env.NODE_ENV || "local"}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log(`Using ${envFile} configuration`);
console.log(`host: ${process.env.DB_HOST} `);
console.log(`username: ${process.env.DB_USER} `);
console.log(`database: ${process.env.POSTGRES_DATABASE} `);
console.log(`port: ${process.env.POSTGRES_PORT} `);

export default {
  databaseUrl: process.env.DB_URL,
  host: process.env.DB_HOST,
  port: Number(process.env.POSTGRES_PORT) || 5432, 
  username: process.env.DB_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "production",
};
