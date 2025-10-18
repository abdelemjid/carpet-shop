import { Router } from 'express';
import { body } from 'express-validator';
import { verifyToken } from '../../middleware/auth.middleware';
import { loginUser, logout, registerUser } from '../../controllers/auth/auth.controller';
import { getUser } from '../../controllers/user/user.controller';

const router = Router();

// POST method for Registration
router.post(
  '/register',
  [
    body('username')
      .trim()
      .isLength({ min: 4 })
      .withMessage('Invalid username, it must be at least 4 characters'),
    body('email').isEmail().withMessage('Invalid Email. Please enter a valid Email and try again'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Invalid Password. Password must contains at least 8 characters!'),
  ],
  registerUser,
);

// POST method for Login
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid credentials! Please check your Email, Password and try again.'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Invalid credentials! Please check your Email, Password and try again.'),
  ],
  loginUser,
);

// GET method for verifying authentication's token
router.get('/verify-token', verifyToken, getUser);

router.get('/logout', verifyToken, logout);

export default router;
