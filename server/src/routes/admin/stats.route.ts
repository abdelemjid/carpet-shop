import { Router } from 'express';
import { checkRole } from '../../middleware/auth.middleware';
import { getDailyStats, getStatistics } from '../../controllers/admin/stats.controller';

const router = Router();

router.get('/', checkRole(['admin']), getStatistics);
router.get('/daily', checkRole(['admin']), getDailyStats);

export default router;
