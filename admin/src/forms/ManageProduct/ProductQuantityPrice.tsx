import { useFormContext } from "react-hook-form";
import type { Product } from "./ManageProduct";

const ProductQuantityPrice = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<Product>();

  return (
    <div className="flex flex-col md:flex-row md:gap-2">
      {/* Product Price */}
      <div className="flex flex-col flex-1 mt-1">
        <label htmlFor="price" className="text-sm">
          Price
        </label>
        <input
          type="number"
          {...register("price", {
            required: "* Price is required!",
            min: { value: 1, message: "Minimum acceptable value is 1" },
          })}
          className="w-full bg-gray-50/30 py-1 px-3 rounded-md border border-gray-50/40 outline-none focus:border-gray-50"
        />
        <span className="text-xs text-red-400 my-1">
          {errors.price && errors.price.message}
        </span>
      </div>
      {/* Product Description */}
      <div className="flex flex-col flex-1 mt-1">
        <label htmlFor="quantity" className="text-sm">
          Quantity
        </label>
        <input
          type="number"
          {...register("quantity", {
            required: "* Quantity is required!",
            min: { value: 0, message: "Negative values is not acceptable" },
          })}
          className="w-full bg-gray-50/30 py-1 px-3 rounded-md border border-gray-50/40 outline-none focus:border-gray-50"
        />
        <span className="text-xs text-red-400 my-1">
          {errors.quantity && errors.quantity.message}
        </span>
      </div>
    </div>
  );
};

export default ProductQuantityPrice;
