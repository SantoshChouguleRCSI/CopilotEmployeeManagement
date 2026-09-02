import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Apartment, ArrowBack, Brightness4, Brightness7, EditOutlined, Menu as MenuIcon,
  MoreVert, NotificationsNone, PeopleAltOutlined, PersonAddAlt1Outlined, SaveOutlined,
} from '@mui/icons-material';
import {
  Alert, AppBar, Avatar, Box, Breadcrumbs, Button, CircularProgress, CssBaseline,
  Divider, Drawer, IconButton, InputAdornment, List, ListItemButton, ListItemIcon,
  ListItemText, MenuItem, Paper, Stack, TextField, ThemeProvider, Toolbar, Tooltip,
  Typography, createTheme,
} from '@mui/material';
import { createEmployee, getEmployee, updateEmployee } from '../../api/employeeApi';
import type { CreateEmployeeRequest, UpdateEmployeeRequest } from '../../models/employee';

interface Props {
  employeeId?: string;
  onSaved: () => void;
  onCancel: () => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  jobTitle: string;
  salary: string;
  dateOfJoining: string;
}

const emptyForm: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
  jobTitle: '',
  salary: '',
  dateOfJoining: '',
};

const departments = ['Engineering', 'Human Resources', 'Finance', 'Marketing', 'Sales', 'IT', 'Operations'];

const navigationItems = [
  { label: 'Employees', icon: <PeopleAltOutlined />, selected: true },
  { label: 'Departments', icon: <Apartment />, selected: false },
];

