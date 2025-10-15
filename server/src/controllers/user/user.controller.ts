import { Request, Response } from 'express';
import userModel from '../../models/user.model';
import { User } from '../../types/user.type';

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
