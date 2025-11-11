import { param, query } from 'express-validator';

export const fetchProductValidator = [
  param('productId').isMongoId().withMessage('invalid Product ID!'),
];

export const fetchProductsValidator = [
  query('page').optional().isInt({ gt: 0 }).withMessage('invalid page number!'),
  query('query')
    .optional()
    .isString()
    .isLength({ min: 3, max: 35 })
    .withMessage('invalid search query!'),
  query('date').optional().isIn(['week', 'month', 'year']).withMessage('invalid Date filter!'),
  query('quantity').optional().isInt({ min: 1, max: 9999 }).withMessage('invalid quantity!'),
  query('category').optional().isIn(['s', 'm', 'l']).withMessage('invalid category!'),
];
