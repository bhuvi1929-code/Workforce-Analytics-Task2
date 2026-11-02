import {
  EMPLOYEE_STATUSES, SORT_FIELDS, type DashboardFilter, type EmployeeFilter, type EmployeeQuery,
  type EmployeeStatus, type SortField,
} from '../domain/types';

export class ValidationError extends Error {
  constructor(readonly details: string[]) { super('Invalid request parameters'); }
}

type Query = Record<string, unknown>;
const MAX_RANGE_DAYS = 366;

const first = (v: unknown) => (Array.isArray(v) ? v[0] : v);
const str = (q: Query, k: string): string | undefined => {
  const v = first(q[k]);
  return typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined;
};
const isIsoDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s;
const dayDiff = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);

function parseEmployeeFilter(q: Query, errors: string[]): EmployeeFilter {
  const f: EmployeeFilter = {};
  const dept = str(q, 'departmentId');
  if (dept !== undefined) {
    if (/^\d+$/.test(dept) && Number(dept) > 0) f.departmentId = Number(dept);
    else errors.push('departmentId must be a positive integer');
  }
  const loc = str(q, 'location');
  if (loc !== undefined) {
    if (loc.length <= 50) f.location = loc;
    else errors.push('location must be at most 50 characters');
  }
  const status = str(q, 'status');
  if (status !== undefined) {
    if ((EMPLOYEE_STATUSES as readonly string[]).includes(status)) f.status = status as EmployeeStatus;
    else errors.push(`status must be one of: ${EMPLOYEE_STATUSES.join(', ')}`);
  }
  return f;
}

export function parseDashboardFilter(q: Query, today: Date = new Date()): DashboardFilter {
  const errors: string[] = [];
  const f = parseEmployeeFilter(q, errors);
  const defaultTo = today.toISOString().slice(0, 10);
  const to = str(q, 'to') ?? defaultTo;
  const from = str(q, 'from') ?? new Date(Date.parse(to) - 29 * 86_400_000).toISOString().slice(0, 10);
  if (!isIsoDate(to)) errors.push('to must be a valid date (YYYY-MM-DD)');
  if (!isIsoDate(from)) errors.push('from must be a valid date (YYYY-MM-DD)');
  if (errors.length === 0) {
    if (from > to) errors.push('from must not be after to');
    else if (dayDiff(from, to) > MAX_RANGE_DAYS) errors.push(`date range must not exceed ${MAX_RANGE_DAYS} days`);
  }
  if (errors.length) throw new ValidationError(errors);
  return { ...f, from, to };
}

export function parseEmployeeQuery(q: Query): EmployeeQuery {
  const errors: string[] = [];
  const f = parseEmployeeFilter(q, errors);

  const search = str(q, 'search');
  if (search !== undefined && search.length > 100) errors.push('search must be at most 100 characters');

  const sortBy = str(q, 'sortBy') ?? 'name';
  if (!(SORT_FIELDS as readonly string[]).includes(sortBy)) errors.push(`sortBy must be one of: ${SORT_FIELDS.join(', ')}`);
  const order = str(q, 'order') ?? 'asc';
  if (order !== 'asc' && order !== 'desc') errors.push('order must be asc or desc');

  const intParam = (k: string, def: number, min: number, max: number) => {
    const raw = str(q, k);
    if (raw === undefined) return def;
    const n = Number(raw);
    if (!/^\d+$/.test(raw) || n < min || n > max) { errors.push(`${k} must be an integer between ${min} and ${max}`); return def; }
    return n;
  };
  const page = intParam('page', 1, 1, 100_000);
  const pageSize = intParam('pageSize', 10, 5, 100);

  if (errors.length) throw new ValidationError(errors);
  return { ...f, search, sortBy: sortBy as SortField, order: order as 'asc' | 'desc', page, pageSize };
}
