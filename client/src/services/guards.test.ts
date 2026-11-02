import { describe, expect, it } from 'vitest';
import { isDashboard, isEmployeePage } from './guards';

const dash = {
  asOf: '2026-10-30',
  kpis: { total: 10, present: 8, absent: 1, onLeave: 1, attendanceRate: 88.9 },
  trend: [{ date: '2026-10-30', present: 8, absent: 1, onLeave: 1 }],
  byDepartment: [{ label: 'HR', value: 10 }], byLocation: [], byStatus: [],
  recentActivity: [],
};

describe('response guards', () => {
  it('accepts a valid dashboard payload', () => expect(isDashboard(dash)).toBe(true));
  it('rejects a wrong KPI type', () => expect(isDashboard({ ...dash, kpis: { ...dash.kpis, total: '10' } })).toBe(false));
  it('rejects null and arrays', () => { expect(isDashboard(null)).toBe(false); expect(isEmployeePage([])).toBe(false); });
  it('accepts an empty employee page', () => expect(isEmployeePage({ items: [], total: 0, page: 1, pageSize: 10 })).toBe(true));
});
