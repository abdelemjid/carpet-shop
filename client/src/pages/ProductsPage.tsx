import ProductSection from "@/components/products/ProductSection";
import SearchTab from "@/components/products/SearchTab";
import { useCartContext } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ProductsPagination from "@/components/products/ProductsPagination";
import { ApiClient } from "@/utils/ApiClient";

const Products = () => {
  const { addOrder } = useCartContext();
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract search params
  const page = searchParams.get("page") || "1";
  const search = searchParams.get("query") || "";
  const category = searchParams.get("category") || "";
  const date = searchParams.get("date") || "";
  const quantity = searchParams.get("quantity") || "";

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["products", { page, search, category, date, quantity }],
    queryFn: () => {
      const query = new URLSearchParams();
      const page = searchParams.get("page");
      const search = searchParams.get("query");
      const category = searchParams.get("category");
      const date = searchParams.get("date");
      const quantity = searchParams.get("quantity");

      if (page) query.append("page", page);
      if (search) query.append("query", search);
      if (category) query.append("category", category);
      if (date) query.append("date", date);
      if (quantity) query.append("quantity", quantity);

      return ApiClient.getProducts(query.toString());
    },
  });

  return (
    <div className="my-10 flex flex-col gap-3">
      {/* Search & Filters */}
      <SearchTab refetch={refetch} />
      {/* Products Section */}
      <ProductSection data={data} isLoading={isLoading} addOrder={addOrder} />
      {/* Pagination */}
      <ProductsPagination
        hasNext={data?.pagination?.hasNext || false}
        hasPrev={data?.pagination?.hasPrev || false}
      />
    </div>
  );
};

export default Products;
