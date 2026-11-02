import type { Db } from './connection';
import type { EmployeeStatus } from '../domain/types';

const DEPARTMENTS = ['Engineering', 'Operations', 'Sales', 'Finance', 'Human Resources', 'Customer Support'];
const LOCATIONS = ['Chennai', 'Bengaluru', 'Mumbai', 'Remote'];
const FIRST = ['Aarav', 'Meera', 'Karthik', 'Divya', 'Rahul', 'Priya', 'Suresh', 'Anitha', 'Vikram', 'Nisha', 'Arjun', 'Lakshmi', 'Ishaan', 'Kavya', 'Rohan', 'Sneha'];
const LAST = ['Raman', 'Iyer', 'Kumar', 'Nair', 'Singh', 'Pillai', 'Das', 'Menon', 'Rao', 'Shah', 'Reddy', 'Gupta'];
const EMPLOYEE_COUNT = 240;
const HISTORY_DAYS = 120;

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (date: string, n: number) => {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return iso(d);
};
const pad = (n: number) => String(n).padStart(2, '0');

/** Generates deterministic sample data. Attendance covers the last HISTORY_DAYS days up to `today`. */
export function seedDatabase(db: Db, today: string = iso(new Date())): void {
  const rand = rng(7);
  const pick = <T,>(a: readonly T[]): T => a[Math.floor(rand() * a.length)] as T;

  db.exec('BEGIN');
  try {
    const insDept = db.prepare('INSERT INTO departments (name) VALUES (?)');
    const deptIds = DEPARTMENTS.map((n) => Number(insDept.run(n).lastInsertRowid));

    const insEmp = db.prepare(
      'INSERT INTO employees (code, name, email, department_id, location, status, joined_on) VALUES (?, ?, ?, ?, ?, ?, ?)',
    );
    const insAtt = db.prepare('INSERT INTO attendance (employee_id, date, status, check_in) VALUES (?, ?, ?, ?)');

    for (let i = 0; i < EMPLOYEE_COUNT; i++) {
      const r = rand();
      const status: EmployeeStatus = r < 0.84 ? 'Active' : r < 0.95 ? 'Probation' : 'Notice period';
      const first = pick(FIRST);
      const last = pick(LAST);
      const joinedDaysAgo = status === 'Probation' ? 10 + Math.floor(rand() * 140) : 160 + Math.floor(rand() * 1700);
      const joined = addDays(today, -joinedDaysAgo);
      const id = Number(
        insEmp.run(
          `WFA-${1001 + i}`, `${first} ${last}`, `${first}.${last}${i}@wfa.example`.toLowerCase(),
          pick(deptIds), pick(LOCATIONS), status, joined,
        ).lastInsertRowid,
      );

      for (let back = HISTORY_DAYS - 1; back >= 0; back--) {
        const date = addDays(today, -back);
        const dow = new Date(`${date}T00:00:00Z`).getUTCDay();
        if (dow === 0 || dow === 6 || date < joined) continue;
        const x = rand();
        if (x < 0.06) insAtt.run(id, date, 'Absent', null);
        else if (x < 0.1) insAtt.run(id, date, 'On Leave', null);
        else {
          const mins = 8 * 60 + 30 + Math.floor(rand() * 80);
          insAtt.run(id, date, 'Present', `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`);
        }
      }
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

export function isEmpty(db: Db): boolean {
  return (db.prepare('SELECT COUNT(*) AS n FROM departments').get() as { n: number }).n === 0;
}
