import type { Status } from "@/types/order.type";
import React, { useState, createContext, useContext } from "react";

interface Props {
  fromDate?: Date | undefined;
  setFromDate: (from: Date | undefined) => void;
  toDate?: Date | undefined;
  setToDate: (to: Date | undefined) => void;
  quantity?: number[] | undefined;
  setQuantity: (quantity: number[] | undefined) => void;
  status: Status | undefined;
  setStatus: (status: Status | undefined) => void;
  page?: number | undefined;
  setPage: (page: number | undefined) => void;
}

const OrdersFilterContext = createContext<Props | undefined>(undefined);

export const OrderContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [quantity, setQuantity] = useState<number[] | undefined>(undefined);
  const [status, setStatus] = useState<Status | undefined>(undefined);
  const [page, setPage] = useState<number | undefined>(1);

  return (
    <OrdersFilterContext.Provider
      value={{
        fromDate,
        setFromDate,
        toDate,
        setToDate,
        quantity,
        setQuantity,
        status,
        setStatus,
        page,
        setPage,
      }}
    >
      {children}
    </OrdersFilterContext.Provider>
  );
};

export const useOrdersFilterContext = () => {
  const context = useContext(OrdersFilterContext);
  if (!context)
    throw new Error(
      "useOrdersFilter must be used within OrderContextProvider!"
    );

  return context;
};
