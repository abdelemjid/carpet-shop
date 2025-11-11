import { body, query } from 'express-validator';

export const validateCheckout = [
  query('id').isMongoId().withMessage('Invalid Cart Item ID!'),
  body('fullname')
    .isString()
    .withMessage('Invalid Fullname Type!')
    .isLength({ min: 4, max: 30 })
    .withMessage('Invalid Fullname!'),
  body('email').optional().isEmail().withMessage('Invalid Email address!'),
  body('phoneNumber')
    .matches(/^\+[1-9]\d{6,14}$/)
    .withMessage('Invalid Phone number!'),
  body('city')
    .isString()
    .withMessage('Invalid City Type!')
    .isLength({ min: 3, max: 30 })
    .withMessage('Invalid City name!'),
  body('address').isString().isLength({ min: 5, max: 40 }).withMessage('Invalid Shipping address!'),
];

export const validateCalculation = [query('id').isMongoId().withMessage('Invalid Cart Item ID!')];
