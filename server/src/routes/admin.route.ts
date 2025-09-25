import { Router } from 'express';
import multer from 'multer';
import { checkRole } from '../middleware/auth.middleware';
import { deleteProduct, newProduct, updateProduct } from '../controllers/product.controller';
import { body } from 'express-validator';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// product routes
router.post(
  '/products/new',
  checkRole(['admin']),
  upload.array('images', 8),
  [
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
  ],
  newProduct,
);
router.put('/products/update/:productId', checkRole(['admin']), updateProduct);
router.delete('/products/delete/:productId', checkRole(['admin']), deleteProduct);

// order routes

export default router;
