import { Router } from 'express';
import { checkRole } from '../../middleware/auth.middleware';
import {
  banUser,
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from '../../controllers/admin/user.controller';
import {
  validateCreateNewUser,
  validateFetchUsers,
  validateUpdateUser,
} from '../../validators/user.validator';
import { validateRequest } from '../../middleware/validation.middleware';

const router = Router();

// fetch all users except admins
router.get('/', checkRole(['admin']), validateFetchUsers, validateRequest, getUsers);
router.get('/:userId', checkRole(['admin', 'user']), getUser);
router.put('/:userId', checkRole(['admin']), validateUpdateUser, validateRequest, updateUser);
router.put('/ban/:userId', checkRole(['admin']), banUser);
router.delete('/:userId', checkRole(['admin']), deleteUser);
router.post('/new', checkRole(['admin']), validateCreateNewUser, validateRequest, createUser);

export default router;
