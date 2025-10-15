export type Category = 's' | 'm' | 'l';

export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  width: number;
  height: number;
  images: string[];
  category: Category;
  createdAt?: Date;
  updateAt?: Date;
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
