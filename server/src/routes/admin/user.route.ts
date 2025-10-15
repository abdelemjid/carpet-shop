import { Router } from 'express';
import { checkRole } from '../../middleware/auth.middleware';
import { banUser, deleteUser, getUser, getUsers } from '../../controllers/admin/user.controller';

const router = Router();

// fetch all users except admins
router.get('/', checkRole(['admin']), getUsers);
router.get('/:userId', checkRole(['admin', 'user']), getUser);
router.put('/ban/:userId', checkRole(['admin']), banUser);
router.delete('/:userId', checkRole(['admin']), deleteUser);

export default router;
