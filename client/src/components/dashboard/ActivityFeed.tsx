import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@mui/material';
import type { Activity } from '../../types/api';

const initials = (n: string) => n.split(' ').map((p) => p[0]).join('').slice(0, 2);
const text = (a: Activity) =>
  a.status === 'Present' ? `Checked in${a.checkIn ? ` at ${a.checkIn}` : ''}` : a.status === 'Absent' ? 'Marked absent' : 'On approved leave';
const day = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' });

export default function ActivityFeed({ items }: { items: Activity[] }) {
  return (
    <Paper component="section" aria-label="Recent employee activity" sx={{ p: 2 }}>
      <Typography variant="h6" component="h2">Recent activity</Typography>
      {items.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 3 }}>No attendance activity in this date range.</Typography>
      ) : (
        <List disablePadding>
          {items.map((a) => (
            <ListItem key={a.id} disableGutters divider>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', width: 36, height: 36, fontSize: 14 }}>{initials(a.employeeName)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={`${a.employeeName}: ${text(a)}`} secondary={`${a.department}, ${day(a.date)}`} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
