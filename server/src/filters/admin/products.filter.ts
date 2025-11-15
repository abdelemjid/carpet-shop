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

/**
 * Constructs a MongoDB filter object for querying products based on date, quantity, and category ranges.
 *
 * @param searchQuery - Object containing optional filter fields:
 *   - fromDate: Start date for product creation
 *   - toDate: End date for product creation
 *   - fromQuantity: Minimum product quantity (ignored if -1, undefined, or NaN)
 *   - toQuantity: Maximum product quantity (ignored if -1, undefined, or NaN)
 *   - category: Product category (ignored if 'default')
 *
 * @returns ProductsSearchQuery - MongoDB query object ready for use in find()
 *
 * Process:
 * 1. Applies creation date range filters if `fromDate` or `toDate` are provided
 * 2. Applies quantity range filters if `fromQuantity` or `toQuantity` are valid
 * 3. Filters by category if provided and not 'default'
 *
 * @example
 * const filter = constructorProductsFilter({
 *   fromDate: '2025-11-01',
 *   toQuantity: 50,
 *   category: 'furniture'
 * });
 * Product.find(filter);
 */
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
  if (searchQuery.category) query.category = searchQuery.category as Category;

  return query;
};
