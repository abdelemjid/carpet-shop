import mongoose, { Schema } from 'mongoose';
import { CartItem } from '../types/cart.item.type';

const cartModel = new Schema<CartItem>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    orderQuantity: { type: Number, required: true, min: 1, max: 9999 },
    productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    productImages: { type: [String], required: true },
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: false },
  },
  { timestamps: true },
);

export default mongoose.model<CartItem>('cart', cartModel);
