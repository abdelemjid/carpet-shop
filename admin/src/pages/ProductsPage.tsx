import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../apiClient";
import ProductItem from "../components/products/ProductItem";
import type { Product } from "../types/product.type";
import { useImagePreview } from "../contexts/ImagePreviewContext";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import ProductsFilter from "@/components/products/ProductsFilter";
import loading from "@/assets/loading.svg";
import { useEffect, useState } from "react";
import PaginationView from "@/components/PaginationView";
import ImagePreview from "@/components/products/ImagePreview";

const ProductsPage = () => {
  const { displayed } = useImagePreview();
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<
    { from: number | undefined; to: number | undefined } | undefined
  >(undefined);
  const [page, setPage] = useState<number>(1);

  let refetchTimer: ReturnType<typeof setTimeout> | null = null;

  const productsFilter = {
    fromDate,
    toDate,
    category,
    quantity,
    page,
  };

  const {
    data: productData,
    refetch: refetchProducts,
    isLoading,
  } = useQuery({
    queryKey: ["products", productsFilter],
    queryFn: () => apiClient.fetchProducts(productsFilter),
  });

  useEffect(() => {
    if (refetchTimer) clearTimeout(refetchTimer);

    refetchTimer = setTimeout(refetchProducts, 1500);
  }, [fromDate, toDate, category, quantity, page]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <img src={loading} className="w-[35px] h-[35px]" />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="w-full border border-gray-50/30 rounded-md p-5 bg-gray-800/20">
        <span className="text-md text-center">No products yet</span>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-5">
      {/* Image Preview Alert */}
      {displayed && <ImagePreview />}
      {/* Products Filters */}
      <ProductsFilter
        fromDate={fromDate}
        setFrom={setFromDate}
        toDate={toDate}
        setTo={setToDate}
        selectedCategory={category}
        setCategory={setCategory}
        quantity={quantity}
        setQuantity={setQuantity}
      />
      {/* Products */}
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(330px,1fr))] gap-5 my-10">
        {productData?.data &&
          productData.data.map((product: Product) => (
            <ProductItem product={product} key={product._id} />
          ))}
      </div>
      {/* New Product Button */}
      <Link
        to="/admin/products/new"
        className="w-[50px] h-[50px] fixed z-50 bottom-[10px] right-[10px] md:bottom-[30px] md:right-[30px] rounded-full bg-indigo-500 hover:bg-indigo-400 transition-all duration-200 ease-in-out"
      >
        <Plus size={35} className="h-full m-auto" />
      </Link>
      {/* Pagination */}
      <PaginationView
        page={page}
        setPage={setPage}
        hasNext={productData?.pagination?.hasNext}
        hasPrev={productData?.pagination?.hasPrev}
      />
    </div>
  );
};

export default ProductsPage;
