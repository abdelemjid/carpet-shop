import { toast } from "sonner";
import type { ProductsResponse } from "./types/product.type";
import type { OrdersQuery, OrderUpdateRequestBody } from "./types/order.type";
import type { DailyStatsResponse, StatsResponseType } from "./types/stats.type";

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
  const response = await fetch(`${baseUrl}/api/admin/products/new`, {
    method: "POST",
    credentials: "include",
    body: productData,
  });

  const result = await response.json();

  if (!response.ok) throw new Error(result["error"]);

  return result;
};

export const fetchProducts = async (
  searchQuery: any
): Promise<ProductsResponse | null> => {
  const query = new URLSearchParams();

  searchQuery?.fromDate && query.append("fromDate", searchQuery.fromDate);
  searchQuery?.toDate && query.append("toDate", searchQuery.toDate);
  if (searchQuery?.quantity && searchQuery.quantity.length > 0)
    query.append("fromQuantity", searchQuery.quantity[0]);
  if (searchQuery?.quantity && searchQuery.quantity.length > 1)
    query.append("toQuantity", searchQuery.quantity[1]);
  searchQuery?.category && query.append("category", searchQuery.category);
  searchQuery?.page && query.append("page", searchQuery.page);

  const response = await fetch(`${baseUrl}/api/admin/products?${query}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    toast.error(data?.error);
    return null;
  }

  return data;
};

export const fetchProduct = async (productId: string) => {
  const response = await fetch(`${baseUrl}/api/admin/products/${productId}`, {
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

  const response = await fetch(`${baseUrl}/api/admin/products/${productId}`, {
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
  const response = await fetch(`${baseUrl}/api/admin/products/${productId}`, {
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
  const response = await fetch(`${baseUrl}/api/admin/users`, {
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

export const fetchUser = async (userId: string) => {
  const response = await fetch(`${baseUrl}/api/admin/users/${userId}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    toast.error(result?.error || "Failed to fetch user!");
    return null;
  }

  return result;
};

export const banUser = async (userId: string) => {
  const response = await fetch(`${baseUrl}/api/admin/users/ban/${userId}`, {
    method: "PUT",
    credentials: "include",
  });

  const result = await response.json();

  if (!response) {
    toast.error(result?.error || "Failed to Ban the user!");
    return;
  }

  toast.success(result?.message || "User banned or permitted successfully.");
};

export const deleteUser = async (userId: string) => {
  const response = await fetch(`${baseUrl}/api/admin/users/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    toast.error(result?.error || "Failed to delete the user!");
    return;
  }

  toast.success(result?.message || "User deleted successfully.");
};

/******************** Orders **********************/

export const fetchUserOrders = async (userId: string) => {
  const response = await fetch(`${baseUrl}/api/admin/orders/user/${userId}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    toast.error(
      result?.error || "Error occurred while fetching user's orders!"
    );
    return null;
  }

  return result;
};

export const fetchAllOrders = async (query: OrdersQuery) => {
  const queryParams = new URLSearchParams();

  if (query.page) queryParams.append("page", query.page.toString());
  if (query.status) queryParams.append("status", query.status);
  if (query.fromDate) {
    queryParams.append(
      "fromDate",
      new Date(
        query.fromDate.getFullYear(),
        query.fromDate.getMonth(),
        query.fromDate.getDay() - 1
      )
        .toISOString()
        .split("T")[0]
    );
  }
  if (query.toDate) {
    queryParams.append(
      "toDate",
      new Date(
        query.toDate.getFullYear(),
        query.toDate.getMonth(),
        query.toDate.getDay() - 1
      )
        .toISOString()
        .split("T")[0]
    );
  }
  if (query.quantityFrom)
    queryParams.append("quantityFrom", query.quantityFrom.toString());
  if (query.quantityTo)
    queryParams.append("quantityTo", query.quantityTo.toString());

  window.history.replaceState(null, "", `?${queryParams.toString()}`);

  const response = await fetch(`${baseUrl}/api/admin/orders?${queryParams}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    toast.error(result?.error || "Can not fetch orders!");
    return null;
  }

  return result;
};

export const updateOrder = async (data: OrderUpdateRequestBody) => {
  const response = await fetch(`${baseUrl}/api/admin/orders/${data._id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    toast.error(result.error || "Status did not updated!");
    return null;
  }

  return result;
};

/******************** Statistics********************/

export const fetchStats = async (
  queryParams: any
): Promise<StatsResponseType | null> => {
  const query = new URLSearchParams();

  query.append("start", queryParams.start || "");
  query.append("end", queryParams.end || "");

  const response = await fetch(`${baseUrl}/api/admin/stats?${query}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    toast.error(result?.error || "Error fetching statistics!");
    return null;
  }

  return result;
};

export const fetchDailyStats = async (
  queryParams: any
): Promise<DailyStatsResponse[] | null> => {
  const query = new URLSearchParams();

  query.append("start", queryParams.start || "");
  query.append("end", queryParams.end || "");

  const response = await fetch(`${baseUrl}/api/admin/stats/daily?${query}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    toast.error(result?.error || "Error fetching daily stats!");
    return null;
  }

  return result;
};
