import { toast } from "sonner";
import type { ProductsResponse } from "./types/product.type";

const baseUrl = "http://localhost:5000";

/**************** Auth *****************/

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

/******************* Product ***********************/

export const newProduct = async (productData: FormData) => {
  const response = await fetch(`${baseUrl}/api/products/new`, {
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

export const fetchProduct = async (productId: string) => {
  const response = await fetch(`${baseUrl}/api/products/${productId}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    toast.error(result?.error);
    return null;
  }

  return result.product;
};

export const updateProduct = async (productData: FormData) => {
  const productId = productData?.get("_id");
  if (!productId) throw new Error("Missing Product ID");

  const response = await fetch(`${baseUrl}/api/products/${productId}`, {
    method: "PATCH",
    credentials: "include",
    body: productData,
  });

  const result = await response.json();

  if (!response.ok) {
    toast.error(result?.error || "Update product filed!");
    return;
  }

  toast.success("Product updated successfully.");
};

export const deleteProduct = async (productId: string) => {
  const response = await fetch(`${baseUrl}/api/products/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    toast.error(result?.error || "Product deletion filed!");
    return;
  }

  toast.success("Product deleted successfully.");
};

/************ Users ****************/

export const fetchUsers = async () => {
  const response = await fetch(`${baseUrl}/api/users`, {
    method: "GET",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    toast.error(result?.error || "Failed to fetch users!");
    return null;
  }

  return result;
};
