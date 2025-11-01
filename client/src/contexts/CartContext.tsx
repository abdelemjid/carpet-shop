import type { CartItem } from "@/types/order.type";
import type { Product } from "@/types/product.type";
import { CartManager } from "@/utils/CartManager";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import * as apiClient from "@/apiClient";
import { useMutation } from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
}

interface CartContextType {
  updateOrderQuantity: (productId: string, quantity: number) => void;
  deleteOrder: (productId: string) => void;
  addOrder: (order: Product, quantity?: number) => void;
  getOrder: (productId: string) => CartItem | null;
  clearCart: () => void;
  getTotal: () => number;
  getItemsCount: () => number;
  cart: CartItem[] | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartContextProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<CartItem[] | undefined>(
    CartManager.getCart()
  );
  const { isAuthenticated, user } = useAuth();

  const { mutate: updateRemoteCart } = useMutation({
    mutationKey: ["cart"],
    mutationFn: apiClient.setCart,
  });

  // --- Helper: merge two carts (local + remote) by productId ---
  const mergeCarts = (local: CartItem[], remote: CartItem[]): CartItem[] => {
    const map = new Map<string, CartItem>();

    for (const item of remote) map.set(item?.productId, { ...item });
    for (const item of local) {
      const existing = map.get(item?.productId);
      if (existing) {
        map.set(item?.productId, {
          ...existing,
          orderQuantity: item.orderQuantity,
        });
      } else map.set(item?.productId, { ...item });
    }

    return Array.from(map.values());
  };

  useEffect(() => {
    cart && CartManager.saveCart(cart);
    if (cart && isAuthenticated) updateRemoteCart(cart);
  }, [cart]);

  // sync with server: if authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    (async () => {
      try {
        const remoteCart = await apiClient.getCart();

        if (
          !remoteCart ||
          (remoteCart.length === 0 && cart && cart?.length > 0)
        ) {
          cart && (await apiClient.setCart(cart));
        } else if (remoteCart && remoteCart.length > 0 && cart?.length === 0) {
          setCart(remoteCart);
        } else if (
          remoteCart &&
          remoteCart.length > 0 &&
          cart &&
          cart?.length > 0
        ) {
          const merged = mergeCarts(cart, remoteCart);
          setCart(merged);
          await apiClient.setCart(merged);
        }
      } catch (error) {
        console.error("Cart Sync Failed:", error);
      }
    })();
  }, [isAuthenticated, user]);

  const updateOrderQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      const updated = cart?.filter((item) => item?.productId !== productId);
      setCart(updated);
    } else {
      const item = cart?.find((item) => item.productId === productId);

      if (item) {
        const updatedCart = cart?.map((item) =>
          item.productId === productId
            ? { ...item, orderQuantity: quantity }
            : item
        );
        setCart(updatedCart);
      }
    }
  };

  const deleteOrder = (productId: string) => {
    setCart(cart?.filter((item) => item?.productId !== productId));
  };

  const addOrder = (order: Product, quantity: number = 1) => {
    const existing = cart?.find((item) => item?.productId === order._id);

    if (existing) {
      const updated = cart?.map((item) =>
        item.productId === order?._id
          ? { ...item, orderQuantity: item.orderQuantity + quantity }
          : item
      );
      setCart(updated);
    } else {
      const item = {
        orderQuantity: quantity,
        productId: order?._id,
        productImages: order?.images,
        productName: order?.name,
        productPrice: order?.price,
      } as CartItem;
      const newCart = [...(cart || []), item];
      setCart(newCart);
    }
  };

  const getOrder = (productId: string) => {
    return cart?.find((item) => item.productId === productId) || null;
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return (
      cart?.reduce(
        (counter, current) =>
          current.orderQuantity * current.productPrice + counter,
        0
      ) || 0
    );
  };

  const getItemsCount = () => {
    return cart?.reduce((count, item) => count + item.orderQuantity, 0) || 0;
  };

  return (
    <CartContext.Provider
      value={{
        addOrder,
        clearCart,
        deleteOrder,
        getItemsCount,
        getOrder,
        getTotal,
        updateOrderQuantity,
        cart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within CartContextProvider!");
  }

  return context;
};
