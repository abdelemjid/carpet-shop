import { body, param, query } from 'express-validator';

export const validateFetchUsers = [
  query('page').optional().isInt({ gt: 0 }).withMessage('invalid page value!'),
  query('joinDateFrom').optional().isDate().withMessage('invalid Joining Date From value!'),
  query('joinDateTo').optional().isDate().withMessage('invalid Joining Date To value!'),
  query('banned').optional().isBoolean().withMessage('invalid banned value!'),
  query('role').optional().isIn(['admin', 'user', 'manager']).withMessage('invalid role value!'),
];

export const validateCreateNewUser = [
  body('username')
    .isString()
    .withMessage('invalid username value!')
    .isLength({ min: 3, max: 30 })
    .withMessage('username must contains 3 to 30 characters'),
  body('email').isEmail().withMessage('invalid email value!'),
  body('password')
    .isLength({ min: 8, max: 30 })
    .withMessage('password must contains 8 to 30 characters!'),
  body('role').isIn(['admin', 'manager', 'user']).withMessage("invalid user's role!"),
];

export const validateUpdateUser = [
  param('userId').isMongoId().withMessage('invalid user ID value!'),
  body('role').optional().isIn(['admin', 'user', 'manager']).withMessage('invalid role value!'),
  body('banned').optional().isBoolean().withMessage('invalid banned value!'),
  body('username')
    .optional()
    .isString()
    .withMessage('invalid username')
    .isLength({ min: 3, max: 30 })
    .withMessage('username length is not acceptable!'),
  body('email').optional().isEmail().withMessage('invalid email!'),
  body('password').optional().isLength({ min: 8, max: 30 }).withMessage('invalid password length!'),
];
