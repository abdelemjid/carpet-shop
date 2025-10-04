import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ProductName from "./ProductName";
import ProductDescription from "./ProductDescription";
import ProductQuantityPrice from "./ProductQuantityPrice";
import ProductSizeCategory from "./ProductSizeCategory";
import ProductImages from "./ProductImages";
import loading from "../../assets/loading.svg";
import type { Product } from "../../types/product.type";

interface Props {
  product?: Product;
  onSave: (productData: FormData) => void;
  onDelete?: (e: any) => void;
  isLoading: boolean;
}

export const ManageProduct = ({
  product,
  onSave,
  onDelete,
  isLoading,
}: Props) => {
  const formMethods = useForm<Product>();
  const { handleSubmit, reset } = formMethods;

  // fill form with product data if exists
  useEffect(() => {
    reset(product);
  }, [product, reset]);

  const onSubmit = handleSubmit((productData: Product) => {
    const formData = new FormData();
    if (product?._id) formData.append("_id", product._id);
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("category", productData.category);
    formData.append("price", productData.price.toString());
    formData.append("quantity", productData.quantity.toString());
    formData.append("width", productData.width.toString());
    formData.append("height", productData.height.toString());

    if (productData.images) {
      productData.images.map((url) => {
        formData.append(`images`, url);
      });
    }

    Array.from(productData.imageFiles).map((file) => {
      formData.append(`imageFiles`, file);
    });

    onSave(formData);
  });

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <ProductName />
        <ProductDescription />
        <ProductQuantityPrice />
        <ProductSizeCategory />
        <ProductImages />
        <div className="flex flex-col md:flex-row justify-between gap-5 mt-3">
          {/* Delete Button */}
          {product && (
            <button
              disabled={isLoading}
              onClick={onDelete}
              className="w-full flex justify-center items-center py-1 px-3 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-gray-50 transition-all ease-in-out duration-200 cursor-pointer"
            >
              {isLoading ? (
                <img src={loading} className="w-[20px]" />
              ) : (
                "Delete"
              )}
            </button>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-1 px-3 rounded-md bg-indigo-500 hover:bg-indigo-400 transition-all ease-in-out duration-200 cursor-pointer"
          >
            {isLoading ? (
              <img src={loading} className="w-[20px]" />
            ) : product ? (
              "Update"
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
