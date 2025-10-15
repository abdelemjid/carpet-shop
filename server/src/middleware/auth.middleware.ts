import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: string;
    }
  }
}

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.auth_token || req.headers.authorization;

      if (!token) return res.status(401).json({ error: 'Unauthorized. No token provided!' });
      if (!process.env.JWT_SECRET_KEY)
        throw new Error('JWT_SECRET_KEY is not defined in environment variables');

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;

      if (!roles.includes(decoded.role))
        return res
          .status(403)
          .json({ error: 'Forbidden. You do not have the required permission.' });

      req.userId = decoded.userId;
      req.role = decoded.role;

      next();
    } catch (error) {
      console.error('Authorization Error:', (error as Error)?.message);
      return res.status(400).json({ error: 'Unauthorized or token expired!' });
    }
  };
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.auth_token || req.headers.authorization;

    if (!token) return res.status(401).json({ error: 'Invalid token!' });
    if (!process.env.JWT_SECRET_KEY)
      throw new Error('JWT_SECRET_KEY is not defined in environment variables');

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (error) {
    console.log('Error verify token:', (error as Error)?.message);
    return res
      .status(500)
      .json({ error: 'Something went wrong during the access token verification!' });
  }
};
