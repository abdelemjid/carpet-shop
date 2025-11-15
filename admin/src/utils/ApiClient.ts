import type { OrdersQuery, OrderUpdateRequestBody } from "@/types/order.type";
import type { ProductsResponse } from "@/types/product.type";
import type { DailyStatsResponse, StatsResponseType } from "@/types/stats.type";
import type { UserAccount, UsersFilterSearchQuery } from "@/types/user.type";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:5000";

export class ApiClient {
  /****************** Authentication ******************/

  static login = async (value: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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

  static verifyToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-token`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) return null;

    return await response.json();
  };

  static logout = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      toast.error(result?.error || "Failed to logout!");
      return;
    }

    toast.success(result.message);
  };

  /******************* Product ***********************/

  static newProduct = async (productData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/products/new`, {
      method: "POST",
      credentials: "include",
      body: productData,
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result["error"]);

    return result;
  };

  static fetchProducts = async (
    searchQuery: string
  ): Promise<ProductsResponse | null> => {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/products?${searchQuery}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data?.error);
      return null;
    }

    return data;
  };

  static fetchProduct = async (productId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/products/${productId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      toast.error(result?.error);
      return null;
    }

    return result.product;
  };

  static updateProduct = async (productData: FormData) => {
    const productId = productData?.get("_id");
    if (!productId) throw new Error("Missing Product ID");

    const response = await fetch(
      `${API_BASE_URL}/api/admin/products/${productId}`,
      {
        method: "PATCH",
        credentials: "include",
        body: productData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      toast.error(result?.error || "Update product filed!");
      return;
    }

    toast.success("Product updated successfully.");
  };

  static deleteProduct = async (productId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/products/${productId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      toast.error(result?.error || "Product deletion filed!");
      return;
    }

    toast.success("Product deleted successfully.");
  };

  /**************** Users ****************/

  static fetchUsers = async (searchQuery: UsersFilterSearchQuery) => {
    const query = new URLSearchParams();

    if (searchQuery.joinDateFrom) {
      query.append(
        "joinDateFrom",
        new Date(searchQuery.joinDateFrom).toISOString().split("T")[0]
      );
    }
    if (searchQuery.joinDateTo)
      query.append(
        "joinDateTo",
        new Date(searchQuery.joinDateTo).toISOString().split("T")[0]
      );
    if (searchQuery.banned) query.append("banned", `${searchQuery.banned}`);
    if (searchQuery.page) query.append("page", searchQuery.page.toString());

    const response = await fetch(`${API_BASE_URL}/api/admin/users?${query}`, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      toast.error(result?.error || "Failed to fetch users!");
      return null;
    }

    return result;
  };

  static fetchUser = async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
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

  static banUser = async (userId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/users/ban/${userId}`,
      {
        method: "PUT",
        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response) {
      toast.error(result?.error || "Failed to Ban the user!");
      return;
    }

    toast.success(result?.message || "User banned or permitted successfully.");
  };

  static createUser = async (user: UserAccount) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/new`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const result = await response.json();

    if (!response.ok) {
      toast.error(result?.error || "User creation failed!");
      return null;
    }

    toast.success(result?.message || "User created successfully");
  };

  static deleteUser = async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
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

  static fetchUserOrders = async (userId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/orders/user/${userId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      toast.error(
        result?.error || "Error occurred while fetching user's orders!"
      );
      return null;
    }

    return result;
  };

  static fetchAllOrders = async (query: OrdersQuery) => {
    const queryParams = new URLSearchParams();

    if (query.page) queryParams.append("page", query.page.toString());
    if (query.status) queryParams.append("status", query.status);
    if (query.fromDate) {
      queryParams.append(
        "fromDate",
        new Date(query.fromDate).toISOString().split("T")[0]
      );
    }
    if (query.toDate) {
      queryParams.append(
        "toDate",
        new Date(query.toDate).toISOString().split("T")[0]
      );
    }
    if (query.quantityFrom)
      queryParams.append("quantityFrom", query.quantityFrom.toString());
    if (query.quantityTo)
      queryParams.append("quantityTo", query.quantityTo.toString());

    window.history.replaceState(null, "", `?${queryParams.toString()}`);

    const response = await fetch(
      `${API_BASE_URL}/api/admin/orders?${queryParams}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      toast.error(result?.error || "Can not fetch orders!");
      return null;
    }

    return result;
  };

  static updateOrder = async (data: OrderUpdateRequestBody) => {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/orders/${data._id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      toast.error(result.error || "Status did not updated!");
      return null;
    }

    return result;
  };

  /******************** Statistics********************/

  static fetchStats = async (
    queryParams: any
  ): Promise<StatsResponseType | null> => {
    const query = new URLSearchParams();

    query.append("start", queryParams.start || "");
    query.append("end", queryParams.end || "");

    const response = await fetch(`${API_BASE_URL}/api/admin/stats?${query}`, {
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

  static fetchDailyStats = async (
    queryParams: any
  ): Promise<DailyStatsResponse[] | null> => {
    const query = new URLSearchParams();

    query.append("start", queryParams.start || "");
    query.append("end", queryParams.end || "");

    const response = await fetch(
      `${API_BASE_URL}/api/admin/stats/daily?${query}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      toast.error(result?.error || "Error fetching daily stats!");
      return null;
    }

    return result;
  };
}
