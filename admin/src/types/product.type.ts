export type Category = "s" | "m" | "l";

export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  width: number;
  height: number;
  imageFiles: File[];
  images: string[];
  createAt: Date;
  updatedAt: Date;
}

export interface ProductsResponse {
  data?: Product[];
  pagination?: {
    page?: number;
    pages?: number;
    total?: number;
  };
}
