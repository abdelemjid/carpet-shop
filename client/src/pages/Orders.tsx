import { useQuery } from "@tanstack/react-query";
import loading from "@/assets/loading.svg";
import OrderItem from "@/components/orders/OrderItem";
import { ApiClient } from "@/utils/ApiClient";

const Orders = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: ApiClient.getOrders,
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <img src={loading} className="w-[25px]" />
      </div>
    );
  }

  if (!orders) {
    return (
      <div className="p-5 rounded-md bg-indigo-500/10 border border-indigo-500/80 text-center">
        There's not orders yet
      </div>
    );
  }

  return (
    <div className="my-5 w-full flex flex-col gap-5">
      <h1 className="text-lg">Confirmed Orders</h1>
      <div className="flex flex-col gap-1">
        {orders &&
          orders.orders.map((order) => (
            <OrderItem key={order?._id} order={order} />
          ))}
      </div>
    </div>
  );
};

export default Orders;
