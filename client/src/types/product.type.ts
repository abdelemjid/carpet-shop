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
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

export interface ProductsSearchQuery {
  query?: string;
  category?: string;
  quantity?: number;
  date?: string;
  page?: number;
}
