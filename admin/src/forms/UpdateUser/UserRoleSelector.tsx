import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserUpdateRequest } from "@/types/user.type";
import { useFormContext } from "react-hook-form";

const UserRoleSelector = () => {
  const { register, watch, setValue } = useFormContext<UserUpdateRequest>();
  const roleValue = watch("role");

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="role" className="text-xs font-semibold">
        User Role
      </Label>
      <Select
        value={roleValue}
        onValueChange={(value) => setValue("role", value)}
      >
        <SelectTrigger id="user-role-selector" className="w-[180px] text-xs">
          <SelectValue placeholder="Select User's Role" />
        </SelectTrigger>
        <SelectContent
          {...register("role", { required: "* user's role is required" })}
        >
          <SelectGroup>
            <SelectLabel>User Role</SelectLabel>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserRoleSelector;
