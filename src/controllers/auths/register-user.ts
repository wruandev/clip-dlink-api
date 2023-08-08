import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { asyncFn } from './../../utils';
import { User } from './../../models';
import { appConfig } from '../../configs';
import { z } from 'zod';

const registerFormSchema = z.object({
  name: z.string().min(3, { message: 'Name is required and must be 3 or more characters long' }),
  username: z
    .string()
    .min(4, { message: 'Username is required and must be 4 or more characters long' }),
  password: z
    .string()
    .min(6, { message: 'Password is required and must be 6 or more characters long' }),
});

const saltRounds = appConfig.jwtSaltRounds;
const checkUsernameExist = async (username: string) => {
  const data = await User.query().select('username').findOne({
    username,
  });

  if (data) {
    return true;
  }

  return false;
};

const registerUser = asyncFn(async (req: Request, res: Response) => {
  const { username, password, name } = req.body;

  const validated = registerFormSchema.safeParse({ username, password, name });

  if (!validated.success) {
    return res.status(400).json({
      status: 'error',
      error: validated.error.flatten().fieldErrors,
    });
  }

  const newUid = uuidv4();

  const usernameExist = await checkUsernameExist(validated.data.username);

  if (usernameExist) {
    return res.status(400).json({
      status: 'error',
      error: 'username already exists',
    });
  }

  const hashedPassword = await bcrypt.hash(validated.data.password, saltRounds);

  const createdUser = await User.query().insert({
    userId: newUid,
    username: validated.data.username,
    password: hashedPassword,
    name: validated.data.name,
  });

  return res.json({
    status: 'success',
    data: {
      id: createdUser.userId,
      username: createdUser.username,
      name: createdUser.name,
    },
  });
});

export { registerUser };
