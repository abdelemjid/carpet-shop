export interface OrdersSearchQuery {
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
  quantity?: {
    $gte?: number;
    $lte?: number;
  };
  status?: string;
}

/**
 * Constructs a MongoDB filter object for querying orders based on search parameters.
 *
 * @param searchQuery - Object containing optional filter fields:
 *   - fromDate: Start date for order creation
 *   - toDate: End date for order creation
 *   - quantityFrom: Minimum order quantity
 *   - quantityTo: Maximum order quantity
 *   - status: Order status ('pending', 'prepared', 'refused', 'sent', 'delivered')
 *
 * @returns OrdersSearchQuery - MongoDB query object ready for use in find()
 *
 * Process:
 * 1. Applies date range filters if `fromDate` or `toDate` are provided
 * 2. Applies quantity range filters if `quantityFrom` or `quantityTo` are provided
 * 3. Filters by order status if provided
 *
 * @example
 * const filter = constructorOrdersFilter({ fromDate: '2025-11-01', status: 'delivered' });
 * Order.find(filter);
 */
export const constructorOrdersFilter = (searchQuery: any) => {
  const query: OrdersSearchQuery = {};

  if (searchQuery.fromDate) {
    if (query.createdAt) query.createdAt.$gte = new Date(searchQuery.fromDate);
    else query.createdAt = { $gte: new Date(searchQuery.fromDate) };
  }
  if (searchQuery.toDate) {
    if (query.createdAt) query.createdAt.$lte = new Date(searchQuery.toDate);
    else query.createdAt = { $lte: new Date(searchQuery.toDate) };
  }
  if (searchQuery.quantityFrom) {
    if (query.quantity) query.quantity.$gte = parseInt(searchQuery.quantityFrom);
    else query.quantity = { $gte: parseInt(searchQuery.quantityFrom) };
  }
  if (searchQuery.quantityTo) {
    if (query.quantity) query.quantity.$lte = parseInt(searchQuery.quantityTo);
    else query.quantity = { $lte: parseInt(searchQuery.quantityTo) };
  }
  if (searchQuery.status) query.status = searchQuery.status;

  return query;
};
