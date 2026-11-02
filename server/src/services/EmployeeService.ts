import type { EmployeeQuery, EmployeeRecord } from '../domain/types';
import type { EmployeeRepository } from '../repositories/interfaces';

export interface EmployeePage { items: EmployeeRecord[]; total: number; page: number; pageSize: number }

export class EmployeeService {
  constructor(private readonly employees: EmployeeRepository) {}
  list(q: EmployeeQuery): EmployeePage {
    const { items, total } = this.employees.search(q);
    return { items, total, page: q.page, pageSize: q.pageSize };
  }
}
