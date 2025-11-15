import { Button } from "../ui/button";
import { X } from "lucide-react";
import DateFilter from "./DateFilter";

interface Props {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  setFromDate: (from: Date | undefined) => void;
  setToDate: (to: Date | undefined) => void;
  clearFilter: () => void;
}

const HomeFilters = ({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  clearFilter,
}: Props) => {
  return (
    <div className="flex flex-row gap-3">
      {/* Date Filter */}
      <DateFilter
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
      />
      {/* Clear Button */}
      <Button
        variant="outline"
        title="Clear Filters"
        onClick={() => clearFilter()}
        className="text-red-500 self-end cursor-pointer"
      >
        <X /> Clear
      </Button>
    </div>
  );
};

export default HomeFilters;
