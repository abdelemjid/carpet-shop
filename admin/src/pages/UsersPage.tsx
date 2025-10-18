import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../apiClient";
import loading from "../assets/loading.svg";
import UserItem from "../components/users/UserItem";
import type { User, UsersFilterSearchQuery } from "../types/user.type";
import { useEffect, useState } from "react";
import UsersFilter from "@/components/users/UsersFilter";
import PaginationView from "@/components/PaginationView";
import NewUserButton from "@/components/users/NewUserButton";

const UsersPage = () => {
  const [hidden, setHidden] = useState<boolean>(false);
  const [lastScroll, setLastScroll] = useState<number>(0);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);

  const query: UsersFilterSearchQuery = {
    joinDateFrom: dateFrom?.toISOString().split("T")[0],
    joinDateTo: dateTo?.toISOString().split("T")[0],
    page,
    banned:
      status === "banned" ? true : status === "undefined" ? undefined : false,
  };

  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", query],
    queryFn: () => apiClient.fetchUsers(query),
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

  // hide new user button when page is scrolled down
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      setHidden(currentScroll > lastScroll);
      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  useEffect(() => {
    refetch();
  }, [isPendingBan, isPendingDelete, status, dateFrom, dateTo, page]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <img className="w-[35px] h-[35px]" src={loading} />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Users Filter */}
      <UsersFilter
        setJoinDateFrom={setDateFrom}
        setJoinDateTo={setDateTo}
        setUserStatus={setStatus}
        joinDateFrom={dateFrom}
        joinDateTo={dateTo}
        userStatus={status}
      />
      {/* Users */}
      <div className="flex flex-col gap-2 justify-center items-center my-10">
        {data?.users.map((user: User) => (
          <UserItem
            user={user}
            handleDelete={handleDelete}
            handleBan={handleBan}
            key={user._id}
          />
        ))}
      </div>
      {/* Pagination */}
      <PaginationView
        setPage={setPage}
        page={page}
        hasNext={data?.pagination?.hasNext}
        hasPrev={data?.pagination?.hasPrev}
      />
      {/* New User Button */}
      <NewUserButton hidden={hidden} />
    </div>
  );
};

export default UsersPage;
