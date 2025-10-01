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
  isLoading: boolean;
}

export const ManageProduct = ({ product, onSave, isLoading }: Props) => {
  const formMethods = useForm<Product>();
  const { handleSubmit, reset } = formMethods;

  // fill form with product data if exists
  useEffect(() => {
    reset(product);
  }, [product, reset]);

  const onSubmit = handleSubmit((productData: Product) => {
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("category", productData.category);
    formData.append("price", productData.price.toString());
    formData.append("quantity", productData.quantity.toString());
    formData.append("width", productData.width.toString());
    formData.append("height", productData.height.toString());

    if (productData.images) {
      productData.images.forEach((url, index) => {
        formData.append(`images[${index}]`, url);
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
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-1 px-3 mt-3 rounded-md bg-indigo-500 hover:bg-indigo-400 transition-all ease-in-out duration-200 cursor-pointer"
        >
          {isLoading ? <img src={loading} className="w-[20px]" /> : "Submit"}
        </button>
      </form>
    </FormProvider>
  );
};
