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
exports.OrderLine = void 0;
const typeorm_1 = require("typeorm");
const orderModel_1 = require("./orderModel");
const product_1 = require("../product");
const user_1 = require("../user");
let OrderLine = class OrderLine {
};
exports.OrderLine = OrderLine;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], OrderLine.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => orderModel_1.Order, (order) => order.orderLines, { onDelete: "CASCADE" }),
    __metadata("design:type", orderModel_1.Order)
], OrderLine.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_1.Product, (product) => product.orderLines),
    __metadata("design:type", product_1.Product)
], OrderLine.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.Vendor, (vendor) => vendor.orderLines),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_1.Vendor)
], OrderLine.prototype, "vendor", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderLine.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], OrderLine.prototype, "discountStartDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], OrderLine.prototype, "discountEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], OrderLine.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], OrderLine.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OrderLine.prototype, "createdDate", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], OrderLine.prototype, "modifiedDate", void 0);
exports.OrderLine = OrderLine = __decorate([
    (0, typeorm_1.Entity)("orderLine")
], OrderLine);
