import React, { createContext, useContext, useState } from "react";

export type PublishTimeType = undefined | "week" | "month" | "year";
export type CategoryType = undefined | "s" | "m" | "l";

interface SearchContextType {
  search: string;
  setSearch: (search: string) => void;
  publishTime: PublishTimeType;
  setPublishTime: (value: PublishTimeType) => void;
  category: CategoryType;
  setCategory: (value: CategoryType) => void;
  quantity: number | undefined;
  setQuantity: (from: number | undefined) => void;
  page: number;
  setPage: (page: number) => void;
  resetFilter: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchFilterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [search, setSearch] = useState<string>("");
  const [publishTime, setPublishTime] = useState<PublishTimeType>(undefined);
  const [category, setCategory] = useState<CategoryType>(undefined);
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [page, setPage] = useState<number>(1);

  const resetFilter = () => {
    setCategory(undefined);
    setPublishTime(undefined);
    setQuantity(undefined);
  };

  return (
    <SearchContext.Provider
      value={{
        search,
        setSearch,
        publishTime,
        setPublishTime,
        category,
        setCategory,
        quantity,
        setQuantity,
        page,
        setPage,
        resetFilter,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchAndFilter = () => {
  const context = useContext(SearchContext);
  if (!context)
    throw new Error(
      "Error use useSearchAndFilter within SearchFilterProvider!"
    );

  return context;
};
