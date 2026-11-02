import { EMPLOYEE_STATUSES, type Department, type EmployeeStatus } from '../domain/types';
import type { DepartmentRepository, EmployeeRepository } from '../repositories/interfaces';

export interface Lookups { departments: Department[]; locations: string[]; statuses: readonly EmployeeStatus[] }

export class LookupService {
  constructor(private readonly departments: DepartmentRepository, private readonly employees: EmployeeRepository) {}
  get(): Lookups {
    return { departments: this.departments.list(), locations: this.employees.distinctLocations(), statuses: EMPLOYEE_STATUSES };
  }
}
