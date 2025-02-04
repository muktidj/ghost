import { Router } from 'express';
import { AuthControllerV1 } from '../../controllers';

export const authRouteV1 = Router();

authRouteV1.post('/', AuthControllerV1.login);