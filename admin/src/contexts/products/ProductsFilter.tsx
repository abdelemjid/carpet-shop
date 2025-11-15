import React, { createContext, useContext, useState } from "react";

interface ProductsFilterType {
  page: number;
  setPage: (page: number) => void;
  fromDate: Date | undefined;
  setFromDate: (from: Date | undefined) => void;
  toDate: Date | undefined;
  setToDate: (to: Date | undefined) => void;
  category: string | undefined;
  setCategory: (category: string | undefined) => void;
  fQuantity: number | undefined;
  setFQuantity: (from: number | undefined) => void;
  tQuantity: number | undefined;
  setTQuantity: (to: number | undefined) => void;
  clearFilter: () => void;
}

const ProductsFilterContext = createContext<ProductsFilterType | undefined>(
  undefined
);

export const ProductsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [fQuantity, setFQuantity] = useState<number | undefined>(undefined);
  const [tQuantity, setTQuantity] = useState<number | undefined>(undefined);
  const [page, setPage] = useState<number>(1);

  const clearFilter = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setCategory(undefined);
    setFQuantity(undefined);
    setTQuantity(undefined);
  };

  return (
    <ProductsFilterContext.Provider
      value={{
        page,
        setPage,
        category,
        setCategory,
        fQuantity,
        setFQuantity,
        fromDate,
        setFromDate,
        toDate,
        setToDate,
        tQuantity,
        setTQuantity,
        clearFilter,
      }}
    >
      {children}
    </ProductsFilterContext.Provider>
  );
};

export const useProductsFilterContext = () => {
  const context = useContext(ProductsFilterContext);
  if (!context) {
    throw new Error(
      "Error useProductsFilterContext must be used within ProductsContextProvider!"
    );
  }

  return context;
};
