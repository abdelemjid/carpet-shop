export interface CheckoutResponse {
  totalItems: number;
  totalPrice: number;
  insufficientStock?: string[];
  notFoundProducts?: string[];
}
