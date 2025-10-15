import mongoose, { Schema } from 'mongoose';
import { Product } from '../types/product.type';

const productSchema = new Schema<Product>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    width: { type: Number, required: true, min: 1 },
    height: { type: Number, required: true, min: 1 },
    images: [{ type: String }],
    category: { type: String, required: true, default: 'l' },
  },
  { timestamps: true },
);

export default mongoose.model<Product>('Product', productSchema);
