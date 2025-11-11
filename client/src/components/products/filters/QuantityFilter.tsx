import { Input } from "@/components/ui/input";
import { useSearchAndFilter } from "@/contexts/SearchAndFiltersContext";
import { useEffect, useState } from "react";

const QuantityFilter = () => {
  const { setQuantity, quantity } = useSearchAndFilter();
  const [inputValue, setInputValue] = useState(quantity?.toString() || "");

  // Debounce the quantity update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!inputValue || inputValue.length === 0) {
        setQuantity(undefined);
      } else {
        const parsed = parseInt(inputValue);
        if (!isNaN(parsed)) {
          setQuantity(parsed);
        }
      }
    }, 800);

    return () => clearTimeout(timer); // Cleanup on next render
  }, [inputValue, setQuantity]);

  // Sync input with external quantity changes
  useEffect(() => {
    setInputValue(quantity?.toString() || "");
  }, [quantity]);

  return (
    <Input
      key="quantity-input"
      type="number"
      min={1}
      max={9999}
      placeholder="Quantity"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className="flex-1"
    />
  );
};

export default QuantityFilter;
