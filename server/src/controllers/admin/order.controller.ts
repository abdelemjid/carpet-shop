import { Request, Response } from 'express';
import { FetchingOrdersConfig } from '../../config/fetching';
import orderModel from '../../models/order.model';
import { Order, OrdersResponse } from '../../types/order.type';
import { constructorOrdersFilter, OrdersSearchQuery } from '../../filters/admin/orders.filter';

/**
 * Retrieves a paginated list of orders for a specific user.
 *
 * @param req.params.userId - ID of the user whose orders are being fetched
 * @param req.query.page - Current page number for pagination (optional)
 *
 * @returns 200 - Successfully retrieved user's orders with pagination data
 * @returns 500 - Server error while fetching orders
 *
 * Process:
 * 1. Extracts userId from request parameters
 * 2. Parses and validates pagination parameters (page, limit)
 * 3. Calculates skip value for MongoDB query
 * 4. Fetches orders and total count concurrently using Promise.all
 * 5. Builds and returns structured response with pagination metadata
 *
 * Pagination:
 * - limit: 15 (minimum)
 * - page: defaults to FetchingOrdersConfig.page
 * - hasNext: true if more pages exist
 * - hasPrev: true if not on the first page
 *
 * @example
 * GET /users/64f0a9e3/orders?page=2
 * Response: {
 *   orders: [ ... ],
 *   pagination: { page: 2, pages: 5, total: 72, hasNext: true, hasPrev: true }
 * }
 */

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const page = Number(req?.query?.page as string) || FetchingOrdersConfig.page;
    const limit = Math.max(FetchingOrdersConfig.limit, 15);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      orderModel.find({ userId: userId }).skip(skip).limit(limit).lean<Order[]>(),
      orderModel.countDocuments({ userId: userId }),
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
 * Retrieves all orders with optional filtering and pagination.
 *
 * @param req.query - Query parameters for filtering and pagination
 * @param req.query.page - Current page number (optional)
 * @param req.query.status - Filter by order status (optional)
 * @param req.query.userId - Filter by user ID (optional)
 *
 * @returns 200 - Successfully retrieved filtered orders with pagination details
 * @returns 500 - Server error while fetching orders
 *
 * Process:
 * 1. Constructs MongoDB filter using constructorOrdersFilter
 * 2. Parses pagination parameters (page, limit) and calculates skip
 * 3. Executes parallel queries for orders and total count
 * 4. Builds response with orders and pagination metadata
 *
 * Pagination:
 * - limit: 15 (minimum)
 * - page: defaults to FetchingOrdersConfig.page
 * - hasNext: true if additional pages exist
 * - hasPrev: true if current page > 1
 *
 * @example
 * GET /orders?page=1&status=delivered
 * Response: {
 *   orders: [ ... ],
 *   pagination: { page: 1, pages: 3, total: 45, hasNext: true, hasPrev: false }
 * }
 */
export const getOrders = async (req: Request, res: Response) => {
  try {
    const query: OrdersSearchQuery = req?.query ? constructorOrdersFilter(req.query) : {};

    const page = Number(req?.query?.page as string) || FetchingOrdersConfig.page;
    const limit = FetchingOrdersConfig.limit;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      orderModel.find(query).skip(skip).limit(limit).lean<Order[]>(),
      orderModel.countDocuments(query),
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

/**
 * Retrieves a specific order by its ID.
 *
 * @param req.params.orderId - Unique identifier of the order
 *
 * @returns 200 - Successfully retrieved order details
 * @returns 404 - Order not found
 * @returns 500 - Server error while fetching the order
 *
 * Process:
 * 1. Extracts orderId from request parameters
 * 2. Queries database for matching order
 * 3. Returns order if found, otherwise responds with 404
 *
 * @example
 * GET /orders/6741b2f6e29b3a0d12e48b9f
 * Response: {
 *   _id: "6741b2f6e29b3a0d12e48b9f",
 *   userId: "64f0a9e3a7b2d4f1c29e...",
 *   items: [ ... ],
 *   total: 59.99,
 *   status: "processing"
 * }
 */
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

/**
 * Updates an existing order's status, quantity, delivery state, or refusal reason.
 *
 * @param req.params.orderId - Unique identifier of the order to update
 * @param req.body.status - Updated order status ('pending', 'prepared', 'refused', 'sent', 'delivered')
 * @param req.body.delivered - Boolean indicating delivery completion (optional)
 * @param req.body.quantity - Updated quantity (number >= 0)
 * @param req.body.refuseReason - Reason for refusal (optional)
 *
 * @returns 200 - Order successfully updated or removed if quantity is 0
 * @returns 404 - Order not found
 * @returns 500 - Server error during update process
 *
 * Process:
 * 1. Extracts orderId and relevant fields from request
 * 2. Validates and constructs the update object
 * 3. If quantity equals 0, deletes the order
 * 4. Otherwise updates order fields and returns updated order
 * 5. Ensures delivery flag syncs with status
 *
 * Status rules:
 * - 'delivered' → delivered = true
 * - all others → delivered = false
 *
 * @example
 * PATCH /orders/6741b2f6e29b3a0d12e48b9f
 * Body: { status: "delivered", quantity: 3 }
 * Response: {
 *   _id: "6741b2f6e29b3a0d12e48b9f",
 *   status: "delivered",
 *   delivered: true,
 *   quantity: 3
 * }
 */
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

/**
 * Deletes an order by its unique identifier.
 *
 * @param req.params.orderId - Unique ID of the order to delete
 *
 * @returns 200 - Order deleted successfully
 * @returns 404 - Order not found
 * @returns 500 - Server error during deletion
 *
 * Process:
 * 1. Extracts orderId from request parameters
 * 2. Attempts to delete the order using findOneAndDelete
 * 3. Returns success message if found and deleted
 * 4. Returns 404 if no matching order exists
 *
 * @example
 * DELETE /orders/6741b2f6e29b3a0d12e48b9f
 * Response: { message: "Order deleted successfully." }
 */
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
