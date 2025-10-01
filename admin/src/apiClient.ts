import { toast } from "sonner";
import type { ProductsResponse } from "./types/product.type";

const baseUrl = "http://localhost:5000";

export const verifyToken = async () => {
  const response = await fetch(`${baseUrl}/api/auth/verify-token`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) return null;

  return await response.json();
};

export const login = async (value: { email: string; password: string }) => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(value),
  });

  if (!response.ok) return null;

  return await response.json();
};

export const newProduct = async (productData: FormData) => {
  const response = await fetch(`${baseUrl}/api/admin/products/new`, {
    method: "POST",
    credentials: "include",
    body: productData,
  });

  const result = await response.json();

  if (!response.ok) throw new Error(result["error"]);

  return result;
};

export const fetchProducts = async (): Promise<ProductsResponse | null> => {
  const response = await fetch(`${baseUrl}/api/products`, {
    method: "GET",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    toast.error(data?.error);
    return null;
  }

  return data;
};
