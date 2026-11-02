import type { DashboardDto, DashboardFilter } from '../domain/types';
import type { AttendanceRepository, EmployeeRepository } from '../repositories/interfaces';

const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * KPI definitions:
 *  - total / present / absent / onLeave: snapshot on the latest day with attendance inside the range ("asOf")
 *  - attendanceRate: present / (present + absent) across the whole range (approved leave is excluded)
 */
export class DashboardService {
  constructor(private readonly employees: EmployeeRepository, private readonly attendance: AttendanceRepository) {}

  getDashboard(f: DashboardFilter): DashboardDto {
    const asOf = this.attendance.latestDate(f, f);
    const day = asOf ?? f.to;
    const counts = asOf ? this.attendance.counts(asOf, f) : { present: 0, absent: 0, onLeave: 0 };
    const totals = this.attendance.rangeTotals(f, f);
    const denominator = totals.present + totals.absent;

    return {
      asOf,
      kpis: {
        total: this.employees.countAsOf(f, day),
        ...counts,
        attendanceRate: denominator ? round1((totals.present / denominator) * 100) : 0,
      },
      trend: this.attendance.trend(f, f),
      byDepartment: this.employees.countBy('department', f, day),
      byLocation: this.employees.countBy('location', f, day),
      byStatus: this.employees.countBy('status', f, day),
      recentActivity: this.attendance.recent(f, f, 8),
    };
  }
}
