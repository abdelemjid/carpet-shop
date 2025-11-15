import { X } from "lucide-react";
import DateFilter from "../home/DateFilter";
import { Button } from "../ui/button";
import CategoryFilter from "./CategoryFilter";
import QuantityFilter from "./QuantityFilter";
import { useProductsFilterContext } from "@/contexts/products/ProductsFilter";

const ProductsFilter = () => {
  const {
    clearFilter,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    fQuantity,
    setFQuantity,
    tQuantity,
    setTQuantity,
  } = useProductsFilterContext();

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Date Pickers */}
      <DateFilter
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
      />
      {/* Category */}
      <CategoryFilter />
      {/* Quantity */}
      <QuantityFilter
        fQuantity={fQuantity}
        setFQuantity={setFQuantity}
        tQuantity={tQuantity}
        setTQuantity={setTQuantity}
      />
      {/* Clear Button */}
      <Button
        onClick={() => clearFilter()}
        variant="outline"
        className="w-fit text-red-500 lg:self-end cursor-pointer"
      >
        <X /> Clear
      </Button>
    </div>
  );
};

export default ProductsFilter;
