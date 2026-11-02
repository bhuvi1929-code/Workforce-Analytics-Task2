import { config } from '../config';
import { openDatabase } from './connection';
import { seedDatabase } from './seed';

const db = openDatabase(config.dbPath);
db.exec('DELETE FROM attendance; DELETE FROM employees; DELETE FROM departments; DELETE FROM sqlite_sequence;');
seedDatabase(db);
console.log(`Seeded ${config.dbPath}`);
