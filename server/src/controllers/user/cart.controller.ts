import { Request, Response } from 'express';
import { CartItem } from '../../types/cart.item.type';
import cartModel from '../../models/cart.model';

/**
 * Synchronizes cart items from client to server (replaces entire cart).
 *
 * @param req.userId - Authenticated user's ID (from middleware)
 * @param req.body - Array of cart items to sync
 *
 * @returns 200 - Cart synchronized with operation counts
 * @returns 500 - Server error
 *
 * Process:
 * 1. Deletes all existing unconfirmed cart items for the user
 * 2. Upserts new cart items (updates existing or inserts new)
 * 3. Returns counts of inserted and updated items
 *
 * Response includes:
 * - message: Operation status
 * - inserted: Number of new items added
 * - update: Number of existing items modified
 *
 * Note: Only affects unconfirmed cart items. Confirmed items (orders) remain untouched.
 *
 * @example
 * POST /cart/sync
 * Body: [{ productId: "...", orderQuantity: 2, productName: "...", ... }]
 * Response: { message: "Cart items uploaded", inserted: 3, update: 1 }
 */
export const setCart = async (req: Request, res: Response) => {
  try {
    const userId = req?.userId;
    const cartItems: CartItem[] = req?.body;

    await cartModel.deleteMany({ userId: userId, confirmed: false });

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({
        message: 'Cart cleared',
        inserted: 0,
      });
    }

    const bulkOperations = cartItems.map((item) => ({
      updateOne: {
        filter: {
          userId: userId,
          productId: item?.productId,
          confirmed: false,
        },
        update: {
          $set: {
            orderQuantity: item?.orderQuantity,
            productImages: item?.productImages,
            productName: item?.productName,
            productPrice: item?.productPrice,
          },
        },
        upsert: true,
      },
    }));

    const result = await cartModel.bulkWrite(bulkOperations);

    return res.status(200).json({
      message: 'Cart items uploaded',
      inserted: result.upsertedCount,
      update: result.modifiedCount,
    });
  } catch (error) {
    console.error('Error occurred during posting cart items:', error);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

/**
 * Retrieves all unconfirmed cart items for the authenticated user.
 *
 * @param req.userId - Authenticated user's ID (from middleware)
 *
 * @returns 200 - Array of cart items
 * @returns 404 - No cart items found
 * @returns 500 - Server error
 *
 * Returns only unconfirmed items (items not yet checked out).
 * Confirmed items are considered completed orders and excluded.
 *
 * @example
 * GET /cart
 * Response: [{ productId: "...", orderQuantity: 2, productName: "...", confirmed: false, ... }]
 */
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req?.userId;

    const cart = await cartModel.find({ userId: userId, confirmed: false });
    if (!cart) return res.status(404).json({ error: 'Not cart items found!' });

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error occurred during getting cart items:', error);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

/**
 * Deletes a specific unconfirmed cart item.
 *
 * @param req.userId - Authenticated user's ID (from middleware)
 * @param req.params.itemId - Cart item's MongoDB _id to delete
 *
 * @returns 200 - Item successfully deleted
 * @returns 404 - Cart item not found or already confirmed
 * @returns 500 - Server error
 *
 * Note: Only deletes unconfirmed items. Confirmed items (orders) cannot be deleted.
 *
 * @example
 * DELETE /cart/507f1f77bcf86cd799439011
 * Response: { message: "Cart item deleted" }
 */
export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req?.userId;
    const itemId = req?.params?.itemId;

    const deleted = await cartModel.findOneAndDelete({
      userId: userId,
      _id: itemId,
      confirmed: false,
    });
    if (!deleted) return res.status(404).json({ error: 'Cart item not found!' });

    return res.status(200).json({ message: 'Cart item deleted' });
  } catch (error) {
    console.error('Error occurred when requested to delete a cart item:', error);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

/**
 * Retrieves a specific unconfirmed cart item by ID.
 *
 * @param req.userId - Authenticated user's ID (from middleware)
 * @param req.params.itemId - Cart item's MongoDB _id to retrieve
 *
 * @returns 200 - Cart item object
 * @returns 404 - Cart item not found or already confirmed
 * @returns 500 - Server error
 *
 * Note: Only retrieves unconfirmed items. Confirmed items (orders) are not accessible.
 *
 * @example
 * GET /cart/507f1f77bcf86cd799439011
 * Response: { _id: "...", productId: "...", orderQuantity: 2, confirmed: false, ... }
 */
export const getCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req?.userId;
    const itemId = req?.params?.itemId;

    const item = await cartModel.findOne({ userId: userId, _id: itemId, confirmed: false });
    if (!item) return res.status(404).json({ error: 'Cart item not found!' });

    return res.status(200).json(item);
  } catch (error) {
    console.error('Error occurred during updating a cart item:', error);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

/**
 * Updates the quantity of a specific unconfirmed cart item.
 *
 * @param req.userId - Authenticated user's ID (from middleware)
 * @param req.params.itemId - Cart item's MongoDB _id to update
 * @param req.body - Cart item object containing orderQuantity
 *
 * @returns 200 - Item successfully updated
 * @returns 404 - Cart item not found or already confirmed
 * @returns 500 - Server error
 *
 * Note: Only updates the order quantity. Other fields remain unchanged.
 * Only affects unconfirmed items. Confirmed items (orders) cannot be updated.
 *
 * @example
 * PUT /cart/507f1f77bcf86cd799439011
 * Body: { orderQuantity: 5 }
 * Response: { message: "Cart item updated." }
 */
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req?.userId;
    const itemId = req?.params?.itemId;
    const item: CartItem = req?.body;

    const updated = await cartModel.findOneAndUpdate(
      { userId: userId, _id: itemId, confirmed: false },
      {
        ordersQuantity: item?.orderQuantity,
      },
    );

    if (!updated) return res.status(404).json({ error: 'Cart item not found!' });

    return res.status(200).json({ message: 'Cart item updated.' });
  } catch (error) {
    console.error('Error occurred while updating a cart item:', error);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

/**
 * Deletes all unconfirmed cart items for the authenticated user.
 *
 * @param req.userId - Authenticated user's ID (from middleware)
 *
 * @returns 200 - Cart successfully cleared
 * @returns 404 - No cart items found to delete
 * @returns 500 - Server error
 *
 * Note: Only removes unconfirmed items. Confirmed items (orders) remain untouched.
 * This operation cannot be undone.
 *
 * @example
 * DELETE /cart/clear
 * Response: { message: "Cart cleared" }
 */
export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req?.userId;

    const result = await cartModel.deleteMany({ userId: userId, confirmed: false });
    if (!result) return res.status(404).json({ error: 'Cart items are not found!' });

    return res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error!' });
  }
};
