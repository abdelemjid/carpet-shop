import type { CartItem } from "@/types/cart.type";

export class CartManager {
  private static CART_KEY = "offline_cart";

  static getCart(): CartItem[] {
    try {
      const cart = localStorage.getItem(this.CART_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error("Error reading cart:", error);
      return [];
    }
  }

  static saveCart(cart: CartItem[]): void {
    try {
      localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }
}
