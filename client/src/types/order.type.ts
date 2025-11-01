export interface CartItem {
  _id?: string;
  userId?: string;
  productId: string;
  orderQuantity: number;
  productPrice: number;
  productImages: string[];
  productName: string;
  totalPrice?: number;
}
