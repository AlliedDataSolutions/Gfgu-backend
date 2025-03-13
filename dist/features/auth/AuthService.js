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
exports.AuthService = void 0;
const db_1 = require("../../config/db");
const user_1 = require("../user");
const credentialModel_1 = require("./credentialModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const role_1 = require("./role");
class AuthService {
    constructor() {
        this.userRepo = db_1.AppDataSource.getRepository(user_1.User);
        this.credentialRepo = db_1.AppDataSource.getRepository(credentialModel_1.Credential);
        this.vendorRepo = db_1.AppDataSource.getRepository(user_1.Vendor);
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password, role, businessName } = data;
            // Check if email already exists
            const existingCredential = yield this.credentialRepo.findOne({
                where: { email },
            });
            if (existingCredential)
                throw new Error("Email already in use");
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = this.userRepo.create({ firstName, lastName, email });
            yield this.userRepo.save(user);
            // Create credential entity
            const credential = this.credentialRepo.create({
                email,
                password: hashedPassword,
                role,
                user,
            });
            yield this.credentialRepo.save(credential);
            // If vendor, create vendor entity
            if (role === role_1.Role.vendor) {
                const vendor = this.vendorRepo.create({ businessName, user });
                yield this.vendorRepo.save(vendor);
            }
            return { message: "User registered successfully" };
        });
    }
}
exports.AuthService = AuthService;
