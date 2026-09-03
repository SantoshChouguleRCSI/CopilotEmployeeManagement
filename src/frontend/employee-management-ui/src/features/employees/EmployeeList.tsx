import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Add, Apartment, ArrowBackIosNew, ArrowForwardIos, Brightness4, Brightness7,
  DeleteOutlined, DownloadOutlined, EditOutlined, FileDownloadOutlined, FilterList,
  Menu as MenuIcon, MoreVert, NotificationsNone, PeopleAltOutlined, Search,
  SettingsOutlined, ShowChartOutlined, Sort,
} from '@mui/icons-material';
import {
  Alert, AppBar, Avatar, Box, Button, Chip, CssBaseline, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Divider, Drawer, IconButton,
  InputAdornment, LinearProgress, List, ListItemButton, ListItemIcon,
  ListItemText, Menu, MenuItem, Paper, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, ThemeProvider, Toolbar,
  Tooltip, Typography, createTheme,
} from '@mui/material';
import type { Employee } from '../../models/employee';
import { downloadEmployeesCsv } from './employeeCsv';
import { useEmployees } from './hooks/useEmployees';

interface Props {
  onEdit: (id: string) => void;
  onAdd: () => void;
}

type StatusFilter = 'all' | 'active' | 'inactive';

const navigationItems = [
  { label: 'Employees', icon: <PeopleAltOutlined />, selected: true, to: '/employees' },
  { label: 'Departments', icon: <Apartment />, to: '/departments' },
  { label: 'Reports', icon: <ShowChartOutlined /> },
  { label: 'Export Data', icon: <FileDownloadOutlined /> },
  { label: 'Settings', icon: <SettingsOutlined /> },
];

function employeeInitials(employee: Employee): string {
  return `${employee.firstName[0] ?? ''}${employee.lastName[0] ?? ''}`.toUpperCase();
}

