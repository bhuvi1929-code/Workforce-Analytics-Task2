import { useEffect, useState } from 'react';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterBar from '../components/filters/FilterBar';
import EmployeeTable from '../components/employees/EmployeeTable';
import { EmptyState, ErrorState } from '../components/common/States';
import { useFilters } from '../context/FiltersContext';
import { useAsync } from '../hooks/useAsync';
import { useDebounce } from '../hooks/useDebounce';
import { api } from '../services/api';
import type { EmployeeListQuery } from '../types/api';

export default function EmployeesPage() {
  const { filters, reset } = useFilters();
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 300);
  const [query, setQuery] = useState<EmployeeListQuery>({ search: '', sortBy: 'name', order: 'asc', page: 1, pageSize: 10 });
  const patch = (p: Partial<EmployeeListQuery>) => setQuery((q) => ({ ...q, ...p }));

  useEffect(() => { patch({ search: debounced.trim(), page: 1 }); }, [debounced]);
  useEffect(() => { patch({ page: 1 }); }, [filters]);

  const { state, retry } = useAsync((s) => api.getEmployees(filters, query, s), [filters, query]);
  const total = state.status === 'ready' ? state.data.total : 0;
  const empty = state.status === 'ready' && total === 0;

  return (
    <>
      <Box>
        <Typography variant="h5" component="h1">Employees</Typography>
        <Typography color="text.secondary">Search, sort and filter the employee directory.</Typography>
      </Box>
      <FilterBar showDates={false} />
      <TextField label="Search by name, ID or email" value={search} onChange={(e) => setSearch(e.target.value)} size="small"
        slotProps={{ htmlInput: { maxLength: 100 }, input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }} />
      {state.status === 'error' && <ErrorState message={state.message} onRetry={retry} />}
      {empty && <EmptyState title="No employees found" hint="Try a different search term or clear the filters." onReset={() => { setSearch(''); reset(); }} />}
      {state.status !== 'error' && !empty && (
        <EmployeeTable rows={state.status === 'ready' ? state.data.items : null} total={total} query={query} onQueryChange={patch} />
      )}
    </>
  );
}
