import type { CartItem } from "@/types/order.type";
import type { Product } from "@/types/product.type";

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

  static addItem(product: Product, quantity: number = 1): CartItem[] {
    const cart = this.getCart();
    const existingIndex = cart.findIndex((item) => item._id === product._id);

    if (existingIndex > -1) {
      cart[existingIndex].orderQuantity = quantity;
    } else {
      cart.push({ ...product, orderQuantity: quantity });
    }

    this.saveCart(cart);
    return cart;
  }

  static updateQuantity(productId: string, quantity: number): CartItem[] {
    const cart = this.getCart();
    const itemIndex = cart.findIndex((item) => item._id === productId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
    }

    this.saveCart(cart);
    return cart;
  }

  static getItem(productId: string): CartItem | null {
    const item = this.getCart().find((item, _) => item._id === productId);
    return item || null;
  }

  static removeItem(productId: string): CartItem[] {
    const cart = this.getCart().filter((item) => item._id !== productId);
    this.saveCart(cart);
    return cart;
  }

  static clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
  }

  static getTotal(): number {
    return this.getCart().reduce(
      (total, item) => total + item.orderQuantity * item.price,
      0
    );
  }

  static getItemCount(): number {
    return this.getCart().reduce(
      (count, item) => count + item.orderQuantity,
      0
    );
  }
}
