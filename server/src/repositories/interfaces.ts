import type {
  ActivityRecord, AttendanceCounts, DateRange, Department, Distribution, EmployeeFilter,
  EmployeeQuery, EmployeeRecord, TrendPoint,
} from '../domain/types';

export interface EmployeeRepository {
  search(q: EmployeeQuery): { items: EmployeeRecord[]; total: number };
  countAsOf(f: EmployeeFilter, asOf: string): number;
  countBy(dim: 'department' | 'location' | 'status', f: EmployeeFilter, asOf: string): Distribution[];
  distinctLocations(): string[];
}
export interface DepartmentRepository { list(): Department[] }
export interface AttendanceRepository {
  latestDate(range: DateRange, f: EmployeeFilter): string | null;
  counts(date: string, f: EmployeeFilter): AttendanceCounts;
  trend(range: DateRange, f: EmployeeFilter): TrendPoint[];
  rangeTotals(range: DateRange, f: EmployeeFilter): { present: number; absent: number };
  recent(range: DateRange, f: EmployeeFilter, limit: number): ActivityRecord[];
}
