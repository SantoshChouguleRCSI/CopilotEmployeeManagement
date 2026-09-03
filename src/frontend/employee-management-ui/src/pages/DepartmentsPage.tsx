import { Apartment, Menu as MenuIcon } from '@mui/icons-material';
import { AppBar, Box, CssBaseline, IconButton, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import { DepartmentList } from '../features/departments/DepartmentList';

const theme = createTheme({
  palette: { primary: { main: '#1769e8' }, background: { default: '#f8fafc', paper: '#ffffff' } },
  shape: { borderRadius: 8 },
  typography: { fontFamily: 'Manrope, "Segoe UI", sans-serif', button: { fontWeight: 700, textTransform: 'none' } },
});

export function DepartmentsPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar color="inherit" elevation={0} position="fixed" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ minHeight: '64px !important', gap: 1.5 }}><IconButton aria-label="Open navigation"><MenuIcon /></IconButton><Apartment color="primary" /><Typography sx={{ fontSize: 16, fontWeight: 800 }}>Employee Management</Typography></Toolbar>
      </AppBar>
      <Box component="main" sx={{ minHeight: '100vh', pt: 8, bgcolor: 'background.default' }}><DepartmentList /></Box>
    </ThemeProvider>
  );
}