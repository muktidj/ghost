import { Request } from 'express';
import { UserJWT } from '../utils';

export interface RequestWithAuth extends Request {
  user: UserJWT;
}
