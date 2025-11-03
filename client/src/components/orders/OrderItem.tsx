import type { RespOrder } from "@/types/order.type";
import { Link } from "react-router-dom";

interface Props {
  order: RespOrder;
}

const OrderItem = ({ order }: Props) => {
  return (
    <div className="flex flex-col md:flex-row gap-5 items-center p-2 rounded-md border border-indigo-500/80 bg-indigo-500/10">
      {/* Product Id & Order Status */}
      <div className="flex flex-row justify-between w-full">
        {/* Product Image & Order info */}
        <div className="flex flex-col md:flex-row gap-5">
          <img
            src={order.productDetails?.images?.at(0)}
            className="my-auto w-[100px] h-[100px] rounded-sm bg-cover"
          />
          <div className="flex flex-col gap-1">
            {/* Product Name & Link */}
            <Link
              to={`/product/${order.productId}`}
              className="text-xs font-semibold mb-2"
            >
              {order.productDetails?.name}
            </Link>
            {/* Order ID */}
            <p className="flex flex-row gap-2 text-xs">
              <span className="dark:text-gray-50/40 text-gray-900/40">ID:</span>
              <span>{order?._id}</span>
            </p>
            {/* Order Quantity */}
            <p className="flex flex-row gap-2 text-xs">
              <span className="dark:text-gray-50/40 text-gray-900/40">
                Qty:
              </span>
              <span>{order?.quantity}</span>
            </p>
            {/* Order Total Amount */}
            <p className="flex flex-row gap-2 text-xs">
              <span className="dark:text-gray-50/40 text-gray-900/40">
                Total:
              </span>
              <span>${order?.totalPrice}</span>
            </p>
            {/* Order Date */}
            <p className="flex flex-row gap-2 text-xs">
              <span className="dark:text-gray-50/40 text-gray-900/40">
                Ordered on:
              </span>
              <span>
                {new Date(order?.createdAt)
                  .toISOString()
                  .split(".")[0]
                  .replace("T", " ")}
              </span>
            </p>
            {/* Delivery Address */}
            <p className="flex flex-row gap-2 text-xs">
              <span className="dark:text-gray-50/40 text-gray-900/40">
                Delivery Address:
              </span>
              <span></span>
            </p>
            {/* Refuse Reason */}
            {order?.status === "refused" && (
              <p className="flex flex-row gap-2 text-xs px-2 py-1 rounded-sm border border-red-500/80 bg-red-500/10">
                <span className="dark:text-gray-50/40 text-gray-900/40">
                  Refuse reason:
                </span>
                <span>{order?.refuseReason}</span>
              </p>
            )}
          </div>
        </div>
        {/* Order Status */}
        <div className="h-fit flex flex-row gap-1 items-center">
          <span
            className={`w-[8px] h-[8px] rounded-full ${
              order?.status === "delivered"
                ? "bg-green-500"
                : order?.status === "prepared"
                ? "bg-yellow-500"
                : order?.status === "refused"
                ? "bg-red-500"
                : "bg-gray-50"
            }`}
          />
          <span className="text-xs">{order?.status}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
