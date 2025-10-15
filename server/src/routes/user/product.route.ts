import { Router } from 'express';
import { allProducts, getProduct } from '../../controllers/user/product.controller';

const router = Router();

router.get('/', allProducts);

router.get('/:productId', getProduct);

export default router;
