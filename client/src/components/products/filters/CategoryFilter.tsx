import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useSearchAndFilter,
  type CategoryType,
} from "@/contexts/SearchAndFiltersContext";

const categoryValues = [undefined, "s", "m", "l"];

const CategoryFilter = () => {
  const { category, setCategory } = useSearchAndFilter();

  return (
    <Select
      value={category || ""}
      onValueChange={(value) => setCategory(value as CategoryType)}
    >
      <SelectTrigger className="md:flex-1 w-full">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Publish Time</SelectLabel>
          {categoryValues.map(
            (value, _) =>
              value && (
                <SelectItem value={value} key={_}>
                  {value.toUpperCase()}
                </SelectItem>
              )
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CategoryFilter;
