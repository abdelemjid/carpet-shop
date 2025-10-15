import DateFilter from "../home/DateFilter";
import CategoryFilter from "./CategoryFilter";
import QuantityFilter from "./QuantityFilter";

interface Props {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  setFrom: (from: Date | undefined) => void;
  setTo: (to: Date | undefined) => void;
  selectedCategory: string | undefined;
  setCategory: (category: string) => void;
  quantity: number[] | undefined;
  setQuantity: (quantity: number[]) => void;
}

const ProductsFilter = ({
  fromDate,
  setFrom,
  toDate,
  setTo,
  selectedCategory,
  setCategory,
  quantity,
  setQuantity,
}: Props) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-center">
      {/* Date Pickers */}
      <DateFilter
        fromDate={fromDate}
        setFromDate={setFrom}
        setToDate={setTo}
        toDate={toDate}
      />

      {/* Category */}
      <CategoryFilter selected={selectedCategory} setCategory={setCategory} />

      {/* Quantity */}
      <QuantityFilter quantity={quantity} setQuantity={setQuantity} />
    </div>
  );
};

export default ProductsFilter;
