import { useRef, useState, type ReactNode } from 'react';
import {
  AppBar, Avatar, Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText,
  Menu, Toolbar, Tooltip, Typography, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/SpaceDashboardOutlined';
import PeopleIcon from '@mui/icons-material/PeopleAltOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import { currentUser } from '../../config/currentUser';
import type { Route } from '../../hooks/useHashRoute';

const WIDTH = 240;
const NAV: { route: Route; label: string; icon: ReactNode }[] = [
  { route: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { route: 'employees', label: 'Employees', icon: <PeopleIcon /> },
];
const initials = currentUser.name.split(' ').map((p) => p[0]).join('');

function Nav({ route, onNavigate }: { route: Route; onNavigate: () => void }) {
  return (
    <Box component="nav" aria-label="Main navigation">
      <Toolbar><Typography variant="h6" color="primary">Workforce Analytics</Typography></Toolbar>
      <List sx={{ px: 1 }}>
        {NAV.map((n) => (
          <ListItemButton key={n.route} component="a" href={`#/${n.route}`} selected={route === n.route}
            aria-current={route === n.route ? 'page' : undefined} onClick={onNavigate} sx={{ borderRadius: 1, mb: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 38 }}>{n.icon}</ListItemIcon>
            <ListItemText primary={n.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

interface Props { route: Route; title: string; onToggleMode: () => void; children: ReactNode }

export default function AppShell({ route, title, onToggleMode, children }: Props) {
  const [drawer, setDrawer] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const dark = useTheme().palette.mode === 'dark';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box component="a" href="#main" onClick={(e) => { e.preventDefault(); mainRef.current?.focus(); }}
        sx={{ position: 'absolute', left: -9999, '&:focus': { left: 8, top: 8, zIndex: 2000, bgcolor: 'background.paper', p: 1 } }}>
        Skip to content
      </Box>
      <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, width: WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: WIDTH, boxSizing: 'border-box' } }}>
        <Nav route={route} onNavigate={() => undefined} />
      </Drawer>
      <Drawer open={drawer} onClose={() => setDrawer(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: WIDTH } }}>
        <Nav route={route} onNavigate={() => setDrawer(false)} />
      </Drawer>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Toolbar sx={{ gap: 1 }}>
            <IconButton aria-label="Open navigation" edge="start" onClick={() => setDrawer(true)} sx={{ display: { md: 'none' } }}><MenuIcon /></IconButton>
            <Typography variant="h6" component="p" sx={{ flex: 1 }}>{title}</Typography>
            <Tooltip title={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
              <IconButton aria-label="Toggle light and dark theme" onClick={onToggleMode}>{dark ? <LightModeIcon /> : <DarkModeIcon />}</IconButton>
            </Tooltip>
            <IconButton ref={avatarRef} aria-label="Open profile menu" aria-haspopup="menu" onClick={() => setMenuOpen(true)}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 14 }}>{initials}</Avatar>
            </IconButton>
            <Menu anchorEl={avatarRef.current} open={menuOpen} onClose={() => setMenuOpen(false)}>
              <Box sx={{ px: 2, py: 1, maxWidth: 260 }}>
                <Typography fontWeight={600}>{currentUser.name}</Typography>
                <Typography variant="body2" color="text.secondary">{currentUser.role}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>{currentUser.email}</Typography>
              </Box>
              <Divider />
            </Menu>
          </Toolbar>
        </AppBar>
        <Box component="main" id="main" ref={mainRef} tabIndex={-1} sx={{ p: { xs: 2, md: 3 }, display: 'grid', gap: 2, outline: 'none' }}>{children}</Box>
      </Box>
    </Box>
  );
}
