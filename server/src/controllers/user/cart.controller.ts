import { Request, Response } from 'express';
import { CartItem } from '../../types/cart.item.type';
import cartModel from '../../models/cart.model';

export const setCart = async (req: Request, res: Response) => {
  try {
    const userId = req?.userId;
    const cartItems: CartItem[] = req?.body;

    await cartModel.deleteMany({ userId: userId });

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

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req?.userId;

    const cart = await cartModel.find({ userId: userId });
    if (!cart) return res.status(404).json({ error: 'Not cart items found!' });

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error occurred during getting cart items:', error);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req?.userId;
    const itemId = req?.params?.itemId;

    const deleted = await cartModel.findOneAndDelete({ userId: userId, _id: itemId });
    if (!deleted) return res.status(404).json({ error: 'Cart item not found!' });

    return res.status(200).json({ message: 'Cart item deleted' });
  } catch (error) {
    console.error('Error occurred when requested to delete a cart item:', error);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

export const getCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req?.userId;
    const itemId = req?.params?.itemId;

    const item = await cartModel.findOne({ userId: userId, _id: itemId });
    if (!item) return res.status(404).json({ error: 'Cart item not found!' });

    return res.status(200).json(item);
  } catch (error) {
    console.error('Error occurred during updating a cart item:', error);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req?.userId;
    const itemId = req?.params?.itemId;
    const item: CartItem = req?.body;

    const updated = await cartModel.findOneAndUpdate(
      { userId: userId, _id: itemId },
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

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req?.userId;

    const result = await cartModel.deleteMany({ userId: userId });
    if (!result) return res.status(404).json({ error: 'Cart items are not found!' });

    return res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error!' });
  }
};
