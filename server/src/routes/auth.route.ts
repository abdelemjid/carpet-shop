import { Router } from 'express';
import { registerUser } from '../controllers/register.controller';
import { body } from 'express-validator';
import { loginUser } from '../controllers/login.controller';
import { getUser } from '../controllers/user.controller';
import { verifyToken } from '../middleware/auth.middleware';

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

export default router;
