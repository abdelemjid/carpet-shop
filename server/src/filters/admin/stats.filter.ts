/**
 * Constructs a MongoDB filter object for querying documents by a date range.
 *
 * @param searchQuery - Object containing optional date range fields:
 *   - start: Start date for filtering (inclusive)
 *   - end: End date for filtering (inclusive)
 *
 * @returns Object with optional `createdAt` field containing `$gte` and/or `$lte` for MongoDB queries
 *
 * Process:
 * 1. Adds `$gte` to `createdAt` if `start` is provided
 * 2. Adds `$lte` to `createdAt` if `end` is provided
 *
 * @example
 * const filter = constructorStatsFilter({ start: '2025-11-01', end: '2025-11-30' });
 * Order.find(filter);
 */
export const constructorStatsFilter = (searchQuery: any) => {
  let constructedQuery: { createdAt?: { $gte?: Date; $lte?: Date } } = {};

  if (searchQuery.start) {
    if (constructedQuery.createdAt) constructedQuery.createdAt.$gte = new Date(searchQuery.start);
    else
      constructedQuery.createdAt = {
        $gte: new Date(searchQuery.start),
      };
  }

  if (searchQuery.end) {
    if (constructedQuery.createdAt) constructedQuery.createdAt.$lte = new Date(searchQuery.end);
    else
      constructedQuery.createdAt = {
        $lte: new Date(searchQuery.end),
      };
  }

  return constructedQuery;
};
