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

userRouteV1.get(
    '/export-excel',
    async (req: Request, res: Response, next: NextFunction) => {
        await UserControllerV1.exportToExcel(req as RequestWithAuth, res, next);
    }
);

userRouteV1.get(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
        await UserControllerV1.getFindOne(req as RequestWithAuth, res, next);
    }
);


userRouteV1.post(
    '/create',
    async (req: Request, res: Response, next: NextFunction) => {
        await UserControllerV1.create(req as RequestWithAuth, res, next);
    }
);
userRouteV1.put(
    '/update/:id',
    async (req: Request, res: Response, next: NextFunction) => {
        await UserControllerV1.update(req as RequestWithAuth, res, next);
    }
);
userRouteV1.delete(
    '/delete/:id',
    async (req: Request, res: Response, next: NextFunction) => {
        await UserControllerV1.delete(req as RequestWithAuth, res, next);
    }
);