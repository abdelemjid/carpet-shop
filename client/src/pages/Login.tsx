import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import loading from "../assets/loading.svg";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/utils/ApiClient";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState } from "react";

type AuthType = "login" | "register";

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

const Login = () => {
  const [authType, setAuthType] = useState<AuthType>("login");
  // login form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  // register form
  const {
    register: registerRegister,
    handleSubmit: registerHandleSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterForm>();
  const navigate = useNavigate();
  const { login } = useAuth();
  // login mutation
  const {
    mutate: loginUser,
    isPending: isLoginPending,
    data: loginData,
  } = useMutation({ mutationKey: ["login"], mutationFn: ApiClient.loginUser });
  // register mutation
  const {
    mutate: registerUser,
    isPending: isRegisterPending,
    data: registerData,
  } = useMutation({
    mutationKey: ["register"],
    mutationFn: ApiClient.RegisterUser,
  });

  const loginHandler = async (value: any) => {
    loginUser(value);
  };

  const handleRegister = async (value: any) => {
    registerUser(value);
  };

  if (!isRegisterPending && !isLoginPending && (loginData || registerData)) {
    login(loginData || registerData);
    navigate("/", { replace: true });
  }

  return (
    <div className="w-full flex flex-col justify-center items-center gap-3 transition-discrete duration-200">
      {/* Button Group */}
      <ButtonGroup className="min-w-[400px]">
        <Button
          variant={authType === "login" ? "default" : "outline"}
          onClick={() => setAuthType("login")}
          className={`min-w-[200px] ${
            authType === "login"
              ? "bg-indigo-500 dark:text-white text-gray-950 hover:bg-indigo-600"
              : ""
          }`}
        >
          Login
        </Button>
        <Button
          variant={authType === "register" ? "default" : "outline"}
          onClick={() => setAuthType("register")}
          className={`${
            authType === "register"
              ? "bg-indigo-500 dark:text-white text-gray-950 hover:bg-indigo-600"
              : ""
          } min-w-[200px]`}
        >
          Register
        </Button>
      </ButtonGroup>
      {/* Form Selection */}
      {authType === "login" ? (
        <Card className="min-w-[400px] p-5">
          {/* Login Heading */}
          <h1 className="w-full text-2xl mb-6">Login</h1>

          {/* Login Form  */}
          <form onSubmit={handleSubmit(loginHandler)}>
            <div className="flex flex-col gap-2">
              {/* Email Input */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold">Email</label>
                <Input
                  type="email"
                  placeholder="Email"
                  {...register("email", {
                    required: {
                      value: true,
                      message: "* Email address is required for login!",
                    },
                    validate: (value) => {
                      if (
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                          value
                        )
                      )
                        return true;
                      return "* Please enter a valid Email address!";
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
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold">Password</label>
                <Input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "* Password is required for login!",
                    },
                    validate: (value) => {
                      return (
                        value.length >= 8 ||
                        "* Please enter a valid password (at least 8 characters)!"
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
              {/* Submit Button */}
              <Button
                type="submit"
                className="cursor-pointer mt-3 bg-indigo-500 text-white hover:bg-indigo-600"
              >
                {isLoginPending ? (
                  <img src={loading} className="w-[15px]" />
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="min-w-[400px] p-5">
          <div>
            {/* Login Heading */}
            <h1 className="w-full text-2xl mb-6">Sign Up</h1>

            {/* Login Form  */}
            <form onSubmit={registerHandleSubmit(handleRegister)}>
              <div className="flex flex-col gap-3">
                {/* Username Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold">Username</label>
                  <Input
                    type="text"
                    placeholder="Username"
                    {...registerRegister("username", {
                      required: {
                        value: true,
                        message: "* Username is require to register!",
                      },
                      validate: (value) => {
                        return (
                          (value.length >= 4 && value.length < 30) ||
                          "* Please enter a valid username!"
                        );
                      },
                    })}
                  />
                  {registerErrors?.username && (
                    <span className="text-xs text-red-400">
                      {registerErrors?.username?.message}
                    </span>
                  )}
                </div>
                {/* Email Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold">Email</label>
                  <Input
                    type="email"
                    placeholder="Email"
                    {...registerRegister("email", {
                      required: {
                        value: true,
                        message: "* Email address is require to register!",
                      },
                      validate: (value) => {
                        if (
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                            value
                          )
                        )
                          return true;
                        return "* Please enter a valid Email address!";
                      },
                    })}
                  />
                  {registerErrors?.email && (
                    <span className="text-xs text-red-400">
                      {registerErrors?.email?.message}
                    </span>
                  )}
                </div>
                {/* Password Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold">Password</label>
                  <Input
                    type="password"
                    placeholder="Password"
                    {...registerRegister("password", {
                      required: {
                        value: true,
                        message: "* Password is require to register!",
                      },
                      validate: (value) => {
                        return (
                          (value.length >= 8 && value.length <= 30) ||
                          "* Password supposed to be (8 characters or more)"
                        );
                      },
                    })}
                  />
                  {registerErrors?.password && (
                    <span className="text-xs text-red-400">
                      {registerErrors?.password?.message}
                    </span>
                  )}
                </div>

                {/* Register Button */}
                <Button className="cursor-pointer mt-3 bg-indigo-500 hover:bg-indigo-600 text-white">
                  {isRegisterPending ? (
                    <img src={loading} className="w-[15px]" />
                  ) : (
                    "Register"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Login;
