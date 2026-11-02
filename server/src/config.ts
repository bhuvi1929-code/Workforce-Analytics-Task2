import path from 'node:path';

export const config = {
  port: Number(process.env.PORT ?? 4000),
  dbPath: process.env.DB_PATH ?? path.resolve(process.cwd(), 'data/wfa.db'),
};
