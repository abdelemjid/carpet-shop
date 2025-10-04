import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../apiClient";
import loading from "../assets/loading.svg";

const UsersPage = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: apiClient.fetchUsers,
  });

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <img className="w-[35px] h-[35px]" src={loading} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      Users List
    </div>
  );
};

export default UsersPage;
