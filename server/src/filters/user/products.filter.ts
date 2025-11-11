import { Category } from '../../types/product.type';

export interface ProductsSearchQuery {
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
  category?: Category;
  quantity?: {
    $gte?: number;
  };
  $or?: [
    { name: { $regex: string; $options: string } },
    { description: { $regex: string; $options: string } },
  ];
}

/**
 * Constructs a MongoDB filter object for querying products based on search parameters.
 *
 * @param searchQuery - Object containing optional filter fields:
 *   - date: 'week' | 'month' | 'year' for filtering by creation date
 *   - quantity: Minimum product quantity
 *   - category: Product category
 *   - query: Text search for name or description
 *
 * @returns ProductsSearchQuery - MongoDB query object ready for use in find()
 *
 * Process:
 * 1. Filters by creation date if `date` is provided
 *    - 'week' → products created within the last 7 days
 *    - 'month' → products created from start of current month
 *    - 'year' → products created from start of current year
 * 2. Filters by minimum quantity if provided
 * 3. Filters by category if provided
 * 4. Performs case-insensitive partial match on name or description if `query` is provided
 *
 * @example
 * const filter = constructorProductsFilter({ date: 'month', quantity: 10, query: 'chair' });
 * Product.find(filter);
 */
export const constructorProductsFilter = (searchQuery: any) => {
  const query: ProductsSearchQuery = {};

  // Date Filter
  if (searchQuery.date) {
    const now = new Date();

    switch (searchQuery?.date) {
      case 'week':
        query.createdAt = {
          $lte: new Date(now.getDate() - 7) || undefined,
        };
        break;
      case 'month':
        query.createdAt = {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1) || undefined,
        };
        break;
      case 'year':
        query.createdAt = {
          $gte: new Date(now.getFullYear(), 0, 0) || undefined,
        };
        break;
      default:
        break;
    }
  }
  // Quantity Filter
  if (searchQuery.quantity) {
    query.quantity = {
      $gte: Number(searchQuery.quantity) || undefined,
    };
  }
  // Category Filter
  if (searchQuery.category) query.category = searchQuery.category as Category;
  // Search Query
  if (searchQuery.query) {
    query.$or = [
      { name: { $regex: searchQuery.query, $options: 'i' } },
      { description: { $regex: searchQuery.query, $options: 'i' } },
    ];
  }

  return query;
};
