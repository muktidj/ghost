import { NextFunction, Request, Response, Router } from 'express';
import { ProductControllerV1 } from '../../controllers';
import { RequestWithAuth } from '../../../types/express';

export const productRouteV1 = Router();

productRouteV1.get('/', async (req: Request, res: Response, next: NextFunction) => {
    await ProductControllerV1.getAll(req as RequestWithAuth, res, next);
});
productRouteV1.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    await ProductControllerV1.create(req as RequestWithAuth, res, next);
});
productRouteV1.put('/update/:id', async (req: Request, res: Response, next: NextFunction) => {
    await ProductControllerV1.update(req as RequestWithAuth, res, next);
});
productRouteV1.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
    await ProductControllerV1.delete(req as RequestWithAuth, res, next);
});