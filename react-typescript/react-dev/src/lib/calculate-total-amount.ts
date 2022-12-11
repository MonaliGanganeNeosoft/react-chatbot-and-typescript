export interface IOrder {
  calculatetTotal(): number;
}
export function calculateTotalAmount(order: IOrder) {
  let total = order.calculatetTotal();
  const discount = total * 0.1;
  total -= discount;
  const tax = total * 0.2;
  total += tax;
  return total;
}
