import { Box, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/PeopleAltOutlined';
import HowToRegIcon from '@mui/icons-material/HowToRegOutlined';
import PersonOffIcon from '@mui/icons-material/PersonOffOutlined';
import BeachIcon from '@mui/icons-material/BeachAccessOutlined';
import PercentIcon from '@mui/icons-material/DonutSmallOutlined';
import FilterBar from '../components/filters/FilterBar';
import KpiCard from '../components/dashboard/KpiCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import { AttendanceTrend, DistributionBar, StatusDonut } from '../components/dashboard/Charts';
import { DashboardSkeleton, EmptyState, ErrorState } from '../components/common/States';
import { useFilters } from '../context/FiltersContext';
import { useAsync } from '../hooks/useAsync';
import { api } from '../services/api';

export default function DashboardPage() {
  const { filters, reset } = useFilters();
  const { state, retry } = useAsync((s) => api.getDashboard(filters, s), [filters]);
  const d = state.status === 'ready' ? state.data : null;

  return (
    <>
      <Box>
        <Typography variant="h5" component="h1">Workforce overview</Typography>
        <Typography color="text.secondary">Headcount and attendance across your organisation.</Typography>
      </Box>
      <FilterBar />
      {state.status === 'loading' && <DashboardSkeleton />}
      {state.status === 'error' && <ErrorState message={state.message} onRetry={retry} />}
      {d && (d.asOf === null || d.kpis.total === 0) && (
        <EmptyState title="No attendance data for these filters" hint="Widen the date range or clear a filter to see results." onReset={reset} />
      )}
      {d && d.asOf !== null && d.kpis.total > 0 && (
        <>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(5,1fr)' } }}>
            <KpiCard label="Total employees" value={String(d.kpis.total)} hint={`As of ${d.asOf}`} icon={PeopleIcon} />
            <KpiCard label="Present" value={String(d.kpis.present)} hint={`As of ${d.asOf}`} icon={HowToRegIcon} tone="success" />
            <KpiCard label="Absent" value={String(d.kpis.absent)} hint={`As of ${d.asOf}`} icon={PersonOffIcon} tone="error" />
            <KpiCard label="On leave" value={String(d.kpis.onLeave)} hint={`As of ${d.asOf}`} icon={BeachIcon} tone="info" />
            <KpiCard label="Attendance rate" value={`${d.kpis.attendanceRate.toFixed(1)}%`} hint="Present ÷ (present + absent), whole range" icon={PercentIcon} />
          </Box>
          <AttendanceTrend data={d.trend} />
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <DistributionBar title="Employees by department" data={d.byDepartment} />
            <DistributionBar title="Employees by location" data={d.byLocation} colorIndex={2} />
          </Box>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <StatusDonut data={d.byStatus} total={d.kpis.total} />
            <ActivityFeed items={d.recentActivity} />
          </Box>
        </>
      )}
    </>
  );
}
