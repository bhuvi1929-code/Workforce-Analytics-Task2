import { Alert, Box, Button, Skeleton, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

export function DashboardSkeleton() {
  return (
    <Box role="status" aria-busy="true" aria-label="Loading dashboard" sx={{ display: 'grid', gap: 2 }}>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(5,1fr)' } }}>
        {Array.from({ length: 5 }, (_, i) => <Skeleton key={i} variant="rounded" height={104} />)}
      </Box>
      <Skeleton variant="rounded" height={320} />
      <Skeleton variant="rounded" height={280} />
    </Box>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Alert severity="error" action={<Button color="inherit" size="small" onClick={onRetry}>Retry</Button>}>
      {message}
    </Alert>
  );
}

export function EmptyState({ title, hint, onReset }: { title: string; hint: string; onReset?: () => void }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
      <SearchOffIcon color="disabled" sx={{ fontSize: 48 }} />
      <Typography variant="h6" sx={{ mt: 1 }}>{title}</Typography>
      <Typography color="text.secondary" sx={{ mb: onReset ? 2 : 0 }}>{hint}</Typography>
      {onReset && <Button variant="contained" onClick={onReset}>Reset filters</Button>}
    </Box>
  );
}
