import { Router } from 'express';
import { checkRole } from '../../middleware/auth.middleware';
import { calculateItems, checkoutItems } from '../../controllers/user/checkout.controller';
import { validateCalculation, validateCheckout } from '../../validators/user/checkout.validator';
import { validateRequest } from '../../middleware/validation.middleware';

const router = Router();

router.get('/calculate', checkRole(['user']), validateCalculation, validateRequest, calculateItems);

router.post('/confirm', checkRole(['user']), checkoutItems);

export default router;
