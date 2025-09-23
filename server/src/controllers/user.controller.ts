import { Request, Response } from 'express';
import userModel from '../models/user.model';

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(400).json({ error: 'Bad request' });

    const user = await userModel.findById({ _id: userId });
    if (!user) return res.status(404).json({ error: 'Not found!' });

    const safeUser = { id: user.id, name: user.username, role: user.role };

    return res.status(200).json(safeUser);
  } catch (error) {
    console.log('Error fetching user:', (error as Error)?.message);
    return res.status(500).json({ error: 'Error getting user!' });
  }
};
