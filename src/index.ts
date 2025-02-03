import express from 'express';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import routes from './app/routes';
import { handleError, notFound } from './app/middlewares';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

const corsOpts: CorsOptions = {
  origin: [
    'http://localhost:3000',
    'https://dev-web-order.whitehorse.id',
    'https://order.whitehorse.id',
    'https://stg-web-order.whitehorse.id',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: '*',
  optionsSuccessStatus: 200,
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '3mb' }));
app.use(cors(corsOpts));

app.use('/x-com', routes);
app.use(notFound);
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
