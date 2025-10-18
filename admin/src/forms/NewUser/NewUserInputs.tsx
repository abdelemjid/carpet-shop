import { Input } from "@/components/ui/input";
import UserRoleSelector from "./UserRoleSelector";
import type { UserAccount } from "@/types/user.type";
import { useFormContext } from "react-hook-form";

const NewUserInputs = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<UserAccount>();

  return (
    <div className="flex flex-col gap-3">
      {/* Username */}
      <Input
        type="text"
        placeholder="Username"
        {...register("username", { required: "* username is required" })}
      />
      {/* Username Error */}
      {errors.username && (
        <p className="text-xs font-semibold text-red-500">
          {errors.username?.message}
        </p>
      )}
      {/* Email */}
      <Input
        type="email"
        placeholder="Email"
        {...register("email", { required: "* email is required" })}
      />
      {/* Email Error */}
      {errors.email && (
        <p className="text-xs font-semibold text-red-500">
          {errors.email?.message}
        </p>
      )}
      <div className="flex flex-col md:flex-row gap-2">
        {/* Password */}
        <Input
          type="password"
          placeholder="Password"
          {...register("password", { required: "* password is required" })}
        />
        {/* User Role */}
        <UserRoleSelector />
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        {/* Password Error */}
        {errors.password && (
          <p className="text-xs font-semibold text-red-500">
            {errors.password?.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default NewUserInputs;
