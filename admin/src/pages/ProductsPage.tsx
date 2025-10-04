import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../apiClient";
import ProductItem from "../components/ProductItem";
import type { Product } from "../types/product.type";
import ImagePreview from "../components/ImagePreview";
import { useImagePreview } from "../contexts/ImagePreviewContext";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const ProductsPage = () => {
  const { displayed } = useImagePreview();

  const { data: productData } = useQuery({
    queryKey: ["products"],
    queryFn: apiClient.fetchProducts,
  });

  if (!productData) {
    return (
      <div className="w-full border border-gray-50/30 rounded-md p-5 bg-gray-800/20">
        <span className="text-md text-center">No products yet</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Image Preview Alert */}
      {displayed && <ImagePreview />}
      {/* Products */}
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(330px,1fr))] gap-5">
        {productData?.data &&
          productData.data.map((product: Product) => (
            <ProductItem product={product} key={product._id} />
          ))}
      </div>
      {/* New Product Button */}
      <Link
        to="/products/new"
        className="w-[50px] h-[50px] fixed z-50 bottom-[10px] right-[10px] md:bottom-[30px] md:right-[30px] rounded-full bg-indigo-500 hover:bg-indigo-400 transition-all duration-200 ease-in-out"
      >
        <Plus size={35} className="h-full m-auto" />
      </Link>
    </div>
  );
};

export default ProductsPage;
