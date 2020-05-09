import express, { Request, Response, NextFunction } from 'express';
import logger from './util/logger';
import bodyParser from 'body-parser';
import cors from 'cors';
import { corsUrl, environment } from './config';
import { NotFoundError, ApiError, InternalError } from './util/error';

process.on('uncaughtException', (e) => {
  logger.error(e);
});

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

// Catch 404, send to Error Handler
app.use((req, res, next) => next(new NotFoundError()));

// Middleware Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else {
    if (environment === 'development') {
      logger.error(err);
      return res.status(500).send(err.message);
    }
    ApiError.handle(new InternalError(), res);
  }
});

export default app;
