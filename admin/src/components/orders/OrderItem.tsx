import { Link } from "react-router-dom";
import {
  OrderRefuseReasons,
  OrderStatusEnum,
  type Order,
} from "../../types/order.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./../ui/select";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "./../ui/radio-group";
import { Label } from "@/components/ui/label";

interface Props {
  order: Order;
  updateStatus: (_id: string, value: object) => void;
}

const OrderItem = ({ order, updateStatus }: Props) => {
  const [status, setStatus] = useState<string>(order?.status);

  const handleStatusChange = (value: string) => {
    updateStatus(order._id, { status: value });
    setStatus(value);
  };

  const handleReasonChange = (value: string) => {
    updateStatus(order._id, { refuseReason: value || null });
  };

  return (
    <div className="w-full flex flex-col gap-2 p-3 rounded-md bg-gray-900/20 backdrop-blur-md border border-gray-50/20">
      {/* Order Info */}
      <div className="w-full flex flex-col md:flex-row gap-2 justify-around items-start md:items-center">
        {/* Product Id */}
        <div className="flex-1 flex flex-row justify-center items-center gap-2">
          <span className="w-[70px] text-xs md:hidden">Product Id:</span>
          <Link to={`/admin/products/${order?.productId}`}>
            <span className="text-xs transition-all ease-in-out duration-150 hover:text-indigo-400">
              {order?.productId}
            </span>
          </Link>
        </div>
        {/* Quantity */}
        <div className="flex-1 flex flex-row justify-center items-center gap-2">
          <span className="w-[70px] text-xs md:hidden">Quantity:</span>
          <span className="text-xs text-center">{order?.quantity}</span>
        </div>
        {/* Delivered */}
        <div className="flex-1 flex flex-row justify-center items-center gap-2">
          <span className="w-[70px] text-xs md:hidden">Delivered:</span>
          <span
            className={`text-xs text-center ${
              order?.delivered ? "text-green-400" : "text-red-400"
            }`}
          >
            {order?.delivered ? "Yes" : "Not Yet"}
          </span>
        </div>

        {/* Order Date */}
        <div className="flex-1 flex flex-row justify-center items-center gap-2">
          <span className="w-[70px] text-xs md:hidden">Order date:</span>
          <span className="text-xs text-center">
            {order?.createdAt &&
              new Date(order.createdAt)
                .toISOString()
                .replace("T", " ")
                .split(".")[0]}
          </span>
        </div>

        {/* Total Price */}
        <div className="flex-1 flex flex-row justify-center items-center gap-2">
          <span className="w-[70px] text-xs md:hidden">Total price:</span>
          <span className="text-xs text-center">${order?.totalPrice}</span>
        </div>

        {/* Order Status */}
        <Select onValueChange={handleStatusChange} defaultValue={order?.status}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {OrderStatusEnum.map((val) => (
              <SelectItem value={val} key={`st-${val}`}>
                {val}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Refuse Reason */}
      {status === "refused" && (
        <div className="flex flex-row md:flex-col gap-2 p-1 rounded-md border border-red-400/60 bg-red-400/10">
          <RadioGroup
            defaultValue={order?.refuseReason}
            onValueChange={handleReasonChange}
            className="flex flex-col md:flex-row gap-3 justify-center md:items-center py-2"
          >
            {OrderRefuseReasons.map((value) => (
              <div key={`reason-${value}`} className="flex items-center gap-3">
                <RadioGroupItem value={value} id={`rb-${value}`} />
                <Label htmlFor={`rb-${value}`}>{value}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  );
};

export default OrderItem;
