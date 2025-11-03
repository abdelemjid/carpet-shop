import { toast } from "sonner";
import type { Product, ProductsResponse } from "./types/product.type";
import type { CartItem } from "./types/cart.type";
import type { OrdersResponse, OrderType } from "./types/order.type";

const API_BASE_URL = "http://localhost:5000";

/************ Authentication *************/

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/verify-token`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    toast.error(result?.error || "Failed to validate your authentication!");
    return null;
  }

  return result;
};

export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    toast.error(result?.error || "Failed to logout!");
    return;
  }

  toast.success(result?.message || "Logged out successfully");
};

/*************** Products ***************/

export const getProducts = async (): Promise<ProductsResponse | null> => {
  const response = await fetch("/api/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    toast.error(result?.error || "Failed to fetch Products!");
    return null;
  }

  return result;
};

export const getProduct = async (
  productId: string
): Promise<Product | null> => {
  const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    toast.error(result?.error || "Failed to fetch product!");
    return null;
  }

  return result?.product;
};

/**************** Cart ***************/

export const setCart = async (cartItems: CartItem[]) => {
  const response = await fetch(`${API_BASE_URL}/api/cart`, {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(cartItems),
  });

  const result = await response.json();

  if (!response.ok) {
    toast.error(result?.error || "Error transferring cart items!");
    return;
  }

  toast.success(result?.message || "Cart transferred successfully");
};

export const getCart = async (): Promise<CartItem[]> => {
  const response = await fetch(`${API_BASE_URL}/api/cart`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    toast.error(result?.error || "Can not fetch the remove cart!");
    return [];
  }

  return result;
};

export const getCartItem = async (itemId: string): Promise<CartItem | null> => {
  const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) return null;

  return result;
};

export const updateCartItem = async (item: CartItem) => {
  const response = await fetch(`${API_BASE_URL}/api/cart/${item?._id}`, {
    method: "PATCH",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok)
    toast.error(result?.error || "Failed to updated cart item!");
  else toast.success(result?.message || "Cart item updated");
};

export const deleteCartItem = async (itemId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) toast.error(`Failed to delete cart item!`);
  else toast.success(result?.message || "Cart item deleted");
};

export const clearCart = async () => {
  const response = await fetch(`${API_BASE_URL}/api/cart`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) toast.error(result?.error || "Failed to clear cart!");
  else toast.success(result?.message || "Cart is cleared");
};

/****************** Orders ******************/

export const getOrders = async (): Promise<OrdersResponse | null> => {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.error || "Unauthorized fetching orders");
  }

  return result;
};
