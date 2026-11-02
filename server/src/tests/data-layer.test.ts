import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildServices } from '../container';
import { openDatabase } from '../db/connection';
import { seedDatabase } from '../db/seed';
import { parseDashboardFilter, parseEmployeeQuery, ValidationError } from '../validation/filters';

const TODAY = '2026-10-30';
function setup() {
  const db = openDatabase(':memory:');
  seedDatabase(db, TODAY);
  return { db, s: buildServices(db) };
}
const filter = (q: Record<string, string> = {}) => parseDashboardFilter(q, new Date(`${TODAY}T00:00:00Z`));

test('KPIs are consistent: present + absent + on leave = total on the as-of day', () => {
  const { s } = setup();
  const d = s.dashboard.getDashboard(filter());
  assert.equal(d.asOf, TODAY);
  assert.equal(d.kpis.present + d.kpis.absent + d.kpis.onLeave, d.kpis.total);
  assert.ok(d.kpis.attendanceRate > 80 && d.kpis.attendanceRate <= 100);
  assert.ok(d.trend.length > 15);
  assert.equal(d.byDepartment.reduce((a, x) => a + x.value, 0), d.kpis.total);
  assert.ok(d.recentActivity.length === 8);
});

test('department and location filters narrow results', () => {
  const { s } = setup();
  const all = s.dashboard.getDashboard(filter());
  const dept = s.lookups.get().departments[0]!;
  const one = s.dashboard.getDashboard(filter({ departmentId: String(dept.id), location: 'Chennai' }));
  assert.ok(one.kpis.total > 0 && one.kpis.total < all.kpis.total);
  assert.deepEqual(one.byDepartment.map((x) => x.label), [dept.name]);
  assert.deepEqual(one.byLocation.map((x) => x.label), ['Chennai']);
});

test('empty result for a range with no attendance', () => {
  const { s } = setup();
  const d = s.dashboard.getDashboard(filter({ from: '2020-01-01', to: '2020-01-31' }));
  assert.equal(d.asOf, null);
  assert.equal(d.kpis.present, 0);
  assert.equal(d.trend.length, 0);
});

test('employee list: pagination, sorting and search', () => {
  const { s } = setup();
  const p1 = s.employees.list(parseEmployeeQuery({ page: '1', pageSize: '10', sortBy: 'name', order: 'asc' }));
  const p2 = s.employees.list(parseEmployeeQuery({ page: '2', pageSize: '10', sortBy: 'name', order: 'asc' }));
  assert.equal(p1.total, 240);
  assert.equal(p1.items.length, 10);
  assert.notEqual(p1.items[0]!.id, p2.items[0]!.id);
  const names = p1.items.map((e) => e.name);
  assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b)));
  const desc = s.employees.list(parseEmployeeQuery({ sortBy: 'joinedOn', order: 'desc' }));
  assert.ok(desc.items[0]!.joinedOn >= desc.items[9]!.joinedOn);
  const found = s.employees.list(parseEmployeeQuery({ search: 'WFA-1001' }));
  assert.equal(found.total, 1);
});

test('search input is treated as data, not SQL', () => {
  const { db, s } = setup();
  const r = s.employees.list(parseEmployeeQuery({ search: "'; DROP TABLE employees; --" }));
  assert.equal(r.total, 0);
  assert.equal(s.employees.list(parseEmployeeQuery({ search: '100%' })).total, 0);
  assert.equal((db.prepare('SELECT COUNT(*) AS n FROM employees').get() as { n: number }).n, 240);
});

test('validation rejects bad input', () => {
  const bad: Record<string, string>[] = [
    { from: '2026-13-01' }, { from: '2026-10-30', to: '2026-10-01' }, { from: '2024-01-01', to: '2026-10-30' },
    { status: 'Retired' }, { departmentId: 'abc' }, { departmentId: '-2' },
  ];
  for (const q of bad) assert.throws(() => filter(q), ValidationError);
  for (const q of [{ sortBy: 'password' }, { order: 'sideways' }, { page: '0' }, { pageSize: '1000' }]) {
    assert.throws(() => parseEmployeeQuery(q), ValidationError);
  }
});

test('foreign keys and unique attendance rows are enforced by the schema', () => {
  const { db } = setup();
  assert.throws(() => db.prepare("INSERT INTO attendance (employee_id, date, status) VALUES (9999, '2026-10-30', 'Present')").run());
  assert.throws(() => db.prepare("INSERT INTO attendance (employee_id, date, status) VALUES (1, '2026-10-30', 'Nope')").run());
});
