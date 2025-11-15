import { useQuery } from "@tanstack/react-query";
import { useImagePreview } from "../contexts/ImagePreviewContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import ProductsFilter from "@/components/products/ProductsFilter";
import { useEffect } from "react";
import PaginationView from "@/components/PaginationView";
import ImagePreview from "@/components/products/ImagePreview";
import { ApiClient } from "@/utils/ApiClient";
import { useProductsFilterContext } from "@/contexts/products/ProductsFilter";
import ProductsSection from "@/components/products/ProductsSection";
import { Button } from "@/components/ui/button";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { displayed } = useImagePreview();
  const {
    page,
    setPage,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    category,
    setCategory,
    fQuantity,
    setFQuantity,
    tQuantity,
    setTQuantity,
  } = useProductsFilterContext();

  const {
    data: productData,
    refetch: refetchProducts,
    isLoading,
  } = useQuery({
    queryKey: [
      "products",
      { fromDate, toDate, category, fQuantity, tQuantity, page },
    ],
    queryFn: () => {
      const query = new URLSearchParams();

      query.append("page", String(page));
      if (fromDate)
        query.append("fromDate", fromDate.toISOString().split("T")[0]);
      if (toDate) query.append("toDate", toDate.toISOString().split("T")[0]);
      if (category) query.append("category", category);
      if (fQuantity) query.append("fromQuantity", String(fQuantity));
      if (tQuantity) query.append("toQuantity", String(tQuantity));

      return ApiClient.fetchProducts(query.toString());
    },
  });

  useEffect(() => {
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    setPage(Number(searchParams.get("page")) || 1);
    searchParams.get("category")
      ? setCategory(String(searchParams.get("category")))
      : setCategory(undefined);
    fromDate ? setFromDate(new Date(fromDate)) : setFromDate(undefined);
    toDate ? setToDate(new Date(toDate)) : setToDate(undefined);
    searchParams.get("fromQuantity")
      ? setFQuantity(Number(searchParams.get("fromQuantity")))
      : setFQuantity(undefined);
    searchParams.get("toQuantity")
      ? setTQuantity(Number(searchParams.get("toQuantity")))
      : setTQuantity(undefined);
  }, []);

  useEffect(() => {
    const query = new URLSearchParams();

    if (page) query.append("page", String(page));
    if (fromDate)
      query.append("fromDate", fromDate.toISOString().split("T")[0]);
    if (toDate) query.append("toDate", toDate.toISOString().split("T")[0]);
    if (category && category !== "null") query.append("category", category);
    if (fQuantity) query.append("fromQuantity", String(fQuantity));
    if (tQuantity) query.append("toQuantity", String(tQuantity));

    setSearchParams(query);

    refetchProducts();
  }, [fromDate, toDate, category, fQuantity, tQuantity, page]);

  return (
    <div className="min-h-screen relative flex flex-col gap-5">
      {/* Image Preview Alert */}
      {displayed && <ImagePreview />}
      {/* Products Filters */}
      <ProductsFilter />
      {/* Products */}
      <ProductsSection data={productData} isLoading={isLoading} />
      {/* New Product Button */}
      <Button
        onClick={() => navigate("/admin/products/new")}
        title="New Product"
        className="fixed bottom-[50px] right-[50px] z-50 cursor-pointer rounded-full p-5"
      >
        <Plus />
      </Button>
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
