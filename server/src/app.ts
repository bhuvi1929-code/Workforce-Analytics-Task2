import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import { buildApiRouter, type Services } from './routes/api';
import { ValidationError } from './validation/filters';

const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, _next) => {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: err.message, details: err.details } });
    return;
  }
  console.error(err);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong on the server' } });
};

export function createApp(services: Services) {
  const app = express();
  app.use(cors());
  app.use('/api', buildApiRouter(services));
  app.use('/api', (_req, res) => { res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Unknown endpoint' } }); });
  app.use(errorHandler);
  return app;
}
