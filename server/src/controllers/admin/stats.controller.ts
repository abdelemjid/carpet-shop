import { Request, Response } from 'express';
import userModel from '../../models/user.model';
import orderModel from '../../models/order.model';
import productModel from '../../models/product.model';
import { DailyStatsResponse, StatsResponseType } from '../../types/statistics.type';
import { constructorStatsFilter } from '../../filters/admin/stats.filter';

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
