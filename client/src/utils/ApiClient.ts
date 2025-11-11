import type { CartItem } from "@/types/cart.type";
import type { CheckoutForm } from "@/types/checkout.type";
import type { OrdersResponse } from "@/types/order.type";
import type { Product, ProductsResponse } from "@/types/product.type";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * ApiClient - class for all api end points
 */
export class ApiClient {
  /************ Authentication *************/

  static validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-token`, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      return null;
    }

    return result;
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

    toast.success(result?.message || "Logged out successfully");
  };

  static loginUser = async (form: { email: string; password: string }) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data?.error || "Failed to login!");
      return null;
    }

    return data;
  };

  static RegisterUser = async (form: {
    username: string;
    email: string;
    password: string;
  }) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data?.error || "Failed to register!");
      return null;
    }

    return data;
  };

  static CheckoutOrders = async (ids: string, data: CheckoutForm) => {
    const response = await fetch(
      `${API_BASE_URL}/api/checkout/confirm?${ids}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      toast.error(result?.error || "Failed to order!");
      return null;
    }

    toast.success(result?.message || "Ordered successfully");
    return result;
  };

  /*************** Products ***************/

  static getProducts = async (
    query: string
  ): Promise<ProductsResponse | null> => {
    const url = query
      ? `${API_BASE_URL}/api/products?${query}`
      : `${API_BASE_URL}/api/products`;

    const response = await fetch(url, {
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

  static getProduct = async (productId: string): Promise<Product | null> => {
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

  static setCart = async (cartItems: CartItem[]) => {
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
  };

  static getCart = async (): Promise<CartItem[]> => {
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

  static getCartItem = async (itemId: string): Promise<CartItem | null> => {
    const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) return null;

    return result;
  };

  static updateCartItem = async (item: CartItem) => {
    const response = await fetch(`${API_BASE_URL}/api/cart/${item?._id}`, {
      method: "PATCH",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok)
      toast.error(result?.error || "Failed to updated cart item!");
    else toast.success(result?.message || "Cart item updated");
  };

  static deleteCartItem = async (itemId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) toast.error(`Failed to delete cart item!`);
    else toast.success(result?.message || "Cart item deleted");
  };

  static clearCart = async () => {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: "DELETE",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) toast.error(result?.error || "Failed to clear cart!");
    else toast.success(result?.message || "Cart is cleared");
  };

  /****************** Orders ******************/

  static getOrders = async (): Promise<OrdersResponse | null> => {
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
}
