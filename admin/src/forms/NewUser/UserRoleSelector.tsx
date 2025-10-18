import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserAccount } from "@/types/user.type";
import { Controller, useFormContext } from "react-hook-form";

const UserRoleSelector = () => {
  const { register, control } = useFormContext<UserAccount>();

  return (
    <Controller
      name="role"
      control={control}
      rules={{ required: "* user's role is required" }}
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          <Select defaultValue="user" onValueChange={field.onChange}>
            <SelectTrigger
              id="user-role-selector"
              className="w-[180px] text-xs"
            >
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
      )}
    />
  );
};

export default UserRoleSelector;
