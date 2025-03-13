"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const credentialModel_1 = require("../features/auth/credentialModel");
const userModel_1 = require("../features/user/userModel");
const payment_1 = require("../features/payment");
const order_1 = require("../features/order");
const product_1 = require("../features/product");
const image_1 = require("../features/image");
const user_1 = require("../features/user");
const address_1 = require("../features/address");
const config_1 = __importDefault(require("./config"));
console.log(`DB Server is running on port ${config_1.default.port}`);
// console.log(`host:: ${config.host}`);
// console.log(`username:: ${config.username}`);
// console.log(`password:: ${config.password}`);
// console.log(`database:: ${config.database}`);
const AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    //url: config.databaseUrl,
    host: config_1.default.host,
    port: config_1.default.port,
    username: config_1.default.username,
    password: config_1.default.password,
    database: config_1.default.database,
    synchronize: config_1.default.synchronize,
    logging: config_1.default.logging,
    entities: [
        credentialModel_1.Credential,
        userModel_1.User,
        payment_1.Payment,
        order_1.Order,
        product_1.Product,
        image_1.Image,
        product_1.Category,
        order_1.OrderLine,
        user_1.Vendor,
        address_1.Address
    ],
});
exports.AppDataSource = AppDataSource;
let isInitialized = false;
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!isInitialized) {
        yield AppDataSource.initialize();
        isInitialized = true;
        console.log("Data Source has been initialized!");
    }
});
exports.initializeDatabase = initializeDatabase;
