import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User, UserUpdateRequest } from "@/types/user.type";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import UserRoleSelector from "./UserRoleSelector";
import { ShieldUser, User as UserIcon, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserStatusSelector from "./UserStatusSelector";
import { useEffect } from "react";

interface Props {
  user: User;
}

const UserDetails = ({ user }: Props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<UserUpdateRequest>();

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col md:flex-row gap-2">
        {/* User Name */}
        <div className="flex flex-col gap-1">
          <Label id="username" className="text-xs font-semibold">
            User Name
          </Label>
          <Input
            type="text"
            placeholder="Username"
            minLength={3}
            maxLength={30}
            {...register("username")}
            className="outline-none border-none"
          />
          {errors?.username && (
            <span className="text-red-500 text-xs">
              {errors.username.message}
            </span>
          )}
        </div>
        {/* User Email */}
        <div className="flex flex-col gap-1">
          <Label id="email" className="text-xs font-semibold">
            Email
          </Label>
          <Input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="outline-none border-none"
          />
          {errors?.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>
        {/* User Password */}
        <div className="flex flex-col gap-1">
          <Label id="password" className="text-xs font-semibold">
            Password
          </Label>
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="outline-none border-none"
          />
          {errors?.password && (
            <span className="text-red-500 text-xs">
              {errors.password.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        {/* User Role */}
        <UserRoleSelector />
        {/* User Status */}
        <UserStatusSelector />
      </div>
    </div>
  );
};

interface FormProps {
  user: User;
  onSave: (info: UserUpdateRequest) => void;
  handleDelete: (userId: string) => void;
}

const UserDetailsForm = ({ user, onSave, handleDelete }: FormProps) => {
  const formMethods = useForm<UserUpdateRequest>();
  const { handleSubmit, reset } = formMethods;

  const info: UserUpdateRequest = {
    username: user?.username,
    email: user?.email,
    password: undefined,
    banned: String(user?.banned),
    role: user?.role,
  };

  useEffect(() => {
    reset(info);
  }, [user]);

  const submit = handleSubmit((info: UserUpdateRequest) => {
    console.log(info);

    if (!info.banned || info.banned === "") delete info.banned;
    if (!info.email || info.email === "") delete info.email;
    if (!info.password || info.password === "") delete info.password;
    if (!info.username || info.username === "") delete info.username;
    if (!info.role || info.role === "") delete info.role;

    onSave(info);
  });

  return (
    <div className="p-5 rounded-md border border-gray-50/20 bg-gray-900/20 backdrop-blur-md">
      <FormProvider {...formMethods}>
        <form onSubmit={submit}>
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-row gap-2 items-center">
              {/* User Role Title */}
              <div className="flex flex-row gap-3 items-center">
                {user?.role === "admin" && <ShieldUser size={25} />}
                {user?.role === "manager" && <UserCog size={25} />}
                {user?.role === "user" && <UserIcon size={25} />}
                <p
                  className={`text-xs font-semibold uppercase ${
                    user?.role === "admin"
                      ? "text-red-500"
                      : user?.role === "manager"
                      ? "text-blue-500"
                      : "text-green-500"
                  }`}
                >
                  {user?.role}
                </p>
              </div>
              {/* User Ban Date */}
              {user?.banned && (
                <div className="text-xs text-red-400">
                  {user?.dateOfBan &&
                    `Banned on ${
                      new Date(user?.dateOfBan)
                        .toISOString()
                        .replace("T", " ")
                        .split(".")[0]
                    }`}
                </div>
              )}
            </div>
            {/* Other Details */}
            <UserDetails user={user} />
            {/* Update Button */}
            <div className="flex flex-col md:flex-row gap-2">
              {/* Delete Button */}
              <Button
                type="button"
                onClick={() => user?._id && handleDelete(user?._id)}
                className="bg-red-500"
              >
                Delete
              </Button>
              {/* Update Button */}
              <Button type="submit" className="">
                Update
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default UserDetailsForm;
