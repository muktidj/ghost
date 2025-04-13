import { NextFunction, Request, Response, Router } from 'express';
import { ProductControllerV1 } from '../../controllers';
import { RequestWithAuth } from '../../../types/express';

export const reviewRouteV1 = Router();

reviewRouteV1.post('/reviews/import', async (req: Request, res: Response, next: NextFunction) => {
    await ProductControllerV1.getAll(req as RequestWithAuth, res, next);
});