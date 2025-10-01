import { useFormContext } from "react-hook-form";
import type { Product } from "./ManageProduct";

const ProductSizeCategory = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<Product>();

  return (
    <div className="flex flex-col md:flex-row md:gap-2">
      {/* Product Height */}
      <div className="flex flex-col flex-1 mt-1">
        <label htmlFor="height" className="text-sm">
          Carpet Height
        </label>
        <input
          type="number"
          {...register("height", {
            required: "* Carpet height is required!",
            min: {
              value: 1,
              message: "Carpet's Height can not be less than 1",
            },
          })}
          className="w-full bg-gray-50/30 py-1 px-3 rounded-md border border-gray-50/40 outline-none focus:border-gray-50"
        />
        <span className="text-xs text-red-400 my-1">
          {errors.height && errors.height.message}
        </span>
      </div>
      {/* Product Width */}
      <div className="flex flex-col flex-1 mt-1">
        <label htmlFor="width" className="text-sm">
          Carpet Width
        </label>
        <input
          type="number"
          {...register("width", {
            required: "* Carpet's Width is required!",
            min: { value: 1, message: "Carpet's width can not be less than 1" },
          })}
          className="w-full bg-gray-50/30 py-1 px-3 rounded-md border border-gray-50/40 outline-none focus:border-gray-50"
        />
        <span className="text-xs text-red-400 my-1">
          {errors.width && errors.width.message}
        </span>
      </div>
      {/* Product Category */}
      <div className="flex flex-col flex-1 mt-1">
        <label htmlFor="category" className="text-sm">
          Carpet Category
        </label>
        <select
          {...register("category", {
            required: "* Carpet's Category is required!",
            validate: (value) =>
              ["l", "s", "m"].includes(value) ||
              "Carpet's category is not valid!",
          })}
          className="w-full bg-gray-50/30 py-1 px-3 rounded-md border border-gray-50/40 outline-none focus:border-gray-50"
        >
          <option value="s">Small</option>
          <option value="m">Medium</option>
          <option value="l">Large</option>
        </select>

        <span className="text-xs text-red-400 my-1">
          {errors.category && errors.category.message}
        </span>
      </div>
    </div>
  );
};

export default ProductSizeCategory;
