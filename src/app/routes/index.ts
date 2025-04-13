import express from 'express';
import { userRouteV1, productRouteV1, authRouteV1, reviewRouteV1 } from "./v1";
import { authorizationJWT } from '../middlewares';

const app = express.Router();

app.use('/auth', authRouteV1);

app.use('/users', authorizationJWT, userRouteV1);
app.use('/products', authorizationJWT, productRouteV1);
app.use('/review', authorizationJWT, reviewRouteV1)

export default app;