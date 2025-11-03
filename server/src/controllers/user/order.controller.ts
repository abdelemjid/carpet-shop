import { Request, Response } from 'express';
import orderModel from '../../models/order.model';
import { FetchingOrdersConfig } from '../../config/fetching';
import { Order, OrdersResponse, RespOrder } from '../../types/order.type';
import productModel from '../../models/product.model';
import { Types } from 'mongoose';

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = req?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized!' });

    const page = Math.max(
      parseInt(req?.query?.page as string, FetchingOrdersConfig.page) || FetchingOrdersConfig.page,
      FetchingOrdersConfig.page,
    );
    const limit = Math.max(FetchingOrdersConfig.limit, 15);
    const skip = (page - 1) * limit;

    const userObjectId = new Types.ObjectId(userId);

    const [orders, total] = await Promise.all([
      orderModel.aggregate<RespOrder>([
        { $match: { userId: userObjectId } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'productInfo',
            pipeline: [
              {
                $project: {
                  name: 1,
                  images: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            productDetails: { $arrayElemAt: ['$productInfo', 0] },
          },
        },
        {
          $project: {
            productInfo: 0,
          },
        },
      ]),

      orderModel.countDocuments({ userId: userObjectId }),
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

export const getOrder = async (req: Request, res: Response) => {
  try {
    const userId = req?.userId;
    const orderId = req?.params.orderId;

    const order = await orderModel.findOne({ _id: orderId, userId });
    if (!order) return res.status(404).json({ error: 'Order not found!' });

    return res.status(200).json(order);
  } catch (error) {
    console.error('Error occurred while fetching the order:', (error as Error).message);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

export const setOrder = async (req: Request, res: Response) => {
  try {
    const userId = req?.userId;
    const { productId, quantity } = req?.body;

    const product = await productModel.findOne({ _id: productId });
    if (!product) return res.status(500).json({ error: 'Product not found!' });

    if (product.quantity < quantity || quantity < 0)
      return res.status(400).json({ error: 'Product quantity insufficient!' });

    const oldOrder = await orderModel.findOne({ userId, productId });
    if (oldOrder) {
      const qnt = quantity + oldOrder.quantity;
      if (qnt > product.quantity)
        return res.status(400).json({ error: 'Product quantity insufficient!' });

      await orderModel.findOneAndUpdate(
        { id: oldOrder._id },
        { quantity: qnt, totalPrice: qnt * product.price },
      );

      return res.status(200).json({ message: 'Product quantity updated.' });
    }

    const order = new orderModel({
      userId: userId,
      delivered: false,
      productId: productId,
      quantity: quantity,
      status: 'pending',
      totalPrice: quantity * product.price,
    });

    await order.save();

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error occurred through adding an order's process:", (error as Error).message);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { userId } = req;

    const quantity = req?.body?.quantity;

    if (quantity === 0) {
      const order = await orderModel.findOneAndDelete({ _id: orderId, userId: userId });
      if (!order) return res.status(404).json({ error: 'Order not found!' });
      return res.status(200).json({ message: 'Order removed.' });
    }

    const order = await orderModel.findOneAndUpdate(
      { userId: userId, _id: orderId },
      { quantity: quantity },
      { new: true },
    );
    if (!order) return res.status(404).json({ error: 'Order not found!' });

    return res.status(200).json(order);
  } catch (error) {
    console.error('Error occurred through order update:', (error as Error).message);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};
