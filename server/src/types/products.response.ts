import { Product } from './product.type';

export interface ProductsResponse {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}
