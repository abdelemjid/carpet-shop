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
