import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import loading from "../assets/loading.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as apiClient from "../apiClient";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const FieldInfo = ({ field }: { field: AnyFieldApi }) => {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
    </>
  );
};

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();

  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) toast.message("You are logged in");
    else toast.error("You are not logged in");
  }, [isAuthenticated]);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const user = await apiClient.login(value);

      if (!user) {
        setLoginError("Wrong credentials!");
        return;
      }

      if (user.role === "user") {
        window.location.href = "http://localhost:5173/login";
        return;
      }

      login(user);
      navigate("/");
    },
  });

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="max-w-[400px] p-10 rounded-md border border-gray-50/40 bg-gray-50/10">
        {/* Form Heading */}
        <h1 className="text-2xl mb-5">Admin Login</h1>
        {/* Login Error Message */}
        <span className="max-w-fit text-center text-red-400 text-sm text-wrap">
          {loginError}
        </span>
        {/* Login Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-3">
            {/* Username Field */}
            <div>
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    !value || value.length === 0
                      ? "Email address is required!"
                      : undefined;
                  },
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: async ({ value }) => {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    return value.includes("error") && 'Error "Email" invalid';
                  },
                }}
                children={(field) => {
                  return (
                    <>
                      {/* Username Label  */}
                      <label
                        htmlFor={field.name}
                        className="text-sm text-gray-50/80"
                      >
                        Email
                      </label>
                      {/* Username Field */}
                      <input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full px-3 py-1 rounded-sm outline-none border border-gray-50/30 bg-gray-50/20 transition-all duration-200 ease-in-out focus:border-gray-50/80"
                      />
                      {/* Field Error Info */}
                      <span className="w-full text-xs text-red-400">
                        <FieldInfo field={field} />
                      </span>
                    </>
                  );
                }}
              />
            </div>

            {/* Password Field */}
            <div>
              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => {
                    !value || value.length < 8
                      ? "Password is required!"
                      : undefined;
                  },
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: async ({ value }) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return (
                      value.includes("error") && 'Error "Password" invalid'
                    );
                  },
                }}
                children={(field) => {
                  return (
                    <>
                      {/* Password Label  */}
                      <label
                        htmlFor={field.name}
                        className="text-sm text-gray-50/80"
                      >
                        Password
                      </label>
                      {/* Password Field */}
                      <input
                        id={field.name}
                        type="password"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full px-3 py-1 rounded-sm outline-none border border-gray-50/30 bg-gray-50/20 transition-all duration-200 ease-in-out focus:border-gray-50/80"
                      />
                      {/* Field Error Info */}
                      <span className="w-full text-xs text-red-400">
                        <FieldInfo field={field} />
                      </span>
                    </>
                  );
                }}
              />
            </div>

            {/* Submit Button */}
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  className="w-full flex justify-center items-center mt-3 px-3 py-1 rounded-sm bg-indigo-500 transition-all duration-200 ease-in-out hover:bg-indigo-600 disabled:bg-indigo-300"
                >
                  {isSubmitting ? (
                    <img src={loading} className="w-[24px]" />
                  ) : (
                    "Login"
                  )}
                </button>
              )}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
