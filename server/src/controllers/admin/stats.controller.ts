import { Request, Response } from 'express';
import userModel from '../../models/user.model';
import orderModel from '../../models/order.model';
import productModel from '../../models/product.model';
import { DailyStatsResponse, StatsResponseType } from '../../types/statistics.type';
import { constructorStatsFilter } from '../../filters/admin/stats.filter';

/**
 * Retrieves global statistics including users, orders, products, and earnings within a date range.
 *
 * @param req.query - Optional query parameters for filtering by date (e.g., startDate, endDate)
 *
 * @returns 200 - Successfully retrieved statistics summary
 * @returns 500 - Server error while fetching statistics
 *
 * Process:
 * 1. Builds date filter using constructorStatsFilter from query parameters
 * 2. Defaults to current month if no date range is provided
 * 3. Executes parallel database queries to fetch:
 *    - Active users count (role: 'user')
 *    - Total orders count
 *    - Aggregated order stats (quantity and earnings)
 *    - Total available products (quantity ≥ 1)
 * 4. Combines all metrics into a unified response object
 *
 * Returned data:
 * - activeUsers: total registered non-admin users
 * - totalOrders: total number of orders in the system
 * - totalProducts: available products in stock
 * - orderedProductsThisMonth: number of products ordered in the selected range
 * - earningsThisMonth: total earnings from orders in the selected range
 *
 * @example
 * GET /statistics?startDate=2025-11-01&endDate=2025-11-30
 * Response: {
 *   activeUsers: 142,
 *   totalOrders: 689,
 *   totalProducts: 321,
 *   orderedProductsThisMonth: 87,
 *   earningsThisMonth: 11294.75
 * }
 */
export const getStatistics = async (req: Request, res: Response) => {
  try {
    let query: { createdAt?: { $gte?: Date; $lte?: Date } } = constructorStatsFilter(req?.query);

    if (!query) {
      const now = new Date();
      query = {
        createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) },
      };
    }

    const [activeUsers, totalOrders, orderedStats, totalProducts] = await Promise.all([
      userModel.countDocuments({ role: 'user' }),
      orderModel.countDocuments(),
      orderModel.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: 1 },
            totalEarnings: { $sum: '$totalPrice' },
          },
        },
      ]),
      productModel.countDocuments({ quantity: { $gte: 1 } }),
    ]);

    const stats =
      orderedStats.length > 0 ? orderedStats[0] : { totalQuantity: 0, totalEarnings: 0 };

    const response: StatsResponseType = {
      activeUsers: activeUsers,
      totalOrders: totalOrders,
      totalProducts: totalProducts,
      orderedProductsThisMonth: stats.totalQuantity,
      earningsThisMonth: stats.totalEarnings,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error occurred during fetching statistics:', (error as Error).message);
    return res.status(500).json({ message: 'Internal error!' });
  }
};

/**
 * Retrieves daily earnings and order count statistics within a specified date range.
 *
 * @param req.query - Optional query parameters for filtering by date (e.g., startDate, endDate)
 *
 * @returns 200 - Successfully retrieved daily statistics
 * @returns 500 - Server error while generating statistics
 *
 * Process:
 * 1. Constructs date filter using constructorStatsFilter from request query
 * 2. Defaults to current month's data if no filter is provided
 * 3. Aggregates orders by day, month, and year using MongoDB aggregation
 * 4. Calculates total earnings and number of orders per day
 * 5. Projects formatted date strings and sorts results chronologically
 *
 * Returned data:
 * - date: Formatted as "DD-MM-YYYY"
 * - earnings: Total revenue for that day
 * - orders: Total number of orders for that day
 *
 * @example
 * GET /statistics/daily?startDate=2025-11-01&endDate=2025-11-10
 * Response: [
 *   { date: "1-11-2025", earnings: 1240.50, orders: 12 },
 *   { date: "2-11-2025", earnings: 890.00, orders: 9 }
 * ]
 */
export const getDailyStats = async (req: Request, res: Response) => {
  try {
    let query: { createdAt?: { $gte?: Date; $lte?: Date } } = constructorStatsFilter(req?.query);

    if (!query) {
      const now = new Date();
      query = {
        createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) },
      };
    }

    const stats = await orderModel.aggregate<DailyStatsResponse | null>([
      { $match: query },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$createdAt' },
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          earnings: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              { $toString: '$_id.day' },
              '-',
              { $toString: '$_id.month' },
              '-',
              { $toString: '$_id.year' },
            ],
          },
          earnings: 1,
          orders: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error occurred during fetching daily stats:', (error as Error).message);
    return res.status(500).json({ error: 'Internal error!' });
  }
};
