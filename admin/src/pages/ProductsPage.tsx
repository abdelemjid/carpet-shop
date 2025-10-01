import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../apiClient";
import ProductItem from "../components/ProductItem";
import type { Product } from "../types/product.type";
import ImagePreview from "../components/ImagePreview";
import { useImagePreview } from "../contexts/ImagePreviewContext";

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
    <>
      {/* Image Preview Alert */}
      {displayed && <ImagePreview />}
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(330px,1fr))] gap-3">
        {productData?.data &&
          productData.data.map((product: Product) => (
            <ProductItem product={product} key={product._id} />
          ))}
      </div>
    </>
  );
};

export default ProductsPage;
