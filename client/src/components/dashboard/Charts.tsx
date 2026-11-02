import type { ReactNode } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import type { Distribution, TrendPoint } from '../../types/api';

function ChartCard({ title, summary, children }: { title: string; summary: string; children: ReactNode }) {
  return (
    <Paper component="section" aria-label={title} sx={{ p: 2 }}>
      <Typography variant="h6" component="h2" sx={{ mb: 1.5 }}>{title}</Typography>
      <Box role="img" aria-label={summary} sx={{ height: 280 }}>{children}</Box>
    </Paper>
  );
}

function useChartStyles() {
  const t = useTheme();
  return {
    tooltip: { background: t.palette.background.paper, border: `1px solid ${t.palette.divider}`, borderRadius: 8, color: t.palette.text.primary },
    axis: { fill: t.palette.text.secondary, fontSize: 12 },
    grid: t.palette.divider,
    series: [t.palette.primary.main, t.palette.secondary.main, t.palette.info.main],
    hover: t.palette.action.hover,
  };
}
const short = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const describe = (d: Distribution[]) => d.map((x) => `${x.label} ${x.value}`).join(', ');

export function AttendanceTrend({ data }: { data: TrendPoint[] }) {
  const s = useChartStyles();
  return (
    <ChartCard title="Attendance trend" summary={`Daily present, absent and on-leave counts across ${data.length} working days`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
          <CartesianGrid stroke={s.grid} vertical={false} />
          <XAxis dataKey="date" tickFormatter={short} tick={s.axis} minTickGap={24} />
          <YAxis tick={s.axis} />
          <Tooltip contentStyle={s.tooltip} labelFormatter={short} />
          <Legend />
          <Area type="monotone" dataKey="present" name="Present" stackId="a" stroke={s.series[0]} fill={s.series[0]} fillOpacity={0.35} />
          <Area type="monotone" dataKey="onLeave" name="On leave" stackId="a" stroke={s.series[2]} fill={s.series[2]} fillOpacity={0.35} />
          <Area type="monotone" dataKey="absent" name="Absent" stackId="a" stroke={s.series[1]} fill={s.series[1]} fillOpacity={0.35} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function DistributionBar({ title, data, colorIndex = 0 }: { title: string; data: Distribution[]; colorIndex?: number }) {
  const s = useChartStyles();
  return (
    <ChartCard title={title} summary={describe(data)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid stroke={s.grid} horizontal={false} />
          <XAxis type="number" tick={s.axis} allowDecimals={false} />
          <YAxis type="category" dataKey="label" tick={s.axis} width={110} />
          <Tooltip contentStyle={s.tooltip} cursor={{ fill: s.hover }} />
          <Bar dataKey="value" name="Employees" fill={s.series[colorIndex % s.series.length]} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function StatusDonut({ data, total }: { data: Distribution[]; total: number }) {
  const s = useChartStyles();
  return (
    <ChartCard title="Employees by status" summary={describe(data)}>
      <Box sx={{ position: 'relative', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" innerRadius="58%" outerRadius="82%" paddingAngle={2} stroke="none">
              {data.map((d, i) => <Cell key={d.label} fill={s.series[i % s.series.length]} />)}
            </Pie>
            <Tooltip contentStyle={s.tooltip} />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
        <Box sx={{ position: 'absolute', top: '38%', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
          <Typography variant="h5" component="p" sx={{ lineHeight: 1 }}>{total}</Typography>
          <Typography variant="caption" color="text.secondary">employees</Typography>
        </Box>
      </Box>
    </ChartCard>
  );
}
