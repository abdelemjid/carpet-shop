import { Request, Response } from 'express';
import { FetchingOrdersConfig } from '../../config/fetching';
import orderModel from '../../models/order.model';
import { Order, OrdersResponse } from '../../types/order.type';
import { constructorOrdersFilter, OrdersSearchQuery } from '../../filters/admin/orders.filter';

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const page = Math.max(
      parseInt(req?.query?.page as string, FetchingOrdersConfig.page) || FetchingOrdersConfig.page,
      FetchingOrdersConfig.page,
    );
    const limit = Math.max(FetchingOrdersConfig.limit, 15);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      await orderModel.find({ userId: userId }).skip(skip).limit(limit).lean<Order[]>(),
      await orderModel.countDocuments({ userId: userId }),
    ]);

    const response: OrdersResponse = {
      orders: orders,
      pagination: {
        page: page,
        pages: Math.ceil(total / limit),
        total: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error occurred while fetching user's orders:", (error as Error).message);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const query: OrdersSearchQuery = req?.query ? constructorOrdersFilter(req.query) : {};

    const page = Math.max(
      parseInt(req?.query?.page as string, FetchingOrdersConfig.page) || FetchingOrdersConfig.page,
      FetchingOrdersConfig.page,
    );
    const limit = Math.max(FetchingOrdersConfig.limit, 15);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      await orderModel.find(query).skip(skip).limit(limit).lean<Order[]>(),
      await orderModel.countDocuments(query),
    ]);

    const response: OrdersResponse = {
      orders: orders,
      pagination: {
        page: page,
        pages: Math.ceil(total / limit),
        total: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error occurred through fetching all orders:', (error as Error).message);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;

    const order = await orderModel.findOne({ _id: orderId });
    if (!order) return res.status(404).json({ error: 'Order not found!' });

    return res.status(200).json(order);
  } catch (error) {
    console.error('Error occurred while fetching the order:', (error as Error).message);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const delivered = req?.body?.delivered;
    const quantity = req?.body?.quantity;
    const status = req?.body?.status;
    const refuseReason = req?.body?.refuseReason;

    const updated: Partial<{
      delivered?: boolean;
      quantity?: number;
      status?: string;
      refuseReason?: string;
    }> = {};

    if (typeof delivered === 'boolean') updated.delivered = delivered;
    if (
      typeof status === 'string' &&
      ['pending', 'prepared', 'refused', 'sent', 'delivered'].includes(status)
    ) {
      updated.status = status;
      if (updated.status === 'delivered') updated.delivered = true;
      else updated.delivered = false;
    }
    if (typeof refuseReason === 'string') updated.refuseReason = refuseReason;
    if (typeof quantity === 'number' && quantity >= 0) updated.quantity = quantity;

    if (updated.quantity === 0) {
      const order = await orderModel.findByIdAndDelete(orderId);
      if (!order) return res.status(404).json({ error: 'Order not found!' });
      return res.status(200).json({ message: 'Order removed.' });
    }

    const order = await orderModel.findOneAndUpdate({ _id: orderId }, updated, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found!' });

    return res.status(200).json(order);
  } catch (error) {
    console.error('Error occurred through order update:', (error as Error).message);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;

    const deletedOrder = await orderModel.findOneAndDelete({ _id: orderId });
    if (!deletedOrder) return res.status(404).json({ error: 'Order not found!' });

    return res.status(200).json({ message: 'Order deleted successfully.' });
  } catch (error) {
    console.error('Error occurred through order deletion:', (error as Error).message);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};
