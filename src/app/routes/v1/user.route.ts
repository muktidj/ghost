import { NextFunction, Request, Response, Router } from 'express';
import { UserControllerV1 } from '../../controllers';
import { RequestWithAuth } from '../../../types/express';

export const userRouteV1 = Router();

userRouteV1.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    await UserControllerV1.getAll(req as RequestWithAuth, res, next);
  }
);
userRouteV1.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    await UserControllerV1.create(req as RequestWithAuth, res, next);
  }
);
userRouteV1.put(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    await UserControllerV1.update(req as RequestWithAuth, res, next);
  }
);
userRouteV1.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    await UserControllerV1.delete(req as RequestWithAuth, res, next);
  }
);
