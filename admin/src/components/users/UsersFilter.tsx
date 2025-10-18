import DateFilter from "../home/DateFilter";
import UserStatusFilter, { type UserStatus } from "./UserStatusFilter";

interface Props {
  joinDateFrom?: Date | undefined;
  joinDateTo?: Date | undefined;
  userStatus?: string | undefined;
  setJoinDateFrom: (dateFrom: Date | undefined) => void;
  setJoinDateTo: (dateTo: Date | undefined) => void;
  setUserStatus: (userStatus: string | undefined) => void;
}

const UsersFilter = ({
  joinDateFrom,
  setJoinDateFrom,
  joinDateTo,
  setJoinDateTo,
  userStatus,
  setUserStatus,
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
    </div>
  );
};

export default UsersFilter;
