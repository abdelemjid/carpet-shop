import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export type UserStatus = "active" | "banned";

interface Props {
  userStatus?: UserStatus | undefined;
  setUserStatus: (status: string | undefined) => void;
}

const UserStatusFilter = ({ userStatus, setUserStatus }: Props) => {
  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="user-status-select" className="px-1 text-xs">
        User Status
      </Label>
      <Select
        value={userStatus}
        defaultValue={undefined}
        onValueChange={(value) => setUserStatus(value)}
      >
        <SelectTrigger id="user-status-select" className="w-[180px] text-xs">
          <SelectValue placeholder="Select User Status" />
        </SelectTrigger>
        <SelectContent className="text-xs">
          <SelectGroup>
            <SelectLabel>User Status</SelectLabel>
            <SelectItem value="undefined">Default</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserStatusFilter;
