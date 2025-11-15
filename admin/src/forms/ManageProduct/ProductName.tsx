import { Input } from "@/components/ui/input";
import type { Product } from "@/types/product.type";
import { useFormContext } from "react-hook-form";

const ProductName = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<Product>();

  return (
    <div className="flex flex-col">
      <label htmlFor="name" className="text-xs">
        Name
      </label>
      <Input
        type="text"
        {...register("name", { required: "* This field is required!" })}
        className="w-full"
      />
      <span className="text-xs text-red-400 my-1">
        {errors.name && errors.name.message}
      </span>
    </div>
  );
};

export default ProductName;
