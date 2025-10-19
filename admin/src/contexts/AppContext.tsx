import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "dark" | "light";

interface AppType {
  selectedTheme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

interface Props {
  children: React.ReactNode;
}

const AppContext = createContext<AppType | undefined>(undefined);

export const AppContextProvider = ({ children }: Props) => {
  const [selectedTheme, setTheme] = useState<ThemeMode>(
    (localStorage.getItem("theme") || "dark") as ThemeMode
  );

  useEffect(() => {
    localStorage.setItem("theme", selectedTheme);
    document.body.classList.remove("dark", "light");
    document.body.classList.add(selectedTheme);
  }, [selectedTheme]);

  return (
    <AppContext.Provider value={{ selectedTheme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useContext must be used within AppContextProvider!");

  return context;
};
