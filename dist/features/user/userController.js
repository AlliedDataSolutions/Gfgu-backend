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
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const db_1 = require("../../config/db");
const userModel_1 = require("./userModel");
const user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Example: Fetching a user
    const userRepository = db_1.AppDataSource.getRepository(userModel_1.User);
    const users = yield userRepository.find();
    res.status(200).json(users);
});
exports.user = user;
