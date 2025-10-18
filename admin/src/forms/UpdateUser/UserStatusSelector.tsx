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

const UserStatusSelector = () => {
  const { register, watch, setValue } = useFormContext<UserUpdateRequest>();
  const value = watch("banned");

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="banned" className="text-xs font-semibold">
        User Status
      </Label>
      <Select
        value={value}
        onValueChange={(value) => setValue("banned", value)}
      >
        <SelectTrigger id="banned" className="w-[180px] text-xs">
          <SelectValue placeholder="Select User's Role" />
        </SelectTrigger>
        <SelectContent
          {...register("role", { required: "* user's role is required" })}
        >
          <SelectGroup>
            <SelectLabel>User Status</SelectLabel>
            <SelectItem value="false">Active</SelectItem>
            <SelectItem value="true">Banned</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserStatusSelector;
