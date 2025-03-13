"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const envFile = `.env.${process.env.NODE_ENV || "local"}`;
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), envFile) });
console.log(`Using ${envFile} configuration`);
exports.default = {
    databaseUrl: process.env.DB_URL,
    host: process.env.DB_HOST,
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.DB_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.NODE_ENV !== "production",
};
