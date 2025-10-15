import mongoose, { Schema } from 'mongoose';
import { Order } from '../types/order.type';

const orderSchema = new Schema<Order>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    delivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date, required: false },
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'prepared', 'refused', 'sent', 'delivered'],
      required: true,
      default: 'pending',
    },
    totalPrice: { type: Number, required: false },
    refuseReason: { type: String, required: false },
  },
  { timestamps: true },
);

export default mongoose.model<Order>('Order', orderSchema);
