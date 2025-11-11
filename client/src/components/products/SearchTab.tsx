import { useSearchParams } from "react-router-dom";
import { Card } from "../ui/card";
import ProductFilter from "./filters/ProductFilter";
import SearchBar from "./SearchBar";
import { useEffect } from "react";
import {
  useSearchAndFilter,
  type CategoryType,
  type PublishTimeType,
} from "@/contexts/SearchAndFiltersContext";
import type { ProductsSearchQuery } from "@/types/product.type";

interface Props {
  refetch: () => void;
}

const SearchTab = ({ refetch }: Props) => {
  const {
    setSearch,
    search,
    page,
    setPage,
    category,
    setCategory,
    publishTime,
    setPublishTime,
    quantity,
    setQuantity,
  } = useSearchAndFilter();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearchClick = () => {
    refetch();
  };

  // reset the search state: from URL query
  useEffect(() => {
    const pageParam = Number(searchParams.get("page")) || 1;
    const queryParam = searchParams.get("query") || undefined;
    const dateParam = searchParams.get("date") || undefined;
    const categoryParam = searchParams.get("category") || undefined;
    const quantityParam = Number(searchParams.get("quantity")) || undefined;

    if (pageParam) setPage(pageParam);
    if (queryParam) setSearch(queryParam);
    if (dateParam) setPublishTime(dateParam as PublishTimeType);
    if (categoryParam) setCategory(categoryParam as CategoryType);
    if (quantityParam) setQuantity(quantityParam);
  }, []);

  // modify the URL: if any filter is changed
  useEffect(() => {
    const searchQuery: ProductsSearchQuery = {
      page: page || 1,
    };

    if (publishTime) searchQuery.date = publishTime;
    if (category) searchQuery.category = category;
    if (quantity) searchQuery.quantity = quantity;
    if (search) searchQuery.query = search;

    setSearchParams(searchQuery as URLSearchParams);

    // refetch products with the new filter settings
    refetch();
  }, [category, publishTime, quantity, page, search]);

  return (
    <Card className="p-3">
      <div className="flex flex-col gap-3 justify-center items-center">
        {/* Search Bar  */}
        <SearchBar handleSearchClick={handleSearchClick} />
        {/* Filters */}
        <ProductFilter />
      </div>
    </Card>
  );
};

export default SearchTab;
