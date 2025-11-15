import { useQuery } from "@tanstack/react-query";
import loading from "@/assets/loading.svg";
import OrderItem from "@/components/orders/OrderItem";
import { ApiClient } from "@/utils/ApiClient";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import OrdersPagination from "@/components/orders/OrdersPagination";

const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState<number>(
    Number(searchParams.get("page")) || 1
  );
  const {
    data: orders,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["orders", { page }],
    queryFn: () => ApiClient.getOrders(page),
  });

  useEffect(() => {
    setSearchParams({ page: String(page) });
    refetch();
  }, [page]);

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
      {/* Orders */}
      <div className="flex flex-col gap-1">
        {orders &&
          orders.orders.map((order) => (
            <OrderItem key={order?._id} order={order} />
          ))}
      </div>
      {/* Orders Pagination */}
      <OrdersPagination
        hasNext={orders?.pagination?.hasNext}
        hasPrev={orders?.pagination?.hasPrev}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default Orders;
