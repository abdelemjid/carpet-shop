import type { Product } from "@/types/product.type";
import { useFormContext } from "react-hook-form";

const ProductName = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<Product>();

  return (
    <div className="flex flex-col">
      <label htmlFor="name" className="text-sm">
        Name
      </label>
      <input
        type="text"
        {...register("name", { required: "* This field is required!" })}
        className="w-full bg-gray-50/30 py-1 px-3 rounded-md border border-gray-50/40 outline-none focus:border-gray-50"
      />
      <span className="text-xs text-red-400 my-1">
        {errors.name && errors.name.message}
      </span>
    </div>
  );
};

export default ProductName;
