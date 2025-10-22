import type { CartItem } from "@/types/order.type";
import type { Product } from "@/types/product.type";
import { CartManager } from "@/utils/CartManager";
import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeType = "dark" | "light";

interface AppType {
  currentTheme: ThemeType;
  setCurrentTheme: (theme: ThemeType) => void;
  handleAddToCart: (product: Product, quantity?: number) => void;
  handleRemoveItem: (productId: string) => void;
  handleUpdateQuantity: (productId: string, quantity: number) => void;
  handleClearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getItem: (productId: string) => CartItem | null;
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

  // Cart Manager
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(CartManager.getCart());
  }, []);

  const handleAddToCart = (product: Product, quantity?: number) => {
    const updatedCart = CartManager.addItem(product, quantity);
    setCart(updatedCart);
  };

  const handleRemoveItem = (productId: string) => {
    const updatedCart = CartManager.removeItem(productId);
    setCart(updatedCart);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const updatedCart = CartManager.updateQuantity(productId, quantity);
    setCart(updatedCart);
  };

  const handleClearCart = () => {
    CartManager.clearCart();
    setCart([]);
  };

  const getTotal = (): number => {
    return CartManager.getTotal();
  };

  const getItemCount = (): number => {
    return CartManager.getItemCount();
  };

  const getItem = (productId: string) => CartManager.getItem(productId);

  return (
    <AppContext.Provider
      value={{
        currentTheme,
        setCurrentTheme,
        getItemCount,
        getTotal,
        handleAddToCart,
        handleClearCart,
        handleRemoveItem,
        handleUpdateQuantity,
        getItem,
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
