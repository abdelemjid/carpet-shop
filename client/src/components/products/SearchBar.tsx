import { useSearchAndFilter } from "@/contexts/SearchAndFiltersContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Props {
  handleSearchClick: () => void;
}

const SearchBar = ({ handleSearchClick }: Props) => {
  const { search, setSearch } = useSearchAndFilter();

  return (
    <div className="w-full flex flex-row gap-2 items-center">
      <Input
        type="text"
        placeholder="Example: red rug"
        maxLength={35}
        value={search}
        onChange={(e) => setSearch(e?.target?.value)}
        className="flex-1"
      />
      <Button
        onClick={handleSearchClick}
        className="w-fit cursor-pointer bg-indigo-500 hover:bg-indigo-400 dark:text-white text-gray-900"
      >
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
