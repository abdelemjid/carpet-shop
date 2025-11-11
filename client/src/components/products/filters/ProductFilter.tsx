import { useSearchAndFilter } from "@/contexts/SearchAndFiltersContext";
import CategoryFilter from "./CategoryFilter";
import DateFilter from "./DateFilter";
import QuantityFilter from "./QuantityFilter";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const ProductFilter = () => {
  const { resetFilter } = useSearchAndFilter();

  return (
    <div className="w-full flex flex-col gap-2 md:flex-row items-start md:items-center">
      {/* Publish Time */}
      <DateFilter />
      {/* Category Filter */}
      <CategoryFilter />
      <div className="w-full md:flex-1 flex flex-row gap-2">
        {/* Quantity Filter */}
        <QuantityFilter />
        {/* Clear Filters Button */}
        <Button
          onClick={resetFilter}
          className="w-fit cursor-pointer text-red-500"
        >
          <X size={15} /> Clear
        </Button>
      </div>
    </div>
  );
};

export default ProductFilter;
