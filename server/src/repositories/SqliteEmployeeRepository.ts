import type { Db } from '../db/connection';
import type { Distribution, EmployeeFilter, EmployeeQuery, EmployeeRecord, SortField } from '../domain/types';
import type { EmployeeRepository } from './interfaces';
import { employeeWhere, escapeLike, type Param } from './sql';

// Whitelist: user input never reaches ORDER BY directly.
const SORT_COLUMNS: Record<SortField, string> = {
  name: 'e.name', code: 'e.code', department: 'd.name', location: 'e.location', status: 'e.status', joinedOn: 'e.joined_on',
};
const GROUP_COLUMNS = { department: 'd.name', location: 'e.location', status: 'e.status' } as const;
const FROM = 'FROM employees e JOIN departments d ON d.id = e.department_id';

export class SqliteEmployeeRepository implements EmployeeRepository {
  constructor(private readonly db: Db) {}

  search(q: EmployeeQuery): { items: EmployeeRecord[]; total: number } {
    const w = employeeWhere(q);
    const conds = [w.clause];
    const params: Param[] = [...w.params];
    if (q.search) {
      conds.push(`(e.name LIKE ? ESCAPE '\\' OR e.code LIKE ? ESCAPE '\\' OR e.email LIKE ? ESCAPE '\\')`);
      const like = `%${escapeLike(q.search)}%`;
      params.push(like, like, like);
    }
    const where = conds.join(' AND ');
    const total = (this.db.prepare(`SELECT COUNT(*) AS n ${FROM} WHERE ${where}`).get(...params) as { n: number }).n;
    const dir = q.order === 'desc' ? 'DESC' : 'ASC';
    const rows = this.db
      .prepare(
        `SELECT e.id, e.code, e.name, e.email, d.name AS department, e.location, e.status, e.joined_on AS joinedOn
         ${FROM} WHERE ${where} ORDER BY ${SORT_COLUMNS[q.sortBy]} ${dir}, e.id LIMIT ? OFFSET ?`,
      )
      .all(...params, q.pageSize, (q.page - 1) * q.pageSize) as unknown as EmployeeRecord[];
    return { items: rows.map((r) => ({ ...r })), total };
  }

  countAsOf(f: EmployeeFilter, asOf: string): number {
    const w = employeeWhere(f);
    return (this.db.prepare(`SELECT COUNT(*) AS n FROM employees e WHERE ${w.clause} AND e.joined_on <= ?`).get(...w.params, asOf) as { n: number }).n;
  }

  countBy(dim: 'department' | 'location' | 'status', f: EmployeeFilter, asOf: string): Distribution[] {
    const w = employeeWhere(f);
    const col = GROUP_COLUMNS[dim];
    const rows = this.db
      .prepare(`SELECT ${col} AS label, COUNT(*) AS value ${FROM} WHERE ${w.clause} AND e.joined_on <= ? GROUP BY ${col} ORDER BY value DESC, label`)
      .all(...w.params, asOf) as unknown as Distribution[];
    return rows.map((r) => ({ label: r.label, value: r.value }));
  }

  distinctLocations(): string[] {
    return (this.db.prepare('SELECT DISTINCT location FROM employees ORDER BY location').all() as unknown as { location: string }[]).map((r) => r.location);
  }
}
