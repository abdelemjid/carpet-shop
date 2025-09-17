import { Router } from 'express';
import { checkRole } from '../middleware/auth.middleware';
import { deleteProduct, newProduct, updateProduct } from '../controllers/product.controller';

const router = Router();

// product routes
router.post('/products/new', checkRole(['admin']), newProduct);
router.put('/products/update/:productId', checkRole(['admin']), updateProduct);
router.delete('/products/delete/:productId', checkRole(['admin']), deleteProduct);

// order routes

export default router;
