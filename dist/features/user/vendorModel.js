"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vendor = void 0;
const typeorm_1 = require("typeorm");
const confirmationStatus_1 = require("./confirmationStatus");
const userModel_1 = require("../user/userModel");
const order_1 = require("../order");
const product_1 = require("../product");
let Vendor = class Vendor {
};
exports.Vendor = Vendor;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Vendor.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => userModel_1.User, (user) => user.vendor),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", userModel_1.User)
], Vendor.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_1.Product, (product) => product.vendor),
    __metadata("design:type", Array)
], Vendor.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_1.OrderLine, (orderLine) => orderLine.vendor),
    __metadata("design:type", Array)
], Vendor.prototype, "orderLines", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vendor.prototype, "businessName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vendor.prototype, "businessDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: confirmationStatus_1.ConfirmationStatus,
        default: confirmationStatus_1.ConfirmationStatus.pending,
    }),
    __metadata("design:type", String)
], Vendor.prototype, "status", void 0);
exports.Vendor = Vendor = __decorate([
    (0, typeorm_1.Entity)()
], Vendor);
