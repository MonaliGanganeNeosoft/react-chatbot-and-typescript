import { IOrder } from "./calculate-total-amount";
export class ShoppingCart implements IOrder {
  calculatetTotal(): number {
    return 100;
  }
}
