import { useFormContext } from "react-hook-form";
import { Upload, X } from "lucide-react";
import type { Product } from "@/types/product.type";

const ProductImages = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<Product>();

  const imageFiles = watch("imageFiles");
  const images: string[] = watch("images");

  return (
    <div className="w-full flex flex-col gap-4 mt-1">
      <div className="flex flex-col">
        {/* Preview Uploaded Images */}
        <div className="flex flex-wrap gap-3 my-2">
          {images &&
            Array.from(images).map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`uploaded-${index}`}
                  className="h-24 w-24 rounded-sm object-cover shadow"
                />
                <button
                  type="button"
                  onClick={() => {
                    setValue(
                      "images",
                      images.filter((value) => value !== url)
                    );
                  }}
                  className="absolute right-1 top-1 rounded-full bg-red-400 hover:bg-red-500 p-1 text-xs text-white transition-all duration-200 ease-in-out"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
        </div>
        {/* Image Files Input */}
        <label
          htmlFor="imageFiles"
          className="relative w-full flex justify-center items-center gap-4 cursor-pointer py-2 px-3 rounded-md border border-dashed border-gray-50/40 transition-all ease-in-out duration-200"
        >
          <Upload /> Upload Carpet Images
          <input
            type="file"
            accept="image/*"
            multiple
            {...register("imageFiles", {
              validate: (imageFiles) => {
                const length = imageFiles.length + (images?.length || 0);

                if (length === 0) return "* At least 1 image should be added!";

                if (length > 8)
                  return "* Total number of images can not be more than 6";

                return true;
              },
            })}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>
        {/* Preview Selected Image Files */}
        <div className="flex flex-wrap gap-3 mt-2">
          {imageFiles &&
            Array.from(imageFiles).map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="h-24 w-24 rounded-sm object-cover shadow"
                />
                <button
                  type="button"
                  onClick={() => {
                    setValue(
                      "imageFiles",
                      imageFiles.filter((value) => value !== file)
                    );
                  }}
                  className="absolute right-1 top-1 rounded-full bg-red-400 hover:bg-red-500 p-1 text-xs text-white transition-all duration-200 ease-in-out"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
        </div>
        <span className="text-xs text-red-400 my-1">
          {errors.imageFiles && errors.imageFiles.message}
        </span>
      </div>
    </div>
  );
};

export default ProductImages;
