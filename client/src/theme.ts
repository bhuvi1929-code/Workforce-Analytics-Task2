import { createTheme, type PaletteMode } from '@mui/material';

export const buildTheme = (mode: PaletteMode) =>
  createTheme({
    palette: mode === 'light' ? {
      mode,
      primary: { main: '#635BFF', dark: '#4F46E5', light: '#8B85FF', contrastText: '#FFFFFF' },
      secondary: { main: '#F97316' },
      info: { main: '#0EA5E9' },
      success: { main: '#10B981' },
      warning: { main: '#F59E0B' },
      background: { default: '#F6F7FB', paper: '#FFFFFF' },
      divider: '#E8EAF2',
      text: { primary: '#182230', secondary: '#788397' },
    } : {
      mode,
      primary: { main: '#9A94FF', dark: '#746CFF', light: '#BBB7FF', contrastText: '#111827' },
      secondary: { main: '#FB923C' },
      info: { main: '#38BDF8' },
      success: { main: '#34D399' },
      warning: { main: '#FBBF24' },
      background: { default: '#101321', paper: '#191D2E' },
      divider: '#2A3045',
      text: { primary: '#F1F3FA', secondary: '#A3ABC0' },
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
      h5: { fontWeight: 800, letterSpacing: '-0.035em' },
      h6: { fontWeight: 750, fontSize: '1rem', letterSpacing: '-0.015em' },
      body1: { lineHeight: 1.6 },
      button: { textTransform: 'none', fontWeight: 700 },
    },
    components: {
      MuiCssBaseline: { styleOverrides: {
        body: { backgroundImage: mode === 'light' ? 'radial-gradient(ellipse at 80% 0%, rgba(99,91,255,0.055), transparent 35%)' : 'none' },
        '*': { boxSizing: 'border-box' },
        '@media (prefers-reduced-motion: reduce)': { '*': { transition: 'none !important', animation: 'none !important' } },
      } },
      MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: {
        root: { backgroundImage: 'none', border: '1px solid', borderColor: mode === 'light' ? '#E8EAF2' : '#2A3045', boxShadow: mode === 'light' ? '0 5px 24px rgba(25, 35, 75, 0.035)' : '0 8px 28px rgba(0,0,0,0.12)' },
      } },
      MuiButton: { styleOverrides: { root: { borderRadius: 10, paddingInline: 16 } } },
      MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 10, backgroundColor: mode === 'light' ? '#FFFFFF' : '#15192A' } } },
      MuiListItemButton: { styleOverrides: { root: { transition: 'all .18s ease', '&.Mui-selected': { backgroundColor: mode === 'light' ? '#EEEDFF' : '#302D54', color: mode === 'light' ? '#5147E8' : '#C3BFFF' }, '&.Mui-selected:hover': { backgroundColor: mode === 'light' ? '#E5E3FF' : '#393561' } } } },
    },
  });
