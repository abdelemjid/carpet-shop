type OrderStatus = "pending" | "prepared" | "refused" | "sent" | "delivered";

export interface OrderType {
  _id: string;
  userId: string;
  productId: string;
  quantity: number;
  delivered: boolean;
  status: OrderStatus;
  createdAt: Date;
  totalPrice?: number;
  deliveredAt?: Date;
  refuseReason?: string;
}

export interface RespOrder extends OrderType {
  productDetails?: {
    name: string;
    images: string[];
  };
}

export interface OrdersResponse {
  orders: RespOrder[];
  pagination: {
    page: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
