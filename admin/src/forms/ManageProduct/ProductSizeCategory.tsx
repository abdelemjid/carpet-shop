import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product } from "@/types/product.type";
import { useFormContext } from "react-hook-form";

const ProductSizeCategory = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<Product>();

  const category = watch("category");

  return (
    <div className="flex flex-col md:flex-row md:gap-2">
      {/* Product Height */}
      <div className="flex flex-col flex-1 mt-1">
        <label htmlFor="height" className="text-xs">
          Carpet Height
        </label>
        <Input
          type="number"
          {...register("height", {
            required: "* Carpet height is required!",
            min: {
              value: 1,
              message: "Carpet's Height can not be less than 1",
            },
          })}
        />
        <span className="text-xs text-red-400 my-1">
          {errors.height && errors.height.message}
        </span>
      </div>
      {/* Product Width */}
      <div className="flex flex-col flex-1 mt-1">
        <label htmlFor="width" className="text-xs">
          Carpet Width
        </label>
        <Input
          type="number"
          {...register("width", {
            required: "* Carpet's Width is required!",
            min: { value: 1, message: "Carpet's width can not be less than 1" },
          })}
        />
        <span className="text-xs text-red-400 my-1">
          {errors.width && errors.width.message}
        </span>
      </div>
      {/* Product Category */}
      <div className="flex flex-col flex-1 mt-1">
        <label className="text-xs">Category</label>
        <Select value={category} onValueChange={(v) => setValue("category", v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              {["s", "m", "l"].map((c) => (
                <SelectItem key={`category-${c}`} value={c}>
                  {c.toUpperCase()}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <span className="text-xs text-red-400 my-1">
          {errors.category && errors.category.message}
        </span>
      </div>
    </div>
  );
};

export default ProductSizeCategory;
