import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Add, Apartment, DeleteOutlined, EditOutlined, PeopleAltOutlined } from '@mui/icons-material';
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton,
  LinearProgress, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, Tooltip, Typography,
} from '@mui/material';
import { createDepartment, deleteDepartment, getDepartments, updateDepartment } from '../../api/departmentApi';
import type { Department, DepartmentRequest } from '../../models/department';

const emptyForm: DepartmentRequest = { name: '', description: '' };

export function DepartmentList() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [departmentToEdit, setDepartmentToEdit] = useState<Department | null>(null);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const [form, setForm] = useState<DepartmentRequest>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      setDepartments(await getDepartments());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load departments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadDepartments(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setDepartmentToEdit({} as Department);
  };

  const openEdit = (department: Department) => {
    setForm({ name: department.name, description: department.description });
    setDepartmentToEdit(department);
  };

  const saveDepartment = async () => {
    setSaving(true);
    setError(null);
    try {
      if (departmentToEdit?.id) {
        const updated = await updateDepartment(departmentToEdit.id, form);
        setDepartments(current => current.map(department => department.id === updated.id ? updated : department));
      } else {
        const created = await createDepartment(form);
        setDepartments(current => [...current, created]);
      }
      setDepartmentToEdit(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save department.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!departmentToDelete) return;

    setDeleting(true);
    setError(null);
    try {
      await deleteDepartment(departmentToDelete.id);
      setDepartments(current => current.filter(department => department.id !== departmentToDelete.id));
      setDepartmentToDelete(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete department.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 920, mx: 'auto', width: '100%', px: { xs: 2, sm: 4 }, py: { xs: 3, sm: 5 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography sx={{ fontSize: 27, fontWeight: 700 }}>Departments</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.25, fontSize: 13 }}>Manage the departments in your organization</Typography>
        </Box>
        <Button onClick={openCreate} startIcon={<Add />} variant="contained">Add Department</Button>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button component={RouterLink} size="small" startIcon={<PeopleAltOutlined />} to="/employees" variant="text">Employees</Button>
        <Button component={RouterLink} size="small" startIcon={<Apartment />} to="/departments" variant="text">Departments</Button>
      </Stack>
      {error && <Alert onClose={() => setError(null)} severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper elevation={0} sx={{ overflow: 'hidden', border: 1, borderColor: 'divider', boxShadow: '0 3px 8px rgba(15, 23, 42, 0.06)' }}>
        {loading && <LinearProgress />}
        <TableContainer>
          <Table aria-label="Department directory" sx={{ minWidth: 620 }}>
            <TableHead><TableRow sx={{ '& .MuiTableCell-root': { bgcolor: 'action.hover', color: 'text.secondary', fontSize: 12, fontWeight: 800, py: 1.75 } }}><TableCell>Name</TableCell><TableCell>Description</TableCell><TableCell>Last Updated</TableCell><TableCell align="center">Actions</TableCell></TableRow></TableHead>
            <TableBody>{departments.map(department => <TableRow hover key={department.id}><TableCell sx={{ fontSize: 13, fontWeight: 700 }}>{department.name}</TableCell><TableCell sx={{ fontSize: 13 }}>{department.description || '-'}</TableCell><TableCell sx={{ fontSize: 13 }}>{new Date(department.updatedAt).toLocaleDateString()}</TableCell><TableCell align="center"><Tooltip title="Edit department"><IconButton aria-label={`Edit ${department.name}`} onClick={() => openEdit(department)} size="small"><EditOutlined fontSize="small" /></IconButton></Tooltip><Tooltip title="Delete department"><IconButton aria-label={`Delete ${department.name}`} color="error" onClick={() => setDepartmentToDelete(department)} size="small"><DeleteOutlined fontSize="small" /></IconButton></Tooltip></TableCell></TableRow>)}</TableBody>
          </Table>
          {!loading && departments.length === 0 && <Typography color="text.secondary" sx={{ px: 2, py: 4, textAlign: 'center' }}>No departments found.</Typography>}
        </TableContainer>
      </Paper>
      <Dialog fullWidth maxWidth="sm" onClose={saving ? undefined : () => setDepartmentToEdit(null)} open={departmentToEdit !== null}>
        <DialogTitle>{departmentToEdit?.id ? 'Edit Department' : 'Add Department'}</DialogTitle>
        <DialogContent><Stack spacing={2} sx={{ pt: 1 }}><TextField autoFocus fullWidth label="Name" onChange={event => setForm(current => ({ ...current, name: event.target.value }))} required value={form.name} /><TextField fullWidth label="Description" multiline minRows={3} onChange={event => setForm(current => ({ ...current, description: event.target.value }))} value={form.description} /></Stack></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}><Button disabled={saving} onClick={() => setDepartmentToEdit(null)}>Cancel</Button><Button disabled={saving || !form.name.trim()} onClick={() => void saveDepartment()} variant="contained">{saving ? 'Saving...' : 'Save Department'}</Button></DialogActions>
      </Dialog>
      <Dialog onClose={deleting ? undefined : () => setDepartmentToDelete(null)} open={departmentToDelete !== null}>
        <DialogTitle>Delete Department</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete {departmentToDelete?.name}?</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}><Button disabled={deleting} onClick={() => setDepartmentToDelete(null)}>Cancel</Button><Button color="error" disabled={deleting} onClick={() => void confirmDelete()} variant="contained">{deleting ? 'Deleting...' : 'Delete'}</Button></DialogActions>
      </Dialog>
    </Box>
  );
}