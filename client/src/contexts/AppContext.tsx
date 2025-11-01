import React, { createContext, useContext, useState } from "react";

export type ThemeType = "dark" | "light";

interface AppType {
  // Theme
  currentTheme: ThemeType;
  setCurrentTheme: (theme: ThemeType) => void;
  navToggled: boolean;
  setNavToggled: (toggled: boolean) => void;
}

const AppContext = createContext<AppType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const AppContextProvider = ({ children }: Props) => {
  // Theme Manager
  const defaultTheme = localStorage.getItem("theme") || "dark";
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(
    defaultTheme as ThemeType
  );
  // Navbar state
  const [navToggled, setNavToggled] = useState(false);

  return (
    <AppContext.Provider
      value={{
        // Theme
        currentTheme,
        setCurrentTheme,
        navToggled,
        setNavToggled,
      }}
    >
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
