import { Router } from 'express';
import { allProducts, getProduct } from '../controllers/product.controller';

const router = Router();

router.get('/', allProducts);
router.get('/:productId', getProduct);
//router.get('/search', checkRole(['admin', 'user']));

export default router;
