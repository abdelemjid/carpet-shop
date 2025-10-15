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
