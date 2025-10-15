import { useMutation, useQuery } from "@tanstack/react-query";
import * as apiClient from "../apiClient";
import { useParams } from "react-router-dom";
import type { Order, OrderUpdateRequestBody } from "../types/order.type";
import { useEffect } from "react";
import UserDetailsCard from "@/components/users/UserDetailsCard";
import OrderItem from "@/components/orders/OrderItem";

const UserOrders = () => {
  const { userId } = useParams();

  if (!userId) {
    return (
      <div className="w-full border border-red-400/50 bg-red-400/20 p-5 rounded-md flex justify-center items-center">
        <p className="text-lg">User ID Invalid</p>
      </div>
    );
  }

  const {
    data: user,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: [userId],
    queryFn: () => apiClient.fetchUser(userId),
  });

  const {
    data: ordersData,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: [`orders: ${userId}`],
    queryFn: () => apiClient.fetchUserOrders(userId),
  });

  const { mutate: banUser, isPending: banPending } = useMutation({
    mutationFn: apiClient.banUser,
  });

  const { mutate: deleteUser, isPending: deletePending } = useMutation({
    mutationFn: apiClient.deleteUser,
  });

  const { mutate: updateOrder, isPending: updateOrderPending } = useMutation({
    mutationFn: apiClient.updateOrder,
  });

  const handleBan = async (userId: string) => {
    banUser(userId);
  };

  const handleDelete = async (userId: string) => {
    deleteUser(userId);
  };

  const updateStatus = async (
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
    refetchUser();
  }, [isUserLoading, deletePending, banPending]);

  useEffect(() => {
    refetchOrders();
  }, [updateOrderPending, ordersLoading]);

  return (
    <div className="flex flex-col gap-10">
      {/* User Info */}
      <UserDetailsCard
        user={user}
        handleBan={handleBan}
        handleDelete={handleDelete}
      />
      {/* User Orders */}
      <div className="w-full flex flex-col gap-2">
        {ordersData?.orders.map((order: Order) => (
          <OrderItem
            order={order}
            key={order?._id}
            updateStatus={updateStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default UserOrders;
