import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../../models/user.model';
import { validationResult } from 'express-validator';

/**
 * Registers a new user account with email, username, and password.
 *
 * @param req.body.username - User's chosen username
 * @param req.body.email - User's email address (must be unique)
 * @param req.body.password - User's password (will be hashed)
 *
 * @returns 201 - Account created successfully with JWT token set in cookie
 * @returns 401 - Validation errors (invalid email/password format, etc.)
 * @returns 409 - Email already registered
 * @returns 500 - Server error or missing JWT_SECRET_KEY
 *
 * Process:
 * 1. Validates input using express-validator
 * 2. Checks if email already exists
 * 3. Hashes password with bcrypt (salt rounds: 10)
 * 4. Creates user with default role: "user"
 * 5. Generates JWT token (expires in 1 day)
 * 6. Sets httpOnly cookie with token
 *
 * Cookie settings:
 * - httpOnly: true (prevents XSS attacks)
 * - secure: true in production (HTTPS only)
 * - maxAge: 24 hours
 *
 * @example
 * POST /auth/register
 * Body: { username: "john_doe", email: "john@example.com", password: "SecurePass123!" }
 * Response: { message: "Your account created successfully." }
 */
export const registerUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res
      .status(401)
      .json({ error: `Error occurred during registration: ${errors.array()[0]?.msg}` });

  try {
    const { username, email, password } = req.body;

    const userExists = await UserModel.findOne({ email: email });

    if (userExists) return res.status(409).json({ error: 'Email already registered!' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new UserModel({
      username: username,
      email: email,
      password: hashed,
      role: 'user',
    });

    await user.save();

    if (!process.env.JWT_SECRET_KEY)
      throw new Error('JWT_SECRET_KEY is not defined in environment variables!!!');

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: '1d',
      },
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ message: 'Your account created successfully.' });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Error occurred during the registration!' });
  }
};

/**
 * Authenticates a user with email and password, returns user info and sets JWT cookie.
 *
 * @param req.body.email - User's email address
 * @param req.body.password - User's password
 *
 * @returns 200 - Login successful with user info (userId, username, role) and JWT cookie set
 * @returns 400 - Validation errors (invalid email/password format)
 * @returns 401 - Invalid credentials, account banned, or authentication failed
 * @returns 500 - Server error or missing JWT_SECRET_KEY
 *
 * Process:
 * 1. Validates input using express-validator
 * 2. Checks if user exists by email
 * 3. Verifies password using bcrypt
 * 4. Checks if account is banned
 * 5. Generates JWT token (expires in 1 day)
 * 6. Sets httpOnly cookie with token
 * 7. Returns safe user info (excludes password)
 *
 * Cookie settings:
 * - httpOnly: true (prevents XSS attacks)
 * - secure: true in production (HTTPS only)
 * - maxAge: 24 hours
 *
 * @example
 * POST /auth/login
 * Body: { email: "john@example.com", password: "SecurePass123!" }
 * Response: { userId: "...", username: "john_doe", role: "user" }
 */
export const loginUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0]?.msg });

  try {
    const { email, password } = req.body;

    const userExists = await UserModel.findOne({ email: email });
    if (!userExists)
      return res
        .status(401)
        .json({ error: 'Invalid credentials! Please check your Email, Password and try again' });

    const match = await bcrypt.compare(password, userExists.password);
    if (!match)
      return res
        .status(401)
        .json({ error: 'Invalid credentials! Please check your Email, Password and try again' });

    if (userExists.banned) return res.status(401).json({ error: 'Your account is banned!!' });

    if (!process.env.JWT_SECRET_KEY)
      throw new Error('JWT_SECRET_KEY is not defined in environment variables!!!');

    const token = jwt.sign(
      { userId: userExists.id, role: userExists.role },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: '1d',
      },
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: (process.env.NODE_ENV as string) === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });

    const safeUser = {
      userId: userExists.id,
      username: userExists.username,
      role: userExists.role,
    };

    return res.status(200).json(safeUser);
  } catch (error) {
    console.error('Error login:', error);
    return res.status(500).json({ error: 'Something went wrong during Login!' });
  }
};

/**
 * Logs out the authenticated user by clearing the JWT cookie.
 *
 * @returns 200 - Logout successful, JWT cookie cleared
 * @returns 500 - Server error during logout process
 *
 * Process:
 * 1. Overwrites 'auth_token' cookie with an empty value
 * 2. Sets cookie expiration to the past to invalidate it
 * 3. Returns confirmation response
 *
 * Cookie cleared:
 * - Name: auth_token
 * - Expires: Immediately (Date set to 0)
 *
 * @example
 * POST /auth/logout
 * Response: { message: "Logged out." }
 */
export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie('auth_token', '', {
      expires: new Date(0),
    });

    return res.status(200).json({ message: 'Logged out.' });
  } catch (error) {
    console.error('Error occurred during user logout:', (error as Error).message);
    return res.status(500).json({ error: 'Logout operation failed!' });
  }
};
