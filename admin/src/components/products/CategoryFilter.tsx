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

interface Props {
  selected: string | undefined;
  setCategory: (category: string) => void;
}

const CategoryFilter = ({ selected, setCategory }: Props) => {
  const categories = ["default", "s", "m", "l"];

  const capitalize = (a: string) => {
    return `${a.charAt(0).toUpperCase()}${a.slice(1)}`;
  };

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="category-filter" className="text-xs font-semibold">
        Category
      </Label>
      <Select
        defaultValue={categories[0]}
        value={selected}
        onValueChange={(value) => setCategory(value)}
      >
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
