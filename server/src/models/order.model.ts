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
    fullname: { type: String, required: true },
    email: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    city: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    totalPrice: { type: Number, required: false },
    refuseReason: { type: String, required: false },
  },
  { timestamps: true },
);

export default mongoose.model<Order>('Order', orderSchema);
