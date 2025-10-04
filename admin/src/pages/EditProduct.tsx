import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../apiClient";
import { toast } from "sonner";
import { ManageProduct } from "../forms/ManageProduct/ManageProduct";

const EditProduct = () => {
  const { productId } = useParams();
  const queryClient = useQueryClient();

  if (!productId) {
    toast.error("Product ID not valid!");
    return (
      <div className="w-full p-5 text-xl text-center border border-indigo-500/80 rounded-md bg-indigo-500/20 text-white">
        <span className="w-full">Product ID not included or not valid</span>
      </div>
    );
  }

  const { data: product, isLoading } = useQuery({
    queryKey: ["fetchProduct"],
    queryFn: () => apiClient.fetchProduct(productId),
  });

  const { mutate: updateProduct } = useMutation({
    mutationFn: apiClient.updateProduct,
  });

  const handleUpdate = async (productData: FormData) => {
    updateProduct(productData);
  };

  const { mutate: deleteProduct } = useMutation({
    mutationFn: apiClient.deleteProduct,
    onSuccess: () => {
      toast.success("Product deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      window.history.back();
    },
    onError: (error) => {
      toast.error(error?.message || "Product delete filed!");
    },
  });

  const handleDelete = async (e: any) => {
    e.preventDefault();
    deleteProduct(product?._id);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="container">
        <div className="bg-gray-800/20  border border-gray-50/50 rounded-lg p-5 mx-auto lg:max-w-[80%]">
          {/* Form Heading */}
          <h1 className="text-2xl mb-5">Edit Product</h1>
          {/* Form */}
          <ManageProduct
            isLoading={isLoading}
            onSave={handleUpdate}
            onDelete={handleDelete}
            product={product}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
