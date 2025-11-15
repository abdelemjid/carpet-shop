import React, { createContext, useContext, useState } from "react";

interface HomeFilterType {
  fromDate: Date | undefined;
  setFromDate: (from: Date | undefined) => void;
  toDate: Date | undefined;
  setToDate: (to: Date | undefined) => void;
  clearFilter: () => void;
}

const HomeFilterContext = createContext<HomeFilterType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const HomeFilterContextProvider = ({ children }: Props) => {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  const clearFilter = () => {
    setFromDate(undefined);
    setToDate(undefined);
  };

  return (
    <HomeFilterContext.Provider
      value={{ fromDate, setFromDate, toDate, setToDate, clearFilter }}
    >
      {children}
    </HomeFilterContext.Provider>
  );
};

export const useHomeFilterContext = () => {
  const context = useContext(HomeFilterContext);

  if (!context) {
    throw new Error(
      "Error useHomeFilterContext must be used within HomeFilterContextProvider!"
    );
  }

  return context;
};
