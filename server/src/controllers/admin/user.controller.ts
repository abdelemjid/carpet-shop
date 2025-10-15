import { Request, Response } from 'express';
import userModel from '../../models/user.model';
import { FetchingUsersConfig } from '../../config/fetching';
import { User, UsersResponse } from '../../types/user.type';

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(400).json({ error: 'Bad request' });

    const id = req?.params?.userId || null;

    let user = await userModel.findById({ _id: userId });
    if (!user) return res.status(404).json({ error: 'Not found!' });

    if (id && user.role === 'admin') user = await userModel.findOne({ _id: id });

    const userSafe: User = user as User;

    return res.status(200).json(userSafe);
  } catch (error) {
    console.log('Error fetching user:', (error as Error)?.message);
    return res.status(500).json({ error: 'Error getting user!' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || FetchingUsersConfig.pageNumber, 1);
    const limit = Math.max(FetchingUsersConfig.pageSize, 1);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      await userModel
        .find({ role: { $exists: true, $ne: 'admin' } })
        .select('-password')
        .skip(skip)
        .limit(limit)
        .lean<User[]>(),
      await userModel.countDocuments(),
    ]);

    const response: UsersResponse = {
      users: users,
      pagination: {
        total: total,
        page: page,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching users:', (error as Error).message);
    return res.status(500).json({ error: 'Something went wrong while fetching users!' });
  }
};

export const banUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const user = await userModel.findOne({ _id: userId });
    if (!user) return res.status(404).json({ error: 'User not found!' });

    await userModel.findOneAndUpdate(
      { _id: userId },
      { banned: !user?.banned, dateOfBan: new Date() },
    );

    return res
      .status(201)
      .json({ message: `User {${userId}} ${user.banned ? 'permitted' : 'banned'}` });
  } catch (error) {
    console.error('Error occurred during a user ban:', (error as Error).message);
    return res.status(500).json({ error: 'Something went wrong while banning a user!' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req?.params?.userId || undefined;

    const user = await userModel.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ error: 'User not found!' });

    return res.status(200).json({ message: `User ${userId} is deleted successfully.` });
  } catch (error) {
    console.error('Error occurred while deleting a user:', (error as Error).message);
    return res.status(500).json({ error: 'Something went wrong while deleting the user!' });
  }
};
