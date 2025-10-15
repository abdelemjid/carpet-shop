import { body, param, query } from 'express-validator';

export const updateOrderValidator = [
  param('orderId').isMongoId().withMessage('invalid order ID!'),
  body('delivered').optional().isBoolean().withMessage('delivered must be a boolean!'),
  body('quantity').optional().isInt({ gt: 0 }).withMessage('quantity must be a positive integer!'),
  body('status')
    .optional()
    .isIn(['pending', 'prepared', 'refused', 'sent', 'delivered'])
    .withMessage('invalid status value!'),
  body('refuseReason')
    .optional()
    .isIn(['out of stock', 'product not included anymore', 'quantity is too much'])
    .withMessage('invalid refuse reason!'),
];

export const fetchOrdersValidator = [
  query('page').optional().isInt({ gt: 0 }),
  query('fromDate').optional().isDate().withMessage('invalid From Date!'),
  query('toDate').optional().isDate().withMessage('invalid To Date!'),
  query('quantityFrom')
    .optional()
    .isInt({ min: 0, max: 9999 })
    .withMessage('invalid From Quantity!'),
  query('quantityTo').optional().isInt({ min: 0, max: 9999 }).withMessage('invalid To Quantity!'),
  query('status')
    .optional()
    .isIn(['pending', 'prepared', 'refused', 'sent', 'delivered'])
    .withMessage('invalid status value!'),
];

export const fetchUserOrdersValidator = [
  param('userId').isMongoId().withMessage('invalid user ID!'),
  query('page').optional().isInt({ gt: 0 }),
];

export const fetchOrderValidator = [param('orderId').isMongoId().withMessage('invalid order ID!')];

export const postOrderValidator = [
  body('productId').isMongoId().withMessage('invalid product ID!'),
  body('quantity').isInt({ min: 0 }).withMessage('invalid quantity!'),
];
