import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import loading from "../assets/loading.svg";

const FieldInfo = ({ field }: { field: AnyFieldApi }) => {
  return (
    <div className="">
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
    </div>
  );
};

const Register = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(value),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        throw new Error("Registration failed!");
      }

      login(data);
      navigate("/", { replace: true });
    },
  });

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="min-w-[400px] flex flex-col bg-gray-50/10 bg-clip-padding backdrop-blur-md rounded-md px-5 py-5 border border-gray-50/50">
        {/* Login Heading */}
        <h1 className="w-full text-2xl mb-10">Sign Up</h1>
        {/* Error Label */}
        {error && (
          <span className="w-full text-xs text-red-400 font-semibold flex-wrap">
            {error}
          </span>
        )}
        {/* Login Form  */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col space-y-2">
            {/* Username Input */}
            <div className="flex flex-col">
              <form.Field
                name="username"
                validators={{
                  onChange: ({ value }) =>
                    !value || value.length < 3
                      ? "Username is required (must be consists of 3 characters or more)"
                      : undefined,
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: async ({ value }) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return (
                      value.includes("error") &&
                      "Please enter a valid Username!"
                    );
                  },
                }}
                children={(field) => {
                  return (
                    <>
                      {/* Email Label  */}
                      <label htmlFor={field.name} className="text-xs ">
                        User name
                      </label>
                      {/* Email Field */}
                      <input
                        id={field.name}
                        name={field.name}
                        type="text"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full outline-none px-3 py-1 border border-gray-50/10 rounded-sm bg-gray-50/20 transition-all duration-150 ease-in-out focus:border-blue-50/80"
                      />
                      {/* Field Info */}
                      <span className="w-full text-xs text-red-400">
                        <FieldInfo field={field} />
                      </span>
                    </>
                  );
                }}
              ></form.Field>
            </div>
            {/* Email Input */}
            <div className="flex flex-col">
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Email address is required" : undefined,
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: async ({ value }) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return (
                      value.includes("error") && "Please enter a valid Email!"
                    );
                  },
                }}
                children={(field) => {
                  return (
                    <>
                      {/* Email Label  */}
                      <label htmlFor={field.name} className="text-xs ">
                        Email
                      </label>
                      {/* Email Field */}
                      <input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full outline-none px-3 py-1 border border-gray-50/10 rounded-sm bg-gray-50/20 transition-all duration-150 ease-in-out focus:border-blue-50/80"
                      />
                      {/* Field Info */}
                      <span className="w-full text-xs text-red-400">
                        <FieldInfo field={field} />
                      </span>
                    </>
                  );
                }}
              ></form.Field>
            </div>
            {/* Password Input */}
            <div className="">
              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Password is required" : undefined,
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: async ({ value }) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return (
                      value.includes("error") &&
                      "Password field is required! should not contains any errors"
                    );
                  },
                }}
                children={(field) => {
                  return (
                    <>
                      {/* Password Label  */}
                      <label htmlFor={field.name} className="text-xs ">
                        Password
                      </label>
                      {/* Password Field */}
                      <input
                        id={field.name}
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full outline-none px-3 py-1 border border-gray-50/10 rounded-sm bg-gray-50/20  transition-all duration-150 ease-in-out focus:border-blue-50/80"
                      />
                      {/* Field Info */}
                      <span className="w-full text-xs text-red-400">
                        <FieldInfo field={field} />
                      </span>
                    </>
                  );
                }}
              ></form.Field>
            </div>
            {/* Submit Button */}
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="flex justify-center items-center mt-5 w-full bg-blue-400 rounded-md px-3 py-1 transition-all duration-150 ease-in-out hover:bg-blue-500 cursor-pointer"
                >
                  {isSubmitting ? (
                    <img src={loading} alt="loading gif" className="w-[25px]" />
                  ) : (
                    "Sign Up"
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

export default Register;
