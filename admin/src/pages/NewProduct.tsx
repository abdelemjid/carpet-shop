import { useMutation } from "@tanstack/react-query";
import { ManageProduct } from "../forms/ManageProduct/ManageProduct";
import { toast } from "sonner";
import { ApiClient } from "@/utils/ApiClient";

const NewProduct = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: ApiClient.newProduct,
    onSuccess: () => {
      toast.success("Your product is submitted successfully.");
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  const handleSave = async (productData: FormData) => {
    mutate(productData);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="container">
        <div className=" border border-indigo-900/80 bg-indigo-900/20 dark:border-gray-50/50 dark:bg-gray-800/20 rounded-lg p-5 mx-auto lg:max-w-[80%]">
          {/* Form Heading */}
          <h1 className="text-2xl mb-5">New Product</h1>
          {/* Form */}
          <ManageProduct isLoading={isPending} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
