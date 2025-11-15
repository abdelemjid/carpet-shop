import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ProductName from "./ProductName";
import ProductDescription from "./ProductDescription";
import ProductQuantityPrice from "./ProductQuantityPrice";
import ProductSizeCategory from "./ProductSizeCategory";
import ProductImages from "./ProductImages";
import loading from "../../assets/loading.svg";
import type { Product } from "../../types/product.type";
import { Button } from "@/components/ui/button";

interface Props {
  product?: Product;
  onSave: (productData: FormData) => void;
  isLoading: boolean;
  showDeleteDialog?: () => void;
}

export const ManageProduct = ({
  product,
  onSave,
  isLoading,
  showDeleteDialog,
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
        <div className="flex flex-col md:flex-row justify-between gap-2 mt-3">
          {/* Delete Button */}
          {product && (
            <Button
              disabled={isLoading}
              onClick={() => showDeleteDialog && showDeleteDialog()}
              variant="outline"
              type="button"
              className="flex-1 text-red-500 cursor-pointer"
            >
              {isLoading ? (
                <img src={loading} className="w-[20px]" />
              ) : (
                "Delete"
              )}
            </Button>
          )}
          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex justify-center items-center py-1 px-3 cursor-pointer"
          >
            {isLoading ? (
              <img src={loading} className="w-[20px]" />
            ) : product ? (
              "Update"
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