export function EmployeeList({ onEdit, onAdd }: Props) {
  const { employees, loading, error, search, setSearch, remove } = useEmployees();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);
  const displayedEmployees = employees.filter(employee => statusFilter === 'all' || employee.isActive === (statusFilter === 'active'));
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1769e8' },
      background: { default: darkMode ? '#101827' : '#f8fafc', paper: darkMode ? '#172033' : '#ffffff' },
    },
    shape: { borderRadius: 8 },
    typography: { fontFamily: 'Manrope, "Segoe UI", sans-serif', button: { fontWeight: 700, textTransform: 'none' } },
  });
  const navigation = (
    <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', p: 1.5 }}>
      <List disablePadding sx={{ display: 'grid', gap: 0.5 }}>
        {navigationItems.map(item => (
          <ListItemButton component={item.to ? RouterLink : 'button'} key={item.label} selected={item.selected} sx={{ borderRadius: 1, minHeight: 42, '&.Mui-selected': { bgcolor: '#eaf1ff', color: 'primary.main' } }} to={item.to}>
            <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontSize: 13, fontWeight: item.selected ? 700 : 600 } } }} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: 'auto' }}>
        <Paper variant="outlined" sx={{ mb: 2, p: 1.25, textAlign: 'center' }}>
          <Stack spacing={0.75} sx={{ alignItems: 'center' }}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <Brightness7 fontSize="small" color="action" />
              <IconButton aria-label="Toggle color mode" color="primary" onClick={() => setDarkMode(current => !current)} size="small">{darkMode ? <Brightness7 /> : <Brightness4 />}</IconButton>
              <Brightness4 fontSize="small" color="action" />
            </Stack>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>{darkMode ? 'Dark' : 'Light'}</Typography>
          </Stack>
        </Paper>
        <Divider />
        <List disablePadding sx={{ mt: 1 }}><ListItemButton sx={{ borderRadius: 1 }}><ListItemIcon sx={{ minWidth: 34 }}><DownloadOutlined /></ListItemIcon><ListItemText primary="Logout" slotProps={{ primary: { sx: { fontSize: 13, fontWeight: 600 } } }} /></ListItemButton></List>
      </Box>
    </Box>
  );

  const confirmDelete = async () => {
    if (!employeeToDelete) return;

    setDeleting(true);
    try {
      await remove(employeeToDelete.id);
      setEmployeeToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const selectStatusFilter = (filter: StatusFilter) => {
    setStatusFilter(filter);
    setFilterAnchor(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar color="inherit" elevation={0} position="fixed" sx={{ zIndex: themeValue => themeValue.zIndex.drawer + 1, borderBottom: 1, borderColor: 'divider' }}>
          <Toolbar sx={{ minHeight: '64px !important', gap: 1.5 }}>
            <IconButton aria-label="Open navigation" onClick={() => setMobileNavigationOpen(true)} sx={{ display: { md: 'none' } }}><MenuIcon /></IconButton>
            <MenuIcon sx={{ display: { xs: 'none', md: 'block' }, color: 'text.secondary' }} />
            <Typography color="text.primary" sx={{ fontSize: 16, fontWeight: 800 }}>Employee Management</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton aria-label="Notifications" size="small"><NotificationsNone /></IconButton>
            <Avatar sx={{ bgcolor: '#4f70db', height: 34, ml: 1, width: 34, fontSize: 12 }}>SC</Avatar>
            <Typography color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' }, fontSize: 13 }}>Santosh Chougule</Typography>
            <MoreVert fontSize="small" color="action" />
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, width: 220, flexShrink: 0, '& .MuiDrawer-paper': { boxSizing: 'border-box', mt: '64px', width: 220, height: 'calc(100% - 64px)' } }}>{navigation}</Drawer>
        <Drawer open={mobileNavigationOpen} onClose={() => setMobileNavigationOpen(false)} sx={{ display: { md: 'none' }, '& .MuiDrawer-paper': { width: 270 } }}>{navigation}</Drawer>
        <Box component="main" sx={{ flexGrow: 1, minWidth: 0, pt: 8, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ maxWidth: 920, mx: 'auto', width: '100%', px: { xs: 2, sm: 4 }, py: { xs: 3, sm: 5 } }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', mb: 4 }}>
              <Box><Typography color="text.primary" sx={{ fontSize: 27, fontWeight: 700 }}>Employees</Typography><Typography color="text.secondary" sx={{ mt: 0.25, fontSize: 13 }}>Manage and view all employee information</Typography></Box>
              <Stack direction="row" spacing={1.25}><Button onClick={onAdd} startIcon={<Add />} variant="contained">Add Employee</Button></Stack>
            </Stack>
            <Paper elevation={0} sx={{ overflow: 'hidden', border: 1, borderColor: 'divider', boxShadow: '0 3px 8px rgba(15, 23, 42, 0.06)' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', p: 1.75, borderBottom: 1, borderColor: 'divider' }}>
                <TextField aria-label="Search employees" onChange={event => setSearch(event.target.value)} placeholder="Search by name or email..." size="small" slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> } }} value={search} sx={{ width: { xs: '100%', sm: 330 }, '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }} />
                <Stack direction="row" spacing={1}>
                  <Button aria-controls={filterAnchor ? 'filter-menu' : undefined} aria-expanded={Boolean(filterAnchor)} onClick={event => setFilterAnchor(event.currentTarget)} startIcon={<FilterList />} variant="outlined">Filter</Button>
                  <Button disabled={loading || error !== null || displayedEmployees.length === 0} onClick={() => downloadEmployeesCsv(displayedEmployees)} startIcon={<FileDownloadOutlined />} variant="outlined">Export Employees</Button>
                  <Menu anchorEl={filterAnchor} id="filter-menu" onClose={() => setFilterAnchor(null)} open={Boolean(filterAnchor)}><MenuItem onClick={() => selectStatusFilter('all')}>All employees</MenuItem><MenuItem onClick={() => selectStatusFilter('active')}>Active employees</MenuItem><MenuItem onClick={() => selectStatusFilter('inactive')}>Inactive employees</MenuItem></Menu>
                </Stack>
              </Stack>
              {loading && <LinearProgress />}
              {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
              {!loading && !error && (
                <TableContainer><Table aria-label="Employee directory" sx={{ minWidth: 740 }}><TableHead><TableRow sx={{ '& .MuiTableCell-root': { bgcolor: 'action.hover', borderColor: 'divider', color: 'text.secondary', fontSize: 12, fontWeight: 800, py: 1.75 } }}><TableCell>Name <Sort sx={{ verticalAlign: 'middle', fontSize: 15 }} /></TableCell><TableCell>Department</TableCell><TableCell>Job Title</TableCell><TableCell>Salary</TableCell><TableCell>Status</TableCell><TableCell align="center">Actions</TableCell></TableRow></TableHead><TableBody>{displayedEmployees.map(employee => <TableRow hover key={employee.id} sx={{ '& .MuiTableCell-root': { borderColor: 'divider', py: 1.75 } }}><TableCell><Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}><Avatar sx={{ bgcolor: '#4f70db', height: 35, width: 35, fontSize: 12, fontWeight: 700 }}>{employeeInitials(employee)}</Avatar><Box><Typography color="text.primary" sx={{ fontSize: 13, fontWeight: 800 }}>{employee.firstName} {employee.lastName}</Typography><Typography color="text.secondary" sx={{ fontSize: 11 }}>{employee.email}</Typography></Box></Stack></TableCell><TableCell sx={{ fontSize: 12 }}>{employee.department}</TableCell><TableCell sx={{ fontSize: 12 }}>{employee.jobTitle}</TableCell><TableCell sx={{ fontSize: 12 }}>${employee.salary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell><TableCell><Chip color={employee.isActive ? 'success' : 'default'} label={employee.isActive ? 'Active' : 'Inactive'} size="small" sx={{ fontSize: 11, height: 23 }} /></TableCell><TableCell align="center"><Tooltip title="Edit employee"><IconButton aria-label={`Edit ${employee.firstName} ${employee.lastName}`} onClick={() => onEdit(employee.id)} size="small"><EditOutlined fontSize="small" /></IconButton></Tooltip><Tooltip title="Delete employee"><IconButton aria-label={`Delete ${employee.firstName} ${employee.lastName}`} color="error" onClick={() => setEmployeeToDelete(employee)} size="small"><DeleteOutlined fontSize="small" /></IconButton></Tooltip></TableCell></TableRow>)}</TableBody></Table>{displayedEmployees.length === 0 && <Typography color="text.secondary" sx={{ px: 2, py: 4, textAlign: 'center' }}>No employees found.</Typography>}</TableContainer>
              )}
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', borderTop: 1, borderColor: 'divider', px: 2, py: 1.25 }}><Typography color="text.secondary" sx={{ fontSize: 12 }}>Rows per page: <strong>10</strong></Typography><Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}><Typography color="text.secondary" sx={{ fontSize: 12 }}>1-{displayedEmployees.length} of {displayedEmployees.length}</Typography><IconButton aria-label="Previous page" disabled size="small"><ArrowBackIosNew fontSize="inherit" /></IconButton><Chip color="primary" label="1" size="small" /><IconButton aria-label="Next page" disabled size="small"><ArrowForwardIos fontSize="inherit" /></IconButton></Stack></Stack>
            </Paper>
            <Dialog aria-labelledby="delete-employee-title" onClose={deleting ? undefined : () => setEmployeeToDelete(null)} open={employeeToDelete !== null}>
              <DialogTitle id="delete-employee-title">Delete Employee</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete user {employeeToDelete?.firstName} {employeeToDelete?.lastName}?
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button disabled={deleting} onClick={() => setEmployeeToDelete(null)}>Cancel</Button>
                <Button color="error" disabled={deleting} onClick={confirmDelete} variant="contained">{deleting ? 'Deleting...' : 'Delete'}</Button>
              </DialogActions>
            </Dialog>
          </Box>
          <Typography color="text.secondary" sx={{ mt: 'auto', pb: 2.5, textAlign: 'center', fontSize: 12 }}>© 2026 Employee Management System. All rights reserved.</Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}