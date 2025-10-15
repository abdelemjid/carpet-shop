export type Status = "pending" | "prepared" | "refused" | "sent" | "delivered";

export const OrderStatusEnum = [
  "pending",
  "prepared",
  "refused",
  "sent",
  "delivered",
];

export const OrderRefuseReasons = [
  "out of stock",
  "product not included anymore",
  "quantity is too much",
];

export interface Order {
  _id: string;
  userId: string;
  productId: string;
  quantity: number;
  delivered: boolean;
  status: Status;
  createdAt: Date;
  totalPrice?: number;
  deliveredAt?: Date;
  refuseReason?: string;
}

export interface OrderUpdateRequestBody {
  _id: string;
  status?: string;
  refuseReason?: string;
}

export interface OrdersQuery {
  page?: number;
  fromDate?: Date;
  toDate?: Date;
  quantityFrom?: number;
  quantityTo?: number;
  status?: string;
}
