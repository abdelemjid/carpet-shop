import { Product } from '../models/product.model';

export interface ProductsResponse {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}
