import React, { createContext, useContext, useState } from "react";

export type ThemeType = "dark" | "light";

interface AppType {
  currentTheme: ThemeType;
  setCurrentTheme: (theme: ThemeType) => void;
}

const AppContext = createContext<AppType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}
export const AppContextProvider = ({ children }: Props) => {
  const defaultTheme = localStorage.getItem("theme") || "dark";
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(
    defaultTheme as ThemeType
  );

  return (
    <AppContext.Provider value={{ currentTheme, setCurrentTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppContextProvider!");

  return context;
};
