import type { EmployeeFilter } from '../domain/types';

export type Param = string | number;

/** Builds a parameterised WHERE fragment for employee filters (never interpolates values). */
export function employeeWhere(f: EmployeeFilter, alias = 'e'): { clause: string; params: Param[] } {
  const conds: string[] = [];
  const params: Param[] = [];
  if (f.departmentId !== undefined) { conds.push(`${alias}.department_id = ?`); params.push(f.departmentId); }
  if (f.location !== undefined) { conds.push(`${alias}.location = ?`); params.push(f.location); }
  if (f.status !== undefined) { conds.push(`${alias}.status = ?`); params.push(f.status); }
  return { clause: conds.length ? conds.join(' AND ') : '1 = 1', params };
}

export const escapeLike = (s: string) => s.replace(/[\\%_]/g, '\\$&');
