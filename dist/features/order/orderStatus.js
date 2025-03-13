"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["pending"] = "pending";
    OrderStatus["confirmed"] = "confirmed";
    OrderStatus["shipped"] = "shipped";
    OrderStatus["delivered"] = "delivered";
    OrderStatus["canceled"] = "canceled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
