import { toast } from "sonner";
import type { Product, ProductsResponse } from "./types/product.type";

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
