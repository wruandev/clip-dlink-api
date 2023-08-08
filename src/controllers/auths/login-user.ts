import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { asyncFn } from './../../utils';
import { User } from './../../models';
import jwt from 'jsonwebtoken';
import { appConfig } from './../../configs';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().nonempty('Username is required'),
  password: z.string().nonempty('Password is required'),
});

const createAccessToken = (user: { id: string; username: string }) => {
  const accessToken = jwt.sign(user, appConfig.jwtSecret, { expiresIn: '1d' });

  return accessToken;
};

const loginUser = asyncFn(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const validated = loginSchema.safeParse({ username, password });

  if (!validated.success) {
    return res.status(400).json({
      status: 'error',
      error: validated.error.flatten().fieldErrors,
    });
  }

  const user = await User.query().findOne({
    username: validated.data.username,
  });

  if (!user) {
    return res.status(400).json({
      status: 'error',
      error: 'username or password doesnt match',
    });
  }

  const passwordMatches = await bcrypt.compare(validated.data.password, user.password);

  if (!passwordMatches) {
    return res.status(400).json({
      status: 'error',
      error: 'username or password doesnt match',
    });
  }

  const accessToken = createAccessToken({
    id: user.userId,
    username: user.username,
  });

  return res.status(200).json({
    status: 'success',
    accessToken,
  });
});

export { loginUser };
