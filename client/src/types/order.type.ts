import type { Product } from "./product.type";

export interface CartItem extends Product {
  orderQuantity: number;
}
