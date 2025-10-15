import type { Status } from "@/types/order.type";
import DateFilter from "../home/DateFilter";
import StatusFilter from "./StatusFilter";
import QuantityFilter from "../products/QuantityFilter";

interface Props {
  fromDate?: Date | undefined;
  toDate?: Date | undefined;
  setFromDate: (from: Date | undefined) => void;
  setToDate: (to: Date | undefined) => void;
  quantity?: number[] | undefined;
  setQuantity: (quantity: number[] | undefined) => void;
  status?: Status | undefined;
  setStatus: (status: Status | undefined) => void;
  page?: number | undefined;
  setPage: (page: number | undefined) => void;
}

const OrdersFilter = ({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  quantity,
  setQuantity,
  status,
  setStatus,
}: Props) => {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:justify-center lg:items-center h-fit">
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
      <QuantityFilter quantity={quantity} setQuantity={setQuantity} />
    </div>
  );
};

export default OrdersFilter;
