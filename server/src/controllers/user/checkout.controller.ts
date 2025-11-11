import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import cartModel from '../../models/cart.model';
import productModel from '../../models/product.model';
import { CheckoutResponse } from '../../types/checkout.type';
import { CartItem } from '../../types/cart.item.type';
import orderModel from '../../models/order.model';
import { Order } from '../../types/order.type';

/**
 * Calculates totals and validates stock availability for selected cart items.
 *
 * @param req.query.id - Product ID(s) to calculate (single string or array)
 * @param req.userId - Authenticated user's ID (from middleware)
 *
 * @returns 200 - Calculation summary with totals and stock issues
 * @returns 400 - No product IDs provided
 * @returns 404 - Cart items not found
 * @returns 500 - Server error
 *
 * Response includes:
 * - totalItems: Sum of all item quantities
 * - totalPrice: Total cost of all items
 * - insufficientStock: Array of products with stock issues
 * - notFoundProducts: Array of products no longer available
 *
 * Note: Only valid items (sufficient stock + available) are included in totals.
 *
 * @example
 * GET /calculate?id=507f1f77bcf86cd799439011
 * Response: { totalItems: 3, totalPrice: 150.00, insufficientStock: [], notFoundProducts: [] }
 */
export const calculateItems = async (req: Request, res: Response) => {
  try {
    const userId = req?.userId;
    const ids = req?.query?.id;
    const itemIds = Array.isArray(ids) ? ids : ids ? [ids] : [];

    if (!itemIds || itemIds.length === 0) {
      return res.status(400).json({ error: 'Bad request!' });
    }

    const objectIds = itemIds.map((id) => new mongoose.Types.ObjectId(id as string));

    const cartItems = await cartModel.find({
      productId: { $in: objectIds },
      userId: new mongoose.Types.ObjectId(userId),
      confirmed: false,
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ error: 'Cart items not found!' });
    }

    const productIds = cartItems.map((item) => item.productId);
    const products = await productModel.find({ _id: { $in: productIds } });

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const insufficientStock: string[] = [];
    const notFoundInStock: string[] = [];
    const removeProducts: CartItem[] = [];
    for (const item of cartItems) {
      const product = productMap.get(item.productId.toString());
      // find the removed products
      if (!product) {
        notFoundInStock.push(`${item.productName} not found!`);
        removeProducts.push(item);
      }
      // find the insufficient product stock
      if (product && product.quantity < item.orderQuantity) {
        insufficientStock.push(
          `${item.productName} (available: ${product.quantity}, requested: ${item.orderQuantity})`,
        );
        removeProducts.push(item);
      }
    }

    // clear cart from insufficient ot not found products
    const cleanCartItems = cartItems.filter((item) => !removeProducts.includes(item));

    // calculate totals
    const { totalPrice, totalItems } = cleanCartItems.reduce(
      (acc, item) => ({
        totalPrice: acc.totalPrice + item.productPrice * item.orderQuantity,
        totalItems: acc.totalItems + item.orderQuantity,
      }),
      { totalPrice: 0, totalItems: 0 },
    );

    const response: CheckoutResponse = {
      totalItems: totalItems,
      totalPrice: totalPrice,
      insufficientStock: insufficientStock,
      notFoundProducts: notFoundInStock,
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

/**
 * Checks out selected cart items and creates orders.
 *
 * @param req.query.id - Product ID(s) to checkout (single string or array)
 * @param req.userId - Authenticated user's ID (from middleware)
 * @param req.body - Shipping information (fullname, email, phoneNumber, city, address)
 *
 * @returns 200 - Successfully created orders with confirmed product IDs
 * @returns 400 - No product IDs provided
 * @returns 404 - Cart items not found
 * @returns 500 - Server error or failed order insertion
 *
 * Process:
 * 1. Validates cart items exist and aren't already confirmed
 * 2. Removes items with insufficient stock or missing products
 * 3. Creates orders from valid cart items
 * 4. Updates product quantities (decrements stock)
 * 5. Marks cart items as confirmed
 *
 * @example
 * POST /checkout?id=507f1f77bcf86cd799439011&id=507f1f77bcf86cd799439012
 * Body: { fullname: "John Doe", email: "john@example.com", ... }
 */
export const checkoutItems = async (req: Request, res: Response) => {
  try {
    const userId = req?.userId;
    const params = req?.query?.id;
    const ids = Array.isArray(params) ? params : params ? [params] : [];
    const formData = req?.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({ error: 'Bad request!' });
    }

    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id as string));
    const cartItems = await cartModel.find({
      productId: { $in: objectIds },
      userId: new mongoose.Types.ObjectId(userId),
      confirmed: false,
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ error: 'Cart items not found!' });
    }

    const productIds = cartItems.map((item) => item.productId);
    const products = await productModel.find({ _id: { $in: productIds } });

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));
    const removeProducts: CartItem[] = [];

    for (const item of cartItems) {
      const product = productMap.get(item.productId.toString());
      // find the removed products
      if (!product) removeProducts.push(item);
      // find the insufficient product stock
      if (product && product.quantity < item.orderQuantity) removeProducts.push(item);
    }

    // clear cart from insufficient ot not found products
    const cleanCartItems = cartItems.filter((item) => !removeProducts.includes(item));

    // calculate totals & insert order
    const orders: Order[] = [];
    const updateProducts: {
      updateOne: {
        filter: { _id: string };
        update: { $inc: { quantity: number } };
      };
    }[] = [];

    for (const item of cleanCartItems) {
      const product = await productModel.findOne({
        _id: item.productId,
      });

      if (product) {
        // orders
        orders.push({
          fullname: formData?.fullname,
          email: formData?.email,
          phoneNumber: formData?.phoneNumber,
          city: formData?.city,
          shippingAddress: formData?.address,
          delivered: false,
          quantity: item.orderQuantity,
          status: 'pending',
          userId: new Types.ObjectId(userId),
          productId: new Types.ObjectId(product._id),
          totalPrice: item.orderQuantity * product.price,
        });

        // update products
        updateProducts.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $inc: { quantity: item.orderQuantity * -1 } },
          },
        });
      }
    }

    // bulk insert orders
    const ordersResult = await orderModel.insertMany(orders);
    if (!ordersResult) return res.status(500).json({ error: "Your operation did't completed!" });

    // delete orders from cart items
    const itemIds = orders.map((item) => item.productId);
    await cartModel.updateMany(
      { userId: userId, productId: { $in: itemIds }, confirmed: false },
      { confirmed: true },
    );

    // decrement product's quantity
    await productModel.bulkWrite(updateProducts);

    return res
      .status(200)
      .json({ message: 'Your ordering operation is done.', confirmed: itemIds });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error!' });
  }
};
