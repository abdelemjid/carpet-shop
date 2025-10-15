import { Category } from '../../types/product.type';

export interface ProductsSearchQuery {
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
  category?: Category;
  quantity?: {
    $gte?: number;
    $lte?: number;
  };
}

export const constructorProductsFilter = (searchQuery: any) => {
  const query: ProductsSearchQuery = {};

  if (searchQuery.fromDate) {
    if (query.createdAt) query.createdAt.$gte = new Date(searchQuery.fromDate.toString());
    else {
      query.createdAt = {};
      query.createdAt.$gte = new Date(searchQuery.fromDate.toString());
    }
  }
  if (searchQuery.toDate) {
    if (query.createdAt) query.createdAt.$lte = new Date(searchQuery.toDate.toString());
    else {
      query.createdAt = {};
      query.createdAt.$lte = new Date(searchQuery.toDate.toString());
    }
  }
  if (
    searchQuery.fromQuantity &&
    searchQuery.fromQuantity !== '-1' &&
    searchQuery.fromQuantity !== 'undefined' &&
    searchQuery.fromQuantity !== 'NaN'
  ) {
    if (query.quantity) query.quantity.$gte = parseInt(searchQuery.fromQuantity.toString());
    else {
      query.quantity = {};
      query.quantity.$gte = parseInt(searchQuery.fromQuantity.toString());
    }
  }
  if (
    searchQuery.toQuantity &&
    searchQuery.toQuantity !== '-1' &&
    searchQuery.toQuantity !== 'undefined' &&
    searchQuery.toQuantity !== 'NaN'
  ) {
    if (query.quantity) query.quantity.$lte = parseInt(searchQuery.toQuantity.toString());
    else {
      query.quantity = {};
      query.quantity.$lte = parseInt(searchQuery.toQuantity.toString());
    }
  }
  if (searchQuery.category && searchQuery.category !== 'default')
    query.category = searchQuery.category as Category;

  return query;
};
