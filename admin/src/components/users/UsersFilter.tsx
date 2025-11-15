import { X } from "lucide-react";
import DateFilter from "../home/DateFilter";
import { Button } from "../ui/button";
import UserStatusFilter, { type UserStatus } from "./UserStatusFilter";

interface Props {
  joinDateFrom?: Date | undefined;
  joinDateTo?: Date | undefined;
  userStatus?: string | undefined;
  setJoinDateFrom: (dateFrom: Date | undefined) => void;
  setJoinDateTo: (dateTo: Date | undefined) => void;
  setUserStatus: (userStatus: string | undefined) => void;
  clearFilter: () => void;
}

const UsersFilter = ({
  joinDateFrom,
  setJoinDateFrom,
  joinDateTo,
  setJoinDateTo,
  userStatus,
  setUserStatus,
  clearFilter,
}: Props) => {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:flex-4">
      {/* Date Filter */}
      <DateFilter
        fromDate={joinDateFrom}
        setFromDate={setJoinDateFrom}
        toDate={joinDateTo}
        setToDate={setJoinDateTo}
      />
      {/* User Status Filter */}
      <UserStatusFilter
        setUserStatus={setUserStatus}
        userStatus={userStatus as UserStatus}
      />
      {/* Clear Button */}
      <Button
        variant="outline"
        onClick={() => clearFilter()}
        className="text-red-500 cursor-pointer self-end"
      >
        <X /> Clear
      </Button>
    </div>
  );
};

export default UsersFilter;
