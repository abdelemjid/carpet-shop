import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import type { Order, OrderUpdateRequestBody } from "../types/order.type";
import { useEffect } from "react";
import OrderItem from "@/components/orders/OrderItem";
import { toast } from "sonner";
import type { UserUpdateRequest } from "@/types/user.type";
import UserDetailsForm from "@/forms/UpdateUser/UserDetailsForm";
import { ApiClient } from "@/utils/ApiClient";

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
    isSuccess: isUserLoaded,
    refetch: refetchUser,
  } = useQuery({
    queryKey: [userId],
    queryFn: () => ApiClient.fetchUser(userId),
  });

  const {
    data: ordersData,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: [`orders: ${userId}`],
    queryFn: () => ApiClient.fetchUserOrders(userId),
  });

  // Update user info
  const { mutate: updateUser, isSuccess: isUpdated } = useMutation({
    mutationKey: ["change-user-role", userId],
    mutationFn: async (info: UserUpdateRequest) => {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(info),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result?.error || "Error changing user's role!");
        return;
      }

      toast.success(result?.message || "User's role change successfully.");
    },
  });

  const { mutate: deleteUser, isSuccess: isDeleted } = useMutation({
    mutationFn: ApiClient.deleteUser,
  });

  const { mutate: updateOrder, isPending: updateOrderPending } = useMutation({
    mutationFn: ApiClient.updateOrder,
  });

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
  }, [isUserLoaded, isDeleted, isUpdated]);

  useEffect(() => {
    refetchOrders();
  }, [updateOrderPending, ordersLoading]);

  return (
    <div className="flex flex-col gap-10">
      {/* User Info */}
      <UserDetailsForm
        user={user}
        onSave={updateUser}
        handleDelete={deleteUser}
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
