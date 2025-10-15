import { Router } from 'express';
import {
  fetchOrdersValidator,
  fetchOrderValidator,
  fetchUserOrdersValidator,
  updateOrderValidator,
} from '../../validators/order.validator';
import { validateRequest } from '../../middleware/validation.middleware';
import {
  deleteOrder,
  getOrders,
  getUserOrders,
  updateOrder,
} from '../../controllers/admin/order.controller';
import { checkRole } from '../../middleware/auth.middleware';
import { getOrder } from '../../controllers/admin/order.controller';

const router = Router();

/**
 * Route to fetch a user orders, permitted to [admin] only
 * @path /api/admin/orders/user/:userId
 * @method GET
 */
router.get(
  '/user/:userId',
  checkRole(['admin']),
  fetchUserOrdersValidator,
  validateRequest,
  getUserOrders,
);

/**
 * Route to fetch all orders, permitted to [admin] only
 * @path /api/admin/orders
 * @method GET
 */
router.get('/', checkRole(['admin']), fetchOrdersValidator, validateRequest, getOrders);

/**
 * Route to fetch and order, permitted to [admin, user]
 * @path /api/admin/orders/:orderId
 * @method GET
 */
router.get('/:orderId', checkRole(['admin']), fetchOrderValidator, validateRequest, getOrder);

/**
 * Route to update an order, permitted to [admin]
 * @path /api/admin/orders/:orderId
 * @method PATCH
 */
router.patch('/:orderId', checkRole(['admin']), updateOrderValidator, validateRequest, updateOrder);

/**
 * Route to delete an order, permitted to [admin,]
 * @path /api/admin/orders/:orderId
 * @method DELETE
 */
router.delete('/:orderId', checkRole(['admin']), fetchOrderValidator, validateRequest, deleteOrder);

export default router;
