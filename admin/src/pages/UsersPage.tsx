import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import loading from "../assets/loading.svg";
import UserItem from "../components/users/UserItem";
import type { User, UsersFilterSearchQuery } from "../types/user.type";
import { useEffect, useState } from "react";
import UsersFilter from "@/components/users/UsersFilter";
import PaginationView from "@/components/PaginationView";
import NewUserButton from "@/components/users/NewUserButton";
import { ApiClient } from "@/utils/ApiClient";
import { useUsersFilterContext } from "@/contexts/user/UsersFilterContext";

const UsersPage = () => {
  const [hidden, setHidden] = useState<boolean>(false);
  const [lastScroll, setLastScroll] = useState<number>(0);
  const {
    clearFilter,
    joinDateFrom,
    setJoinDateFrom,
    joinDateTo,
    setJoinDateTo,
    page,
    setPage,
    userStatus,
    setUserStatus,
  } = useUsersFilterContext();

  const query: UsersFilterSearchQuery = {
    joinDateFrom: joinDateFrom?.toISOString().split("T")[0],
    joinDateTo: joinDateTo?.toISOString().split("T")[0],
    page,
    banned:
      userStatus === "banned"
        ? true
        : userStatus === "undefined"
        ? undefined
        : false,
  };

  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", query],
    queryFn: () => ApiClient.fetchUsers(query),
  });

  const { isPending: isPendingBan, mutate: banUser } = useMutation({
    mutationFn: ApiClient.banUser,
  });

  const { isPending: isPendingDelete, mutate: deleteUser } = useMutation({
    mutationFn: ApiClient.deleteUser,
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
  }, [
    isPendingBan,
    isPendingDelete,
    userStatus,
    joinDateFrom,
    joinDateTo,
    page,
  ]);

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
        joinDateFrom={joinDateFrom}
        setJoinDateFrom={setJoinDateFrom}
        joinDateTo={joinDateTo}
        setJoinDateTo={setJoinDateTo}
        userStatus={userStatus}
        setUserStatus={setUserStatus}
        clearFilter={clearFilter}
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
