import { useMutation, useQuery } from "@tanstack/react-query";
import loading from "../assets/loading.svg";
import {
  OrderStatusEnum,
  type Order,
  type OrdersQuery,
  type OrderUpdateRequestBody,
} from "@/types/order.type";
import { useEffect } from "react";
import OrderItem from "@/components/orders/OrderItem";
import OrdersFilter from "@/components/orders/OrdersFilter";
import PaginationView from "@/components/PaginationView";
import OrderHeader from "@/components/orders/OrderHeader";
import { ApiClient } from "@/utils/ApiClient";
import { useOrdersFilterContext } from "@/contexts/orders/OrdersFilterContext";

const OrdersPage = () => {
  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    fQuantity,
    setFQuantity,
    tQuantity,
    setTQuantity,
    status,
    setStatus,
    page,
    setPage,
    clearFilter,
  } = useOrdersFilterContext();

  const query: OrdersQuery = {};

  if (page) query.page = page;
  if (fromDate) query.fromDate = fromDate.toISOString().split("T")[0];
  if (toDate) query.toDate = toDate.toISOString().split("T")[0];
  if (fQuantity) query.quantityFrom = fQuantity;
  if (tQuantity) query.quantityTo = tQuantity;
  if (status && OrderStatusEnum.includes(status)) query.status = status;

  const {
    data: orderData,
    refetch: refetchOrders,
    isLoading: ordersLoading,
  } = useQuery({
    queryKey: ["allOrders", query],
    queryFn: () => ApiClient.fetchAllOrders(query),
  });

  const { mutate: updateOrder, isPending: updateStatusLoading } = useMutation({
    mutationFn: ApiClient.updateOrder,
  });

  const handleStatus = async (
    _id: string,
    value: { status?: string; refuseReason?: string }
  ) => {
    const data: OrderUpdateRequestBody = {
      _id: _id,
    };

    if (value.status) data.status = value.status;
    if (value.refuseReason) data.refuseReason = value.refuseReason;

    updateOrder(data);
  };

  useEffect(() => {
    refetchOrders();
  }, [
    updateStatusLoading,
    page,
    fQuantity,
    tQuantity,
    status,
    fromDate,
    toDate,
  ]);

  if (ordersLoading) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <img className="w-[35px] h-[35px]" src={loading} />
      </div>
    );
  }

  if (!orderData || !orderData.orders) {
    return (
      <div className="flex justify-center items-center py-2 rounded-md border border-gray-50/20 bg-gray-900/20">
        No orders yet
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-8">
      {/* Orders Filter */}
      <OrdersFilter
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        fQuantity={fQuantity}
        tQuantity={tQuantity}
        setFQuantity={setFQuantity}
        setTQuantity={setTQuantity}
        status={status}
        setStatus={setStatus}
        page={page}
        setPage={setPage}
        clearFilter={clearFilter}
      />
      {/* Orders */}
      {orderData.orders.length === 0 ? (
        <div className="flex justify-center items-center py-2 rounded-md border border-gray-50/20 bg-gray-900/20">
          No orders yet
        </div>
      ) : (
        <div className="flex flex-col gap-2 my-10">
          <OrderHeader />
          {orderData.orders.map((order: Order) => (
            <OrderItem
              order={order}
              key={order?._id}
              updateStatus={handleStatus}
            />
          ))}
        </div>
      )}
      {/* Pagination */}
      {orderData?.orders?.length > 0 && (
        <PaginationView
          key={`key-pagination`}
          page={page}
          setPage={setPage}
          hasNext={orderData.pagination.hasNext}
          hasPrev={orderData.pagination.hasPrev}
        />
      )}
    </div>
  );
};

export default OrdersPage;
