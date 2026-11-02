import { Router } from 'express';
import type { DashboardService } from '../services/DashboardService';
import type { EmployeeService } from '../services/EmployeeService';
import type { LookupService } from '../services/LookupService';
import { parseDashboardFilter, parseEmployeeQuery } from '../validation/filters';

export interface Services { dashboard: DashboardService; employees: EmployeeService; lookups: LookupService }

/** Controllers stay thin: parse + validate input, call a service, return JSON. */
export function buildApiRouter(s: Services): Router {
  const r = Router();
  r.get('/health', (_req, res) => { res.json({ status: 'ok' }); });
  r.get('/lookups', (_req, res) => { res.json(s.lookups.get()); });
  r.get('/dashboard', (req, res) => { res.json(s.dashboard.getDashboard(parseDashboardFilter(req.query))); });
  r.get('/employees', (req, res) => { res.json(s.employees.list(parseEmployeeQuery(req.query))); });
  return r;
}
