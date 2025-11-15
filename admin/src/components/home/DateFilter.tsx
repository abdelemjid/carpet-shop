import { ChevronDownIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { useState } from "react";

interface Props {
  fromDate: Date | undefined;
  setFromDate: (from: Date | undefined) => void;
  toDate: Date | undefined;
  setToDate: (to: Date | undefined) => void;
}

const DateFilter = ({ fromDate, setFromDate, toDate, setToDate }: Props) => {
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  return (
    <div className="flex flex-row gap-1 md:gap-3">
      {/* Start From */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="date" className="px-1 text-xs font-semibold">
          Date From
        </Label>
        <Popover open={fromOpen} onOpenChange={setFromOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-40 justify-between font-normal text-xs"
            >
              {fromDate ? fromDate.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              captionLayout="dropdown"
              onSelect={(date) => {
                setFromDate(date);
                setFromOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      {/* End at */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="date" className="px-1 text-xs font-semibold">
          To
        </Label>
        <Popover open={toOpen} onOpenChange={setToOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-40 justify-between font-normal text-xs"
            >
              {toDate ? toDate.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              captionLayout="dropdown"
              onSelect={(date) => {
                setToDate(date);
                setToOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateFilter;
