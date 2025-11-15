import { Request, Response } from 'express';
import orderModel from '../../models/order.model';
import { FetchingOrdersConfig } from '../../config/fetching';
import { Order, OrdersResponse, RespOrder } from '../../types/order.type';
import productModel from '../../models/product.model';
import { Types } from 'mongoose';

/**
 * Retrieves paginated orders for the authenticated user with product details.
 *
 * @param req.userId - Authenticated user's ID (from middleware)
 * @param req.query.page - Page number (default: from FetchingOrdersConfig, min: 1)
 *
 * @returns 200 - Paginated orders with product information and pagination metadata
 * @returns 401 - User not authenticated
 * @returns 500 - Server error
 *
 * Response includes:
 * - orders: Array of order objects with embedded product details (name, images)
 * - pagination: { page, pages, total, hasNext, hasPrev }
 *
 * Orders are sorted by creation date (newest first).
 * Limit is set to max(15, FetchingOrdersConfig.limit) items per page.
 *
 * @example
 * GET /orders?page=2
 * Response: {
 *   orders: [{ _id: "...", totalPrice: 150, productDetails: { name: "...", images: [...] }, ... }],
 *   pagination: { page: 2, pages: 5, total: 73, hasNext: true, hasPrev: true }
 * }
 */
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = req?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized!' });

    const page = Number(req?.query?.page) || FetchingOrdersConfig.page;
    const limit = Math.max(FetchingOrdersConfig.limit, 5);
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

/**
 * Retrieves a specific order by ID for the authenticated user.
 *
 * @param req.userId - Authenticated user's ID (from middleware)
 * @param req.params.orderId - Order's MongoDB _id to retrieve
 *
 * @returns 200 - Order object
 * @returns 404 - Order not found or doesn't belong to user
 * @returns 500 - Server error
 *
 * Note: Users can only access their own orders. Orders belonging to other users return 404.
 *
 * @example
 * GET /orders/507f1f77bcf86cd799439011
 * Response: { _id: "...", userId: "...", productId: "...", totalPrice: 150, status: "pending", ... }
 */
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

/**
 * Creates a new order or updates quantity of an existing order for a product.
 *
 * @param req.userId - Authenticated user's ID (from middleware)
 * @param req.body.productId - Product's MongoDB _id to order
 * @param req.body.quantity - Quantity to order (must be positive)
 *
 * @returns 200 - Order created/updated successfully
 * @returns 400 - Insufficient product stock or invalid quantity
 * @returns 500 - Product not found or server error
 *
 * Process:
 * 1. Validates product exists and has sufficient stock
 * 2. If user has existing order for product, adds to existing quantity
 * 3. If no existing order, creates new order with "pending" status
 * 4. Calculates totalPrice based on product price and quantity
 *
 * Note: Does not decrement product stock. Stock is managed during checkout.
 *
 * @example
 * POST /orders
 * Body: { productId: "507f1f77bcf86cd799439011", quantity: 3 }
 * Response: { _id: "...", userId: "...", productId: "...", quantity: 3, totalPrice: 150, status: "pending", ... }
 */
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

/**
 * Updates the quantity of an existing order or deletes it if quantity is zero.
 *
 * @param req.userId - Authenticated user's ID (from middleware)
 * @param req.params.orderId - Order's MongoDB _id to update
 * @param req.body.quantity - New quantity (0 to delete order)
 *
 * @returns 200 - Order updated/deleted successfully with updated order object or deletion message
 * @returns 404 - Order not found or doesn't belong to user
 * @returns 500 - Server error
 *
 * Special behavior:
 * - If quantity is 0, the order is deleted instead of updated
 * - Users can only update their own orders
 *
 * Note: Does not validate against product stock or recalculate totalPrice.
 *
 * @example
 * PUT /orders/507f1f77bcf86cd799439011
 * Body: { quantity: 5 }
 * Response: { _id: "...", userId: "...", quantity: 5, totalPrice: 150, ... }
 *
 * @example
 * PUT /orders/507f1f77bcf86cd799439011
 * Body: { quantity: 0 }
 * Response: { message: "Order removed." }
 */
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
