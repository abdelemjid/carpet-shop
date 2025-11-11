import { Types } from 'mongoose';

type OrderStatus = 'pending' | 'prepared' | 'refused' | 'sent' | 'delivered';

export interface Order {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  delivered: boolean;
  status: OrderStatus;
  fullname: string;
  phoneNumber: string;
  city: string;
  shippingAddress: string;
  email?: string;
  createdAt?: Date;
  totalPrice?: number;
  deliveredAt?: Date;
  refuseReason?: string;
}

export interface RespOrder extends Order {
  productDetails?: {
    name: string;
    images: string[];
  };
}

export interface OrdersResponse {
  orders?: RespOrder[];
  pagination?: {
    page: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
