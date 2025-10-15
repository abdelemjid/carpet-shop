import React, { createContext, useContext, useState } from "react";

interface Props {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  setFromDate: (from: Date | undefined) => void;
  setToDate: (to: Date | undefined) => void;
  category: string | undefined;
  setCategory: (category: string) => void;
  quantity: number[] | undefined;
  setQuantity: (quantity: number[]) => void;
  page: number | undefined;
  setPage: (page: number) => void;
}

const ProductsFilterContext = createContext<Props | undefined>(undefined);

export const ProductsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number[] | undefined>(undefined);
  const [page, setPage] = useState<number>(1);

  return (
    <ProductsFilterContext.Provider
      value={{
        fromDate,
        setFromDate,
        toDate,
        setToDate,
        category,
        setCategory,
        quantity,
        setQuantity,
        page,
        setPage,
      }}
    >
      {children}
    </ProductsFilterContext.Provider>
  );
};

export const useProductsContext = () => {
  const context = useContext(ProductsFilterContext);

  if (!context)
    throw new Error(
      "useProductsContext must be used within ProductsContextProvider!"
    );

  return context;
};
