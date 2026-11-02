export type EmployeeStatus = 'Active' | 'Probation' | 'Notice period';
export type AttendanceStatus = 'Present' | 'Absent' | 'On Leave';

export interface Department { id: number; name: string }
export interface Lookups { departments: Department[]; locations: string[]; statuses: EmployeeStatus[] }
export interface Distribution { label: string; value: number }
export interface TrendPoint { date: string; present: number; absent: number; onLeave: number }
export interface Activity {
  id: number; employeeName: string; department: string; status: AttendanceStatus; date: string; checkIn: string | null;
}
export interface Dashboard {
  asOf: string | null;
  kpis: { total: number; present: number; absent: number; onLeave: number; attendanceRate: number };
  trend: TrendPoint[];
  byDepartment: Distribution[];
  byLocation: Distribution[];
  byStatus: Distribution[];
  recentActivity: Activity[];
}
export interface Employee {
  id: number; code: string; name: string; email: string; department: string; location: string;
  status: EmployeeStatus; joinedOn: string;
}
export interface EmployeePage { items: Employee[]; total: number; page: number; pageSize: number }

export type SortField = 'name' | 'code' | 'department' | 'location' | 'status' | 'joinedOn';
export type SortOrder = 'asc' | 'desc';

export interface Filters {
  from: string;
  to: string;
  departmentId: number | 'All';
  location: string;
  status: EmployeeStatus | 'All';
}
export interface EmployeeListQuery { search: string; sortBy: SortField; order: SortOrder; page: number; pageSize: number }
