import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ManageProduct } from "../forms/ManageProduct/ManageProduct";
import { ApiClient } from "@/utils/ApiClient";
import { Card } from "@/components/ui/card";
import DeleteDialog from "@/forms/ManageProduct/DeleteDialog";
import { useState } from "react";

const EditProduct = () => {
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
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

  const showDeletionDialog = () => {
    setDeleteDialog(true);
  };

  const cancelDeletionDialog = () => {
    setDeleteDialog(false);
  };

  const { data: product, isLoading } = useQuery({
    queryKey: ["fetchProduct"],
    queryFn: () => ApiClient.fetchProduct(productId),
  });

  const { mutate: updateProduct } = useMutation({
    mutationFn: ApiClient.updateProduct,
  });

  const handleUpdate = async (productData: FormData) => {
    updateProduct(productData);
  };

  const { mutate: deleteProduct } = useMutation({
    mutationFn: ApiClient.deleteProduct,
    onSuccess: () => {
      toast.success("Product deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      window.history.back();
    },
    onError: (error) => {
      toast.error(error?.message || "Product delete filed!");
    },
  });

  const handleDelete = async () => {
    deleteProduct(product?._id);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="container">
        <Card className="mx-auto p-5 lg:max-w-[80%]">
          {/* Form Heading */}
          <h1 className="text-2xl mb-5">Edit Product</h1>
          {/* Form */}
          <ManageProduct
            isLoading={isLoading}
            onSave={handleUpdate}
            product={product}
            showDeleteDialog={showDeletionDialog}
          />
        </Card>

        {/* Delete Dialog */}
        {deleteDialog && (
          <DeleteDialog
            handleCancelDeletion={cancelDeletionDialog}
            handleConfirmDeletion={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default EditProduct;
