import { Types } from 'mongoose';

export interface CartItem {
  _id?: string | Types.ObjectId;
  userId?: string | Types.ObjectId;
  productId: string | Types.ObjectId;
  productName: string;
  productPrice: number;
  productImages: string[];
  orderQuantity: number;
  confirmed: boolean;
  totalPrice?: number;
  createdAt?: Date;
}
