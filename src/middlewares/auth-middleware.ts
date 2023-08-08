import { asyncFn } from '../utils';
import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import { appConfig } from '../configs';

class AuthRequestError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
    this.name = 'AuthRequestError';
  }
}

const checkAuth = asyncFn(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt.verify(token, appConfig.jwtSecret, (err: any, decoded: any) => {
      if (err) {
        res.status(401);

        throw new AuthRequestError('User is not authorized', 401);
      }

      req.user = { ...req.user, ...decoded };
      next();
    });
  }

  if (!token) {
    res.status(401);
    const authError = new AuthRequestError('User is not authorized', 401);
    throw authError;
  }
});

export { checkAuth };
