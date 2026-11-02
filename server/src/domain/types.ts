export const EMPLOYEE_STATUSES = ['Active', 'Probation', 'Notice period'] as const;
export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];
export type AttendanceStatus = 'Present' | 'Absent' | 'On Leave';

export interface EmployeeFilter { departmentId?: number; location?: string; status?: EmployeeStatus }
export interface DateRange { from: string; to: string }
export type DashboardFilter = EmployeeFilter & DateRange;

export const SORT_FIELDS = ['name', 'code', 'department', 'location', 'status', 'joinedOn'] as const;
export type SortField = (typeof SORT_FIELDS)[number];
export interface EmployeeQuery extends EmployeeFilter {
  search?: string; sortBy: SortField; order: 'asc' | 'desc'; page: number; pageSize: number;
}

export interface Department { id: number; name: string }
export interface EmployeeRecord {
  id: number; code: string; name: string; email: string; department: string;
  location: string; status: EmployeeStatus; joinedOn: string;
}
export interface Distribution { label: string; value: number }
export interface AttendanceCounts { present: number; absent: number; onLeave: number }
export interface TrendPoint extends AttendanceCounts { date: string }
export interface ActivityRecord {
  id: number; employeeName: string; department: string; status: AttendanceStatus; date: string; checkIn: string | null;
}

export interface DashboardDto {
  asOf: string | null;
  kpis: { total: number; present: number; absent: number; onLeave: number; attendanceRate: number };
  trend: TrendPoint[];
  byDepartment: Distribution[];
  byLocation: Distribution[];
  byStatus: Distribution[];
  recentActivity: ActivityRecord[];
}
