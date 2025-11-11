export interface CheckoutResponse {
  totalItems: number;
  totalPrice: number;
  insufficientStock?: string[];
  notFoundProducts?: string[];
}

export interface CheckoutForm {
  fullname: string;
  email?: string;
  phoneNumber: string;
  city: string;
  address: string;
}
