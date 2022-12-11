import { calculateTotalAmount } from "./lib/calculate-total-amount";
import { ShoppingCart } from "./lib/shopping-cart";

const cart = new ShoppingCart();
console.log(`The cart's total is ${calculateTotalAmount(cart)}`);
