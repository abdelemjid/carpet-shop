import { useFormContext } from "react-hook-form";
import type { Product } from "./ManageProduct";

const ProductDescription = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<Product>();

  return (
    <div className="flex flex-col mt-1">
      <label htmlFor="description" className="text-sm">
        Description
      </label>
      <textarea
        {...register("description", { required: "* This field is required!" })}
        className="w-full bg-gray-50/30 py-1 px-3 rounded-md border border-gray-50/40 outline-none focus:border-gray-50"
      />
      <span className="text-xs text-red-400 my-1">
        {errors.description && errors.description.message}
      </span>
    </div>
  );
};

export default ProductDescription;
