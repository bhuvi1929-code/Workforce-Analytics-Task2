import { createApp } from './app';
import { config } from './config';
import { buildServices } from './container';
import { openDatabase } from './db/connection';
import { isEmpty, seedDatabase } from './db/seed';

const db = openDatabase(config.dbPath);
if (isEmpty(db)) {
  seedDatabase(db);
  console.log('Empty database detected: sample data generated.');
}
createApp(buildServices(db)).listen(config.port, () => {
  console.log(`WFA API listening on http://localhost:${config.port}/api`);
});
