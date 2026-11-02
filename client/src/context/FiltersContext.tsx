import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Filters } from '../types/api';

const iso = (d: Date) => d.toISOString().slice(0, 10);
export function defaultFilters(): Filters {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 29);
  return { from: iso(from), to: iso(to), departmentId: 'All', location: 'All', status: 'All' };
}

interface Ctx { filters: Filters; setFilters: (f: Filters) => void; reset: () => void }
const FiltersContext = createContext<Ctx | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const value = useMemo<Ctx>(() => ({ filters, setFilters, reset: () => setFilters(defaultFilters()) }), [filters]);
  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters(): Ctx {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error('useFilters must be used inside FiltersProvider');
  return ctx;
}
