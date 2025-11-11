import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ApiClient } from "@/utils/ApiClient";
import type { CheckoutForm } from "@/types/checkout.type";
import { useCartContext } from "@/contexts/CartContext";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { deleteOrders } = useCartContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>();

  const {
    mutate,
    data: responseResult,
    isPending,
    isSuccess,
  } = useMutation({
    mutationKey: ["checkout"],
    mutationFn: (data: CheckoutForm) => {
      const urlParams = new URLSearchParams();

      for (const id of searchParams.getAll("id")) urlParams.append("id", id);

      return ApiClient.CheckoutOrders(urlParams.toString(), data);
    },
  });

  const onSubmit: SubmitHandler<CheckoutForm> = (data) => {
    mutate(data);
  };

  if (isSuccess && !isPending) {
    reset();
    if (responseResult) deleteOrders(responseResult?.confirmed);
    navigate("/orders");
  }

  return (
    <Card className="w-full md:max-w-[600px] mx-auto p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label className="text-xs" htmlFor="fullname">
            Full name
          </label>
          <Input
            type="text"
            placeholder="Full name"
            minLength={4}
            maxLength={30}
            {...register("fullname", {
              required: { value: true, message: "* Fullname is required!" },
            })}
          />
          {errors?.fullname && (
            <span className="text-xs text-red-400">
              {errors?.fullname?.message}
            </span>
          )}
        </div>
        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-xs" htmlFor="email">
            Email
          </label>
          <Input
            type="email"
            placeholder="Email"
            {...register("email", { required: false })}
          />
          {errors?.email && (
            <span className="text-xs text-red-400">
              {errors?.email?.message}
            </span>
          )}
        </div>
        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label className="text-xs" htmlFor="phoneNumber">
            Phone number
          </label>
          <Input
            type="text"
            placeholder="Phone number"
            {...register("phoneNumber", {
              required: {
                value: true,
                message: "* Phone number is required!",
              },
              validate: (value) => {
                // Fix: Explicitly return true if valid, or error message if invalid
                if (/^\+[1-9]\d{5,14}$/.test(value)) {
                  return true;
                }
                return "* Enter a valid phone number with country code!";
              },
            })}
          />
          {errors?.phoneNumber && (
            <span className="text-xs text-red-400">
              {errors?.phoneNumber?.message}
            </span>
          )}
        </div>
        {/* City */}
        <div className="flex flex-col gap-2">
          <label className="text-xs" htmlFor="city">
            City
          </label>
          <Input
            type="text"
            placeholder="City"
            {...register("city", {
              required: { value: true, message: "* City name is required!" },
              validate: (value) => {
                return (
                  (value.length > 3 && value.length < 30) ||
                  "* Please enter a valid city name!"
                );
              },
            })}
          />
          {errors?.city && (
            <span className="text-xs text-red-400">
              {errors?.city?.message}
            </span>
          )}
        </div>
        {/* Address */}
        <div className="flex flex-col gap-2">
          <label className="text-xs" htmlFor="address">
            Shipping address
          </label>
          <Input
            type="text"
            placeholder="Shipping address"
            {...register("address", {
              required: {
                value: true,
                message: "* Shipping address is required!",
              },
              validate: (value) => {
                return (
                  (value.length > 9 && value.length < 100) ||
                  "* Please enter a valid address!"
                );
              },
            })}
          />
          {errors?.address && (
            <span className="text-xs text-red-400">
              {errors?.address?.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <Button
          disabled={isPending}
          className="cursor-pointer mt-5 disabled:opacity-30"
        >
          Order
        </Button>
      </form>
    </Card>
  );
};

export default CheckoutPage;
