import { Chip, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from '@mui/material';
import type { Employee, EmployeeListQuery, EmployeeStatus, SortField } from '../../types/api';

type Breakpoint = 'sm' | 'md';
const COLUMNS: { id: SortField; label: string; hideBelow?: Breakpoint }[] = [
  { id: 'name', label: 'Employee' },
  { id: 'code', label: 'ID', hideBelow: 'sm' },
  { id: 'department', label: 'Department' },
  { id: 'location', label: 'Location', hideBelow: 'md' },
  { id: 'status', label: 'Status' },
  { id: 'joinedOn', label: 'Joined', hideBelow: 'md' },
];
const hide = (b?: Breakpoint) => (b ? { display: { xs: 'none', [b]: 'table-cell' } } : undefined);
const TONE: Record<EmployeeStatus, 'success' | 'warning' | 'default'> = { Active: 'success', Probation: 'warning', 'Notice period': 'default' };

interface Props {
  rows: Employee[] | null; // null while loading
  total: number;
  query: EmployeeListQuery;
  onQueryChange: (patch: Partial<EmployeeListQuery>) => void;
}

export default function EmployeeTable({ rows, total, query, onQueryChange }: Props) {
  return (
    <Paper>
      <TableContainer>
        <Table size="small" aria-label="Employees">
          <TableHead>
            <TableRow>
              {COLUMNS.map((c) => (
                <TableCell key={c.id} sx={hide(c.hideBelow)} sortDirection={query.sortBy === c.id ? query.order : false}>
                  <TableSortLabel active={query.sortBy === c.id} direction={query.sortBy === c.id ? query.order : 'asc'}
                    onClick={() => onQueryChange({ sortBy: c.id, order: query.sortBy === c.id && query.order === 'asc' ? 'desc' : 'asc', page: 1 })}>
                    {c.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows === null
              ? Array.from({ length: Math.min(query.pageSize, 8) }, (_, i) => (
                  <TableRow key={i}>{COLUMNS.map((c) => <TableCell key={c.id} sx={hide(c.hideBelow)}><Skeleton /></TableCell>)}</TableRow>
                ))
              : rows.map((e) => (
                  <TableRow key={e.id} hover>
                    <TableCell>{e.name}<br /><small style={{ opacity: 0.7 }}>{e.email}</small></TableCell>
                    <TableCell sx={hide('sm')}>{e.code}</TableCell>
                    <TableCell>{e.department}</TableCell>
                    <TableCell sx={hide('md')}>{e.location}</TableCell>
                    <TableCell><Chip size="small" label={e.status} color={TONE[e.status]} variant="outlined" /></TableCell>
                    <TableCell sx={hide('md')}>{e.joinedOn}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination component="div" count={total} page={query.page - 1} rowsPerPage={query.pageSize} rowsPerPageOptions={[10, 25, 50]}
        onPageChange={(_, p) => onQueryChange({ page: p + 1 })}
        onRowsPerPageChange={(e) => onQueryChange({ pageSize: Number(e.target.value), page: 1 })} />
    </Paper>
  );
}
