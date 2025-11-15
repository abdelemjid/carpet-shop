import { useProductsFilterContext } from "@/contexts/products/ProductsFilter";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const CategoryFilter = () => {
  const categories = ["s", "m", "l"];
  const { category, setCategory } = useProductsFilterContext();

  const capitalize = (a: string) => {
    return `${a.charAt(0).toUpperCase()}${a.slice(1)}`;
  };

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="category-filter" className="text-xs font-semibold">
        Category
      </Label>
      <Select value={category} onValueChange={(value) => setCategory(value)}>
        <SelectTrigger id="category-filter" className="w-40 text-xs">
          <SelectValue placeholder="Select a Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Category</SelectLabel>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {capitalize(category)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategoryFilter;
