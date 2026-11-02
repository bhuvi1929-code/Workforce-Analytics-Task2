import type { ElementType } from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface Props { label: string; value: string; hint: string; icon: ElementType; tone?: 'primary' | 'success' | 'error' | 'info' }

export default function KpiCard({ label, value, hint, icon: Icon, tone = 'primary' }: Props) {
  return (
    <Paper component="article" aria-label={label} sx={{ p: 2, display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
      <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'action.hover', color: `${tone}.main`, display: 'flex' }}><Icon fontSize="small" /></Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary" noWrap>{label}</Typography>
        <Typography variant="h5" component="p" sx={{ lineHeight: 1.2 }}>{value}</Typography>
        <Typography variant="caption" color="text.secondary">{hint}</Typography>
      </Box>
    </Paper>
  );
}
