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
  type PublishTimeType,
} from "@/contexts/SearchAndFiltersContext";

const filterValues = [undefined, "week", "month", "year"];

const DateFilter = () => {
  const { publishTime, setPublishTime } = useSearchAndFilter();

  return (
    <Select
      value={publishTime || ""}
      onValueChange={(value) => setPublishTime(value as PublishTimeType)}
    >
      <SelectTrigger className="md:flex-1 w-full">
        <SelectValue placeholder="Published On..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Publish Time</SelectLabel>
          {filterValues.map(
            (value, _) =>
              value && (
                <SelectItem value={value} key={_}>{`This ${value}`}</SelectItem>
              )
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default DateFilter;
