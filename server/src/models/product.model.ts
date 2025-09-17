import mongoose, { Schema, Document } from 'mongoose';

export interface Product extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  createdAt: Date;
}

const productSchema = new Schema<Product>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
  },
  { timestamps: true },
);

export default mongoose.model<Product>('Product', productSchema);
