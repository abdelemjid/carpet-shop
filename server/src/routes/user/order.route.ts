import { Router } from 'express';
import { checkRole } from '../../middleware/auth.middleware';
import {
  getMyOrders,
  getOrder,
  setOrder,
  updateOrder,
} from '../../controllers/user/order.controller';
import {
  fetchOrdersValidator,
  fetchOrderValidator,
  postOrderValidator,
  updateOrderValidator,
} from '../../validators/order.validator';
import { validateRequest } from '../../middleware/validation.middleware';

const router = Router();

/**
 * Route to fetch orders, permitted to [user]
 * @path /api/orders
 * @method GET
 */
router.get('/', checkRole(['user']), fetchOrdersValidator, validateRequest, getMyOrders);

/**
 * Route to fetch and order, permitted to [user]
 * @path /api/orders/:orderId
 * @method GET
 */
router.get('/:orderId', checkRole(['user']), fetchOrderValidator, validateRequest, getOrder);

/**
 * Route to post an order, permitted to [user]
 * @path /api/orders
 * @method POST
 */
router.post('/', checkRole(['user']), postOrderValidator, validateRequest, setOrder);

/**
 * Route to update an order, permitted to [user]
 * @path /api/orders/:orderId
 * @method PATCH
 */
router.patch('/:orderId', checkRole(['user']), updateOrderValidator, validateRequest, updateOrder);

export default router;
