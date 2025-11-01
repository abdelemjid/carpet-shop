import type { CartItem as CartItemType } from "@/types/order.type";
import { Button } from "../ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";

interface Props {
  order: CartItemType;
}

const CartItem = ({ order }: Props) => {
  const { updateOrderQuantity, deleteOrder } = useCartContext();

  const handleDecrement = () => {
    if (order.orderQuantity > 0) {
      updateOrderQuantity(order?.productId as string, order.orderQuantity - 1);
    }
  };

  const handleIncrement = () => {
    updateOrderQuantity(order?.productId as string, order?.orderQuantity + 1);
  };

  return (
    <div className="w-full rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-indigo-500/50 bg-indigo-500/10">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Product Image */}
        <div className="w-full sm:w-32 sm:h-32 flex-shrink-0">
          <img
            src={order?.productImages?.at(0)}
            alt={order?.productName}
            className="w-full h-48 sm:h-full object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Product Name & Delete Button Row */}
          <div className="flex justify-between items-start gap-3 mb-3">
            <h3 className="text-base sm:text-lg font-semibold line-clamp-2 flex-1">
              {order?.productName}
            </h3>
            <Button
              onClick={() => deleteOrder(order?.productId as string)}
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
            >
              <Trash2 size={18} />
            </Button>
          </div>

          {/* Price Info & Quantity Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Price Section */}
            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs text-gray-500 block mb-1">
                  Unit Price
                </span>
                <p className="text-lg font-bold text-gray-600">
                  ${order?.productPrice?.toFixed(2)}
                </p>
              </div>

              <div className="hidden sm:block w-px h-12 bg-gray-200"></div>

              <div>
                <span className="text-xs text-gray-500 block mb-1">
                  Subtotal
                </span>
                <p className="text-lg font-bold text-indigo-600">
                  ${(order?.orderQuantity * order.productPrice).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 mr-2 hidden sm:inline">
                Qty:
              </span>
              <div className="flex items-center gap-1 border border-indigo-400/50 bg-indigo-400/30 rounded-lg p-1">
                <Button
                  onClick={() => handleDecrement()}
                  size="sm"
                  variant="ghost"
                  disabled={order.orderQuantity <= 0}
                  className="h-8 w-8 p-0 hover:bg-white dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus size={16} />
                </Button>

                <span className="min-w-[40px] text-center font-semibold text-gray-900 dark:text-gray-200 text-sm">
                  {order?.orderQuantity}
                </span>

                <Button
                  onClick={() => handleIncrement()}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-white dark:hover:bg-gray-500"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
