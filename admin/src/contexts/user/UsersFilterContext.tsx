import React, { createContext, useContext, useState } from "react";

interface FilterContextType {
  joinDateFrom: Date | undefined;
  setJoinDateFrom: (from: Date | undefined) => void;
  joinDateTo: Date | undefined;
  setJoinDateTo: (to: Date | undefined) => void;
  userStatus: string | undefined;
  setUserStatus: (status: string | undefined) => void;
  page: number;
  setPage: (page: number) => void;
  clearFilter: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const UsersFilterContextProvider = ({ children }: Props) => {
  // Date
  const [joinDateFrom, setJoinDateFrom] = useState<Date | undefined>(undefined);
  const [joinDateTo, setJoinDateTo] = useState<Date | undefined>(undefined);
  // Status
  const [userStatus, setUserStatus] = useState<string | undefined>(undefined);
  // Page
  const [page, setPage] = useState<number>(1);

  const clearFilter = () => {
    setJoinDateFrom(undefined);
    setJoinDateTo(undefined);
    setUserStatus(undefined);
  };

  return (
    <FilterContext.Provider
      value={{
        joinDateFrom,
        setJoinDateFrom,
        joinDateTo,
        setJoinDateTo,
        userStatus,
        setUserStatus,
        page,
        setPage,
        clearFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useUsersFilterContext = () => {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error(
      "Error useUsersFilterContext must be used within UsersFilterContextProvider!"
    );
  }

  return context;
};
