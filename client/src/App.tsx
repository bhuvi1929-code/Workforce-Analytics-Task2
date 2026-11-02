import { useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import AppShell from './components/layout/AppShell';
import { FiltersProvider } from './context/FiltersContext';
import { useHashRoute } from './hooks/useHashRoute';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import { buildTheme } from './theme';

type Mode = 'light' | 'dark';
const TITLES = { dashboard: 'Dashboard', employees: 'Employees' } as const;

export default function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<Mode | null>(() => {
    try { return (localStorage.getItem('wa-mode') as Mode | null) ?? null; } catch { return null; }
  });
  const effective: Mode = mode ?? (prefersDark ? 'dark' : 'light');
  const theme = useMemo(() => buildTheme(effective), [effective]);
  const route = useHashRoute();

  const toggle = () => {
    const next: Mode = effective === 'dark' ? 'light' : 'dark';
    setMode(next);
    try { localStorage.setItem('wa-mode', next); } catch { /* storage unavailable */ }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FiltersProvider>
        <AppShell route={route} title={TITLES[route]} onToggleMode={toggle}>
          {route === 'dashboard' ? <DashboardPage /> : <EmployeesPage />}
        </AppShell>
      </FiltersProvider>
    </ThemeProvider>
  );
}
