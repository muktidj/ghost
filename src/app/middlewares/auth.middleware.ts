import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { HttpException, UserJWT } from '../../utils';
import { NextFunction, Request, Response } from 'express';

dotenv.config();

export const authorizationJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization;

  try {
    if (authToken) {
      const token: string[] = authToken.split(' ');
      const jwtKey: string = String(process.env.JWTKEY);

      if (token[0] === 'Bearer') {
        const result = jwt.verify(token[1], jwtKey) as UserJWT;
        // req.user = result;
        next();
      } else {
        throw new HttpException(401, 'Invalid Type Token');
      }
    } else {
      throw new HttpException(401, 'Unauthorized');
    }
  } catch (e: any) {
    next(e);
  }
};
