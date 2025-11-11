import { Request, Response } from 'express';
import userModel from '../../models/user.model';
import { User } from '../../types/user.type';

/**
 * Retrieves the authenticated user's profile information.
 *
 * @param req.userId - Authenticated user's ID (from middleware)
 *
 * @returns 200 - User object
 * @returns 400 - User ID missing (authentication failed)
 * @returns 404 - User not found in database
 * @returns 500 - Server error
 *
 * Returns the complete user profile for the authenticated user.
 *
 * @example
 * GET /user
 * Response: { _id: "...", email: "user@example.com", username: "john_doe", ... }
 */
export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(400).json({ error: 'Authentication failed!' });

    const user = await userModel.findById({ _id: userId });
    if (!user) return res.status(404).json({ error: 'Not found!' });

    const userSafe: User = user as User;

    return res.status(200).json(userSafe);
  } catch (error) {
    console.log('Error fetching user:', (error as Error)?.message);
    return res.status(500).json({ error: 'Error getting user!' });
  }
};
