import type { Status } from "@/types/order.type";
import React, { createContext, useContext, useState } from "react";

interface FilterContextType {
  // Quantity
  fQuantity: number | undefined;
  tQuantity: number | undefined;
  setFQuantity: (from: number | undefined) => void;
  setTQuantity: (to: number | undefined) => void;
  // Date
  fromDate: Date | undefined;
  toDate: Date | undefined;
  setFromDate: (from: Date | undefined) => void;
  setToDate: (to: Date | undefined) => void;
  // Status
  status: Status | undefined;
  setStatus: (status: Status | undefined) => void;
  // Page
  page: number;
  setPage: (page: number) => void;
  // Clear filter function
  clearFilter: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const OrdersFilterContextProvider = ({ children }: Props) => {
  // Date
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  // Quantity
  const [fQuantity, setFQuantity] = useState<number | undefined>(undefined);
  const [tQuantity, setTQuantity] = useState<number | undefined>(undefined);
  // Status
  const [status, setStatus] = useState<Status | undefined>(undefined);
  // Page
  const [page, setPage] = useState<number>(1);

  const clearFilter = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setFQuantity(undefined);
    setTQuantity(undefined);
    setStatus(undefined);
  };

  return (
    <FilterContext.Provider
      value={{
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
        page,
        setPage,
        clearFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useOrdersFilterContext = () => {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error(
      "Error useOrdersFilterContext must be used within OrdersFilterContextProvider!"
    );
  }

  return context;
};
