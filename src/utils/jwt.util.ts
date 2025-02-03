import jwt from 'jsonwebtoken';
import { users } from '@prisma/client';

export const generateJWT = async (user: users) => {
  const payload: UserJWT = {
    id: user.id,
    email: user.email,
  };

  const jwtKey = process.env.JWTKEY;

  return jwt.sign(payload, String(jwtKey), {
    expiresIn: '1d'
  });
};

export interface UserJWT {
  email: string;
  id: number;
}
