import { User as UserIcon } from "lucide-react";
import type { User } from "../types/user.type";

interface Props {
  user: User;
  handleBan: (userId: string) => void;
  handleDelete: (userId: string) => void;
}

const UserDetailsCard = ({ user, handleBan, handleDelete }: Props) => {
  return (
    <div className="w-full p-5 rounded-md bg-gray-900/20 border border-gray-50/20 backdrop-blur-md">
      <div className="flex md:flex-row flex-col justify-between items-center gap-5">
        {/* Icon */}
        <div className="flex flex-col justify-center items-center gap-2">
          <UserIcon size={25} />
          <p className="text-sm text-gray-50/70">{user?._id}</p>
        </div>
        {/* User's Username & Email */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <p className="text-md font-semibold">{user?.username}</p>
          <p className="text-sm text-gray-50/70">{user?.email}</p>
        </div>
        {/* User's Status and Creation Date */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <p className="text-xs">
            Created at:
            <span className="ml-2">
              {user?.createdAt &&
                new Date(user.createdAt)
                  .toISOString()
                  .replace("T", " ")
                  .split(".")[0]}
            </span>
          </p>
          <p className="text-sm">
            Status:{" "}
            <span
              className={`ml-2 ${
                user?.banned ? "text-red-400" : "text-green-400"
              }`}
            >
              {user?.banned ? "Banned" : "Active"}
              {user?.banned && (
                <span className="text-xs ml-2">
                  {user?.dateOfBan &&
                    new Date(user.dateOfBan)
                      .toISOString()
                      .replace("T", " ")
                      .split(".")[0]}
                </span>
              )}
            </span>
          </p>
        </div>
        {/* User's Email and Password */}
        <div className="flex-1 flex items-center justify-center gap-2">
          {/* Delete Button  */}
          <button
            className="w-fit rounded-md px-2 py-1 transition-all duration-200 ease-in-out cursor-pointer bg-red-500 hover:bg-red-400"
            onClick={() => user?._id && handleDelete(user?._id)}
          >
            Delete
          </button>
          {/* Ban Button  */}
          <button
            className={`w-fit rounded-md px-2 py-1 transition-all duration-200 ease-in-out cursor-pointer ${
              user?.banned
                ? "bg-green-500 hover:bg-green-400"
                : "bg-blue-500 hover:bg-blue-400"
            }`}
            onClick={() => user?._id && handleBan(user?._id)}
          >
            {user?.banned ? "Permit" : "Ban"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsCard;
