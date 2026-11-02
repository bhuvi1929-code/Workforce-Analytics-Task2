import type { Db } from '../db/connection';
import type { Department } from '../domain/types';
import type { DepartmentRepository } from './interfaces';

export class SqliteDepartmentRepository implements DepartmentRepository {
  constructor(private readonly db: Db) {}
  list(): Department[] {
    return (this.db.prepare('SELECT id, name FROM departments ORDER BY name').all() as unknown as Department[]).map((r) => ({ id: r.id, name: r.name }));
  }
}
