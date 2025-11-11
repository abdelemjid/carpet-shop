import { Router } from 'express';
import { allProducts, getProduct } from '../../controllers/user/product.controller';
import { fetchProductValidator } from '../../validators/user/product.validator';
import { validateRequest } from '../../middleware/validation.middleware';
import { fetchProductsValidator } from '../../validators/product.validator';

const router = Router();

router.get('/', fetchProductsValidator, validateRequest, allProducts);

router.get('/:productId', fetchProductValidator, validateRequest, getProduct);

export default router;
