import { useAuth } from "../contexts/AuthContext";
import { Card } from "@/components/ui/card";
import loading from "../assets/loading.svg";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/utils/ApiClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const {
    mutate: logAdminIn,
    data: adminData,
    isPending,
  } = useMutation({
    mutationKey: ["admin-login"],
    mutationFn: ApiClient.login,
  });

  const handleLogin = (data: any) => {
    logAdminIn(data);
  };

  if (!isPending && adminData) {
    login(adminData);
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Card className="min-w-[400px] p-5">
        <h1 className="text-xl mb-5">Admin Login</h1>
        {/* Form */}
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="flex flex-col gap-3"
        >
          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold">Email</label>
            <Input
              type="email"
              placeholder="john.doe@mail.com"
              {...register("email", {
                required: {
                  value: true,
                  message: "* Email address is required to login!",
                },
                validate: (value) => {
                  if (/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value))
                    return true;
                  return "* Please enter a valid email address to login!";
                },
              })}
            />
            {errors?.email && (
              <span className="text-red-400 text-xs">
                {errors?.email?.message}
              </span>
            )}
          </div>
          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold">Password</label>
            <Input
              type="password"
              placeholder="********"
              {...register("password", {
                required: {
                  value: true,
                  message: "* Password is required to login!",
                },
                validate: (value) => {
                  return (
                    value.length >= 8 ||
                    "* Please enter a valid password to login!"
                  );
                },
              })}
            />
            {errors?.password && (
              <span className="text-red-400 text-xs">
                {errors?.password?.message}
              </span>
            )}
          </div>

          {/* Login Button */}
          <Button className="mt-5 bg-indigo-500 hover:bg-indigo-600 text-white">
            {isPending ? <img src={loading} className="w-[15px]" /> : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
