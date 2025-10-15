import { body, param, query } from 'express-validator';

export const newProductValidator = [
  body('name').isString().notEmpty().withMessage('Product name is required!'),
  body('description').isString().notEmpty().withMessage('Product description is required!'),
  body('price')
    .isInt({ min: 1 })
    .withMessage('Product price must be a Number!')
    .notEmpty()
    .withMessage('Product price is required!'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Product quantity must be a Number!')
    .notEmpty()
    .withMessage('Product quantity is required!'),
  body('width')
    .isInt({ min: 1 })
    .withMessage('Product width must be a Number!')
    .notEmpty()
    .withMessage('Product width is required!'),
  body('height')
    .isInt({ min: 1 })
    .withMessage('Product height must be a Number!')
    .notEmpty()
    .withMessage('Product height is required!'),
  body('category').isString().withMessage('Product category invalid!'),
];

export const updateProductValidator = [
  body('name')
    .isString()
    .withMessage('Product name is not valid!')
    .notEmpty()
    .withMessage('Product name is required!'),
  body('description')
    .isString()
    .withMessage('Description is not valid!')
    .notEmpty()
    .withMessage('Product description is required!'),
  body('price')
    .isInt({ min: 1 })
    .withMessage('Product price must be a Number!')
    .notEmpty()
    .withMessage('Product price is required!'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Product quantity must be a Number!')
    .notEmpty()
    .withMessage('Product quantity is required!'),
  body('width')
    .isInt({ min: 1 })
    .withMessage('Product width must be a Number!')
    .notEmpty()
    .withMessage('Product width is required!'),
  body('height')
    .isInt({ min: 1 })
    .withMessage('Product height must be a Number!')
    .notEmpty()
    .withMessage('Product height is required!'),
  body('category')
    .isString()
    .withMessage('Category is not valid!')
    .withMessage('Product category invalid!'),
];

export const fetchProductValidator = [
  param('productId').isMongoId().withMessage('invalid Product ID!'),
];

export const fetchProductsValidator = [
  query('page').optional().isInt({ gt: 0 }).withMessage('invalid page number!'),
  query('fromDate').optional().isDate().withMessage('invalid From Date filter!'),
  query('toDate').optional().isDate().withMessage('invalid To Date filter!'),
  query('fromQuantity').optional().isInt({ min: -1, max: 9999 }).withMessage('invalid quantity!'),
  query('toQuantity').optional().isInt({ min: -1, max: 9999 }).withMessage('invalid quantity!'),
  query('category').optional().isIn(['default', 's', 'm', 'l']).withMessage('invalid category!'),
];