export function EmployeeForm({ employeeId, onSaved, onCancel }: Props) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const isEdit = employeeId !== undefined;
  const pageTitle = isEdit ? 'Edit Employee' : 'Add Employee';
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1769e8' },
      background: { default: darkMode ? '#101827' : '#f8fafc', paper: darkMode ? '#172033' : '#ffffff' },
    },
    shape: { borderRadius: 8 },
    typography: { fontFamily: 'Manrope, "Segoe UI", sans-serif', button: { fontWeight: 700, textTransform: 'none' } },
  });

  useEffect(() => {
    if (!employeeId) return;
    setLoadError(null);
    getEmployee(employeeId)
      .then(emp =>
        setForm({
          firstName: emp.firstName,
          lastName: emp.lastName,
          email: emp.email,
          department: emp.department,
          jobTitle: emp.jobTitle,
          salary: emp.salary.toString(),
          dateOfJoining: emp.dateOfJoining,
        })
      )
      .catch(e => setLoadError(e instanceof Error ? e.message : 'Failed to load employee'));
  }, [employeeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (isEdit) {
        const req: UpdateEmployeeRequest = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          department: form.department,
          jobTitle: form.jobTitle,
          salary: parseFloat(form.salary),
        };
        await updateEmployee(employeeId, req);
      } else {
        const req: CreateEmployeeRequest = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          department: form.department,
          jobTitle: form.jobTitle,
          salary: parseFloat(form.salary),
          dateOfJoining: form.dateOfJoining,
        };
        await createEmployee(req);
      }
      onSaved();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Failed to save employee');
    } finally {
      setSubmitting(false);
    }
  };

  const navigation = (
    <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', p: 1.5 }}>
      <List disablePadding sx={{ display: 'grid', gap: 0.5 }}>
        {navigationItems.map(item => (
          <ListItemButton component={item.selected ? RouterLink : 'button'} key={item.label} selected={item.selected} sx={{ borderRadius: 1, minHeight: 42, '&.Mui-selected': { bgcolor: '#eaf1ff', color: 'primary.main' } }} to={item.selected ? '/employees' : undefined}>
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
      </Box>
    </Box>
  );

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
            <Tooltip title="Notifications"><IconButton aria-label="Notifications" size="small"><NotificationsNone /></IconButton></Tooltip>
            <Avatar sx={{ bgcolor: '#4f70db', height: 34, ml: 1, width: 34, fontSize: 12 }}>SC</Avatar>
            <Typography color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' }, fontSize: 13 }}>Santosh Chougule</Typography>
            <MoreVert fontSize="small" color="action" />
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, width: 220, flexShrink: 0, '& .MuiDrawer-paper': { boxSizing: 'border-box', mt: '64px', width: 220, height: 'calc(100% - 64px)' } }}>{navigation}</Drawer>
        <Drawer open={mobileNavigationOpen} onClose={() => setMobileNavigationOpen(false)} sx={{ display: { md: 'none' }, '& .MuiDrawer-paper': { width: 270 } }}>{navigation}</Drawer>
        <Box component="main" sx={{ flexGrow: 1, minWidth: 0, pt: 8 }}>
          <Box sx={{ maxWidth: 720, mx: 'auto', width: '100%', px: { xs: 2, sm: 4 }, py: { xs: 3, sm: 5 } }}>
            <Breadcrumbs aria-label="Breadcrumb" separator="›" sx={{ mb: 1.5, '& .MuiTypography-root, & .MuiLink-root': { fontSize: 12 } }}>
              <Typography component={RouterLink} to="/employees" color="primary" sx={{ textDecoration: 'none' }}>Employees</Typography>
              <Typography color="text.secondary">{pageTitle}</Typography>
            </Breadcrumbs>
            <Paper component="form" elevation={0} onSubmit={handleSubmit} sx={{ overflow: 'hidden', border: 1, borderColor: 'divider', boxShadow: '0 3px 8px rgba(15, 23, 42, 0.06)' }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center', p: { xs: 2.5, sm: 3.5 }, pb: 2.5 }}>
                <Avatar sx={{ bgcolor: 'primary.main', height: 48, width: 48 }}>
                  {isEdit ? <EditOutlined /> : <PersonAddAlt1Outlined />}
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: 20, fontWeight: 800 }}>{pageTitle}</Typography>
                  <Typography color="text.secondary" sx={{ fontSize: 13 }}>{isEdit ? 'Update employee information' : 'Fill in the details to add a new employee'}</Typography>
                </Box>
              </Stack>
              <Divider />
              <Stack spacing={2.25} sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                {loadError && <Alert severity="error">{loadError}</Alert>}
                {submitError && <Alert severity="error">{submitError}</Alert>}
                <TextField autoFocus fullWidth label="First Name" name="firstName" onChange={handleChange} required value={form.firstName} />
                <TextField fullWidth label="Last Name" name="lastName" onChange={handleChange} required value={form.lastName} />
                <TextField fullWidth label="Email" name="email" onChange={handleChange} required type="email" value={form.email} />
                <TextField fullWidth label="Department" name="department" onChange={handleChange} required select value={form.department}>
                  {departments.map(department => <MenuItem key={department} value={department}>{department}</MenuItem>)}
                </TextField>
                <TextField fullWidth label="Job Title" name="jobTitle" onChange={handleChange} required value={form.jobTitle} />
                <TextField fullWidth label="Salary" name="salary" onChange={handleChange} required slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> }, htmlInput: { min: 0, step: '0.01' } }} type="number" value={form.salary} />
                <TextField fullWidth label="Date of Joining" name="dateOfJoining" onChange={handleChange} required slotProps={{ inputLabel: { shrink: true } }} type="date" value={form.dateOfJoining} disabled={isEdit} />
              </Stack>
              <Divider />
              <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', p: 2.25 }}>
                <Button disabled={submitting} onClick={onCancel} startIcon={<ArrowBack />} variant="outlined">Cancel</Button>
                <Button disabled={submitting || !!loadError} startIcon={submitting ? <CircularProgress color="inherit" size={17} /> : <SaveOutlined />} type="submit" variant="contained">{submitting ? 'Saving...' : isEdit ? 'Update Employee' : 'Save Employee'}</Button>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
