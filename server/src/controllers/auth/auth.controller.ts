import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../../models/user.model';
import { validationResult } from 'express-validator';

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
