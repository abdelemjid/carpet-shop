import type { Status } from "@/types/order.type";
import DateFilter from "../home/DateFilter";
import StatusFilter from "./StatusFilter";
import QuantityFilter from "../products/QuantityFilter";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface Props {
  fromDate?: Date | undefined;
  toDate?: Date | undefined;
  setFromDate: (from: Date | undefined) => void;
  setToDate: (to: Date | undefined) => void;
  fQuantity: number | undefined;
  tQuantity: number | undefined;
  setFQuantity: (from: number | undefined) => void;
  setTQuantity: (to: number | undefined) => void;
  status?: Status | undefined;
  setStatus: (status: Status | undefined) => void;
  page?: number;
  setPage: (page: number) => void;
  clearFilter: () => void;
}

const OrdersFilter = ({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  fQuantity,
  setFQuantity,
  tQuantity,
  setTQuantity,
  status,
  setStatus,
  clearFilter,
}: Props) => {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center h-fit">
      {/* Date Filter */}
      <DateFilter
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
      />
      {/* Status Filter */}
      <StatusFilter key="key-status" status={status} setStatus={setStatus} />
      {/* Quantity Filter */}
      <QuantityFilter
        fQuantity={fQuantity}
        setFQuantity={setFQuantity}
        tQuantity={tQuantity}
        setTQuantity={setTQuantity}
      />
      {/* Clear Button */}
      <Button
        variant="outline"
        title="Clear filters"
        onClick={() => clearFilter()}
        className="text-red-500 self-end cursor-pointer"
      >
        <X /> Clear
      </Button>
    </div>
  );
};

export default OrdersFilter;
