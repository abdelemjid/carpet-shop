import { Router } from 'express';
import multer from 'multer';
import { checkRole } from '../../middleware/auth.middleware';
import {
  deleteProduct,
  newProduct,
  updateProduct,
} from '../../controllers/admin/product.controller';
import {
  fetchProductsValidator,
  fetchProductValidator,
  newProductValidator,
  updateProductValidator,
} from '../../validators/product.validator';
import { validateRequest } from '../../middleware/validation.middleware';
import { allProducts, getProduct } from '../../controllers/user/product.controller';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.get('/', checkRole(['admin']), fetchProductsValidator, validateRequest, allProducts);

router.get('/:productId', checkRole(['admin']), fetchProductValidator, validateRequest, getProduct);

router.delete(
  '/:productId',
  checkRole(['admin']),
  fetchProductValidator,
  validateRequest,
  deleteProduct,
);

router.patch(
  '/:productId',
  checkRole(['admin']),
  upload.array('imageFiles', 8),
  updateProductValidator,
  validateRequest,
  updateProduct,
);

router.post(
  '/new',
  checkRole(['admin']),
  upload.array('imageFiles', 8),
  newProductValidator,
  validateRequest,
  newProduct,
);

export default router;
