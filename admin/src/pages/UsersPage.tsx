import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../apiClient";
import loading from "../assets/loading.svg";
import UserItem from "../components/users/UserItem";
import type { User } from "../types/user.type";
import { useEffect } from "react";

const UsersPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: apiClient.fetchUsers,
  });

  const { isPending: isPendingBan, mutate: banUser } = useMutation({
    mutationFn: apiClient.banUser,
  });

  const { isPending: isPendingDelete, mutate: deleteUser } = useMutation({
    mutationFn: apiClient.deleteUser,
  });

  const handleBan = async (userId: string) => {
    banUser(userId);
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const handleDelete = async (userId: string) => {
    deleteUser(userId);
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  useEffect(() => {
    refetch();
  }, [isPendingBan, isPendingDelete]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <img className="w-[35px] h-[35px]" src={loading} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      {data?.users.map((user: User) => (
        <UserItem
          user={user}
          handleDelete={handleDelete}
          handleBan={handleBan}
          key={user._id}
        />
      ))}
    </div>
  );
};

export default UsersPage;
