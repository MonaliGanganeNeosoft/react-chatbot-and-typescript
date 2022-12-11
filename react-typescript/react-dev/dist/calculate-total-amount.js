"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalAmount = void 0;
function calculateTotalAmount(order) {
    let total = order.calculatetTotal();
    const discount = total * 0.1;
    total -= discount;
    const tax = total * 0.2;
    total += tax;
    return total;
}
exports.calculateTotalAmount = calculateTotalAmount;
