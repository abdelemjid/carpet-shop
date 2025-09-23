import { create } from "zustand";

interface User {
  id: string;
  username: string;
  role: string;
}

interface AppStoreType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAppStore = create<AppStoreType>((set) => ({
  user: null,
  isAuthenticated: false,
  login: () => {
    set({ isAuthenticated: true });
  },
  logout: () => {
    set({ isAuthenticated: false });
  },
}));
