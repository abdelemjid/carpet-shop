import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/types/product.type";
import { useFormContext } from "react-hook-form";

const ProductDescription = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<Product>();

  return (
    <div className="flex flex-col mt-1">
      <label htmlFor="description" className="text-xs">
        Description
      </label>
      <Textarea
        {...register("description", { required: "* This field is required!" })}
        className="w-full min-h-[150px]"
      />
      <span className="text-xs text-red-400 my-1">
        {errors.description && errors.description.message}
      </span>
    </div>
  );
};

export default ProductDescription;
