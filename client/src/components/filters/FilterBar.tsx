import { useEffect, useState } from 'react';
import { Button, MenuItem, Paper, TextField } from '@mui/material';
import { useFilters } from '../../context/FiltersContext';
import { api } from '../../services/api';
import { useAsync } from '../../hooks/useAsync';
import type { Filters, Lookups } from '../../types/api';

const EMPTY: Lookups = { departments: [], locations: [], statuses: [] };

/** Keeps a local draft so a half-typed (invalid) date range is never sent to the API. */
export default function FilterBar({ showDates = true }: { showDates?: boolean }) {
  const { filters, setFilters, reset } = useFilters();
  const { state } = useAsync((s) => api.getLookups(s), []);
  const lookups = state.status === 'ready' ? state.data : EMPTY;
  const [draft, setDraft] = useState<Filters>(filters);
  useEffect(() => setDraft(filters), [filters]);

  const rangeInvalid = draft.from > draft.to;
  const update = (patch: Partial<Filters>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    if (next.from && next.to && next.from <= next.to) setFilters(next);
  };
  const cols = showDates ? 'repeat(5,1fr) auto' : 'repeat(3,1fr) auto';

  return (
    <Paper component="form" role="search" aria-label="Filters" onSubmit={(e) => e.preventDefault()}
      sx={{ p: 2, display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: cols }, alignItems: 'start' }}>
      {showDates && (
        <>
          <TextField size="small" type="date" label="From" value={draft.from} error={rangeInvalid}
            helperText={rangeInvalid ? 'Start must be on or before end' : ' '}
            slotProps={{ inputLabel: { shrink: true } }} onChange={(e) => update({ from: e.target.value })} />
          <TextField size="small" type="date" label="To" value={draft.to} error={rangeInvalid}
            helperText=" " slotProps={{ inputLabel: { shrink: true } }} onChange={(e) => update({ to: e.target.value })} />
        </>
      )}
      <TextField select size="small" label="Department" value={draft.departmentId} helperText=" "
        onChange={(e) => update({ departmentId: e.target.value === 'All' ? 'All' : Number(e.target.value) })}>
        <MenuItem value="All">All</MenuItem>
        {lookups.departments.map((d) => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
      </TextField>
      <TextField select size="small" label="Location" value={draft.location} helperText=" " onChange={(e) => update({ location: e.target.value })}>
        <MenuItem value="All">All</MenuItem>
        {lookups.locations.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
      </TextField>
      <TextField select size="small" label="Employee status" value={draft.status} helperText=" "
        onChange={(e) => update({ status: e.target.value as Filters['status'] })}>
        <MenuItem value="All">All</MenuItem>
        {lookups.statuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
      </TextField>
      <Button onClick={reset} sx={{ mt: 0.25 }}>Reset</Button>
    </Paper>
  );
}
