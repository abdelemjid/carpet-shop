import { LogIn, Mail, UserCog, User as UserIcon } from "lucide-react";
import type { User } from "../../types/user.type";
import { Link } from "react-router-dom";

interface Props {
  user: User;
  handleBan: (userId: string) => void;
  handleDelete: (userId: string) => void;
}

const UserItem = ({ user, handleBan, handleDelete }: Props) => {
  return (
    <div className="w-full flex flex-col gap-3 sm:gap-0 sm:flex-row items-center justify-items-start md:justify-between md:gap-8 px-4 py-3 border border-gray-50/20 bg-gray-900/20 backdrop-blur-md rounded-md">
      {/* Icon */}
      <div className="w-full flex flex-row justify-center md:justify-start items-center gap-2">
        <UserIcon size={20} />
        <p className="text-xs font-semibold">{user.username}</p>
      </div>

      {/* Username & Email */}
      <Link to={`/admin/users/${user?._id}`} className="w-full">
        <div className="w-full flex flex-row gap-2">
          <Mail size={20} />
          <p className="text-sm">{user.email}</p>
        </div>
      </Link>

      {/* Status */}
      <div className="w-full flex flex-row items-center gap-2">
        <UserCog size={20} />
        <p
          className={`text-xs ${
            user.banned ? "text-red-400" : "text-green-400"
          }`}
        >
          {user.banned
            ? `banned on ${
                user.dateOfBan &&
                new Date(user.dateOfBan)
                  .toISOString()
                  .replace("T", " ")
                  .split(".")[0]
              }`
            : "Active"}
        </p>
      </div>

      {/* Join date */}
      <div className="w-full flex flex-row items-center gap-2">
        <LogIn size={20} />
        <p className="text-xs font-semibold">
          {user?.createdAt &&
            new Date(user.createdAt)
              .toISOString()
              .replace("T", " ")
              .split(".")[0]}
        </p>
      </div>

      {/* Buttons */}
      <div className="w-full md:w-fit flex flex-row items-center justify-between  md:items-center md:justify-center gap-2">
        <button
          onClick={() => {
            if (user?._id) handleDelete(user?._id);
          }}
          className="w-full text-sm cursor-pointer md:w-fit rounded-md bg-red-500 hover:bg-red-400 px-2 py-1 transition-all duration-200 ease-in-out"
        >
          Remove
        </button>
        <button
          onClick={() => {
            if (user._id) handleBan(user?._id);
          }}
          className={`w-full text-sm cursor-pointer md:w-fit rounded-md px-2 py-1 transition-all duration-200 ease-in-out ${
            user.banned
              ? "bg-green-500 hover:bg-green-400"
              : "bg-blue-500 hover:bg-blue-400"
          }`}
        >
          {user.banned ? "Permit" : "Ban"}
        </button>
      </div>
    </div>
  );
};

export default UserItem;
