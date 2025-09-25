export type Category = "s" | "m" | "l";

export interface Product {
  name: string;
  description: string;
  price: number;
  quantity: number;
  width: number;
  height: number;
  images: string[];
  category: Category;
}
