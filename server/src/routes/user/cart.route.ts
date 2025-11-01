import { Router } from 'express';
import { checkRole } from '../../middleware/auth.middleware';
import {
  clearCart,
  deleteCartItem,
  getCart,
  getCartItem,
  setCart,
  updateCartItem,
} from '../../controllers/user/cart.controller';

const router = Router();

router.post('/', checkRole(['user']), setCart);

router.get('/', checkRole(['user']), getCart);

router.get('/:itemId', checkRole(['user']), getCartItem);

router.patch('/:itemId', checkRole(['user']), updateCartItem);

router.delete('/:itemId', checkRole(['user']), deleteCartItem);

router.delete('/', checkRole(['user']), clearCart);

export default router;
