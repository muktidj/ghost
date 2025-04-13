import { NextFunction, Request, Response, Router } from 'express';
import { ProductControllerV1 } from '../../controllers';
import { RequestWithAuth } from '../../../types/express';
import { ReviewControllerV1, uploadMiddleware } from '../../controllers/review.controller';

export const reviewRouteV1 = Router();

reviewRouteV1.post('/import',uploadMiddleware.single('csv'), async (req: Request, res: Response, next: NextFunction) => {
    await ReviewControllerV1.import(req as RequestWithAuth, res, next);
});