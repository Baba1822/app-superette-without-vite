import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  LockReset as LockResetIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import React, { useEffect, useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const API_URL = 'http://localhost:5000/api';

const SYSTEM_ROLES = {
  ADMIN: {
    name: 'Administrateur',
    permissions: [
      'gestion_employes', 
      'gestion_stock', 
      'gestion_ventes', 
      'gestion_clients', 
      'rapports',
      'configuration'
    ],
    color: 'error'
  },
  MANAGER: {
    name: 'Gérant',
    permissions: [
      'gestion_stock', 
      'gestion_ventes', 
      'gestion_clients', 
      'rapports'
    ],
    color: 'warning'
  },
  CASHIER: {
    name: 'Caissier',
    permissions: [
      'gestion_ventes', 
      'gestion_clients'
    ],
    color: 'primary'
  },
  STOCK: {
    name: 'Stockiste',
    permissions: ['gestion_stock'],
    color: 'success'
  }
};

const DAYS = [
  { id: 'monday', name: 'Lundi' },
  { id: 'tuesday', name: 'Mardi' },
  { id: 'wednesday', name: 'Mercredi' },
  { id: 'thursday', name: 'Jeudi' },
  { id: 'friday', name: 'Vendredi' },
  { id: 'saturday', name: 'Samedi' },
  { id: 'sunday', name: 'Dimanche' }
];

const PERMISSIONS = [
  { id: 'gestion_employes', name: 'Gestion des employés' },
  { id: 'gestion_stock', name: 'Gestion du stock' },
  { id: 'gestion_ventes', name: 'Gestion des ventes' },
  { id: 'gestion_clients', name: 'Gestion des clients' },
  { id: 'rapports', name: 'Consultation des rapports' },
  { id: 'configuration', name: 'Configuration système' }
];

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  const [employeeDialog, setEmployeeDialog] = useState({
    open: false,
    mode: 'create',
    employee: null
  });
  
  const [scheduleDialog, setScheduleDialog] = useState({
    open: false,
    employee: null
  });
  
  const [roleDialog, setRoleDialog] = useState({
    open: false,
    role: null
  });
  
  const [employeeForm, setEmployeeForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    status: 'active'
  });
  
  const [scheduleForm, setScheduleForm] = useState(
    DAYS.reduce((acc, day) => ({
      ...acc,
      [day.id]: { start: '09:00', end: '17:00', active: true }
    }), {})
  );
  
  const [roleForm, setRoleForm] = useState({
    name: '',
    permissions: []
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // API Services
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/employees`);
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erreur lors du chargement des employés';
      throw new Error(errorMsg);
    }
  };

  const fetchRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/roles`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      params: {
        page: 1,
        limit: 100
      }
    });
    
    if (response.data && response.data.success) {
      return response.data.data.map(role => ({
        ...role,
        permissions: Array.isArray(role.permissions) ? role.permissions : []
      }));
    }
    throw new Error('Format de réponse inattendu');
  } catch (error) {
    const errorMsg = error.response?.data?.message || 
                    error.message || 
                    'Erreur lors du chargement des rôles';
    throw new Error(errorMsg);
  }
};

  const createEmployee = async (employeeData) => {
    try {
      const response = await axios.post(`${API_URL}/employees`, employeeData);
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erreur lors de la création de l\'employé';
      throw new Error(errorMsg);
    }
  };

  const updateEmployee = async (id, employeeData) => {
    try {
      const response = await axios.put(`${API_URL}/employees/${id}`, employeeData);
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erreur lors de la mise à jour de l\'employé';
      throw new Error(errorMsg);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`${API_URL}/employees/${id}`);
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erreur lors de la suppression de l\'employé';
      throw new Error(errorMsg);
    }
  };

  const updateEmployeeSchedule = async (id, schedule) => {
    try {
      const response = await axios.put(`${API_URL}/employees/${id}/schedule`, { schedule });
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erreur lors de la mise à jour des horaires';
      throw new Error(errorMsg);
    }
  };

  const createRole = async (roleData) => {
    try {
      const response = await axios.post(`${API_URL}/roles`, {
        name: roleData.name,
        permissions: roleData.permissions
      });
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erreur lors de la création du rôle';
      throw new Error(errorMsg);
    }
  };

  const updateRole = async (id, roleData) => {
    try {
      const response = await axios.put(`${API_URL}/roles/${id}`, {
        name: roleData.name,
        permissions: roleData.permissions
      });
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erreur lors de la mise à jour du rôle';
      throw new Error(errorMsg);
    }
  };

  const deleteRole = async (id) => {
    try {
      await axios.delete(`${API_URL}/roles/${id}`);
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erreur lors de la suppression du rôle';
      throw new Error(errorMsg);
    }
  };

  const resetPassword = async (id) => {
    try {
      await axios.post(`${API_URL}/employees/${id}/reset-password`);
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe';
      throw new Error(errorMsg);
    }
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [employeesData, rolesData] = await Promise.all([
          fetchEmployees(),
          fetchRoles()
        ]);
        setEmployees(employeesData);
        setRoles(rolesData);
      } catch (error) {
        showSnackbar(error.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Helper functions
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Jamais';
    return format(new Date(dateString), 'PPpp', { locale: fr });
  };

  // Employee CRUD operations
  const handleOpenEmployeeDialog = (employee = null) => {
    if (employee) {
      setEmployeeForm({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
        status: employee.status
      });
      setEmployeeDialog({ open: true, mode: 'edit', employee });
    } else {
      setEmployeeForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        status: 'active'
      });
      setEmployeeDialog({ open: true, mode: 'create', employee: null });
    }
  };

  const handleCloseEmployeeDialog = () => {
    setEmployeeDialog({ open: false, mode: 'create', employee: null });
  };

  const handleEmployeeFormChange = (e) => {
    const { name, value } = e.target;
    setEmployeeForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEmployee = async () => {
    try {
      if (!employeeForm.firstName || !employeeForm.lastName || !employeeForm.email || !employeeForm.role) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      const employeeData = {
        firstName: employeeForm.firstName,
        lastName: employeeForm.lastName,
        email: employeeForm.email,
        phone: employeeForm.phone || null,
        role: employeeForm.role,
        status: employeeForm.status || 'active',
        avatar: employeeForm.avatar || '/avatars/default.jpg'
      };

      if (employeeDialog.mode === 'create') {
        employeeData.password = Math.random().toString(36).slice(-8);
        const createdEmployee = await createEmployee(employeeData);
        setEmployees(prev => [...prev, createdEmployee]);
        showSnackbar('Employé créé avec succès');
      } else {
        const updatedEmployee = await updateEmployee(
          employeeDialog.employee.id, 
          employeeData
        );
        setEmployees(prev => prev.map(e => 
          e.id === employeeDialog.employee.id ? updatedEmployee : e
        ));
        showSnackbar('Employé mis à jour avec succès');
      }

      handleCloseEmployeeDialog();
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await deleteEmployee(id);
      setEmployees(prev => prev.filter(e => e.id !== id));
      showSnackbar('Employé supprimé avec succès');
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  // Schedule management
  const handleOpenScheduleDialog = (employee) => {
    setScheduleForm(employee.schedule || 
      DAYS.reduce((acc, day) => ({
        ...acc,
        [day.id]: { start: '09:00', end: '17:00', active: true }
      }), {})
    );
    setScheduleDialog({ open: true, employee });
  };

  const handleCloseScheduleDialog = () => {
    setScheduleDialog({ open: false, employee: null });
  };

  const handleScheduleChange = (day, field, value) => {
    setScheduleForm(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSaveSchedule = async () => {
    try {
      const updatedEmployee = await updateEmployeeSchedule(
        scheduleDialog.employee.id,
        scheduleForm
      );
      
      setEmployees(prev => prev.map(e => 
        e.id === scheduleDialog.employee.id ? updatedEmployee : e
      ));
      showSnackbar('Horaires mis à jour avec succès');
      handleCloseScheduleDialog();
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  // Role management
  const handleOpenRoleDialog = (role = null) => {
    if (role) {
      setRoleForm({
        name: role.name,
        permissions: Array.isArray(role.permissions) ? [...role.permissions] : []
      });
      setRoleDialog({ open: true, role });
    } else {
      setRoleForm({
        name: '',
        permissions: []
      });
      setRoleDialog({ open: true, role: null });
    }
  };

  const handleCloseRoleDialog = () => {
    setRoleDialog({ open: false, role: null });
  };

  const handleRoleFormChange = (e) => {
    const { name, value } = e.target;
    setRoleForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionToggle = (permission) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleSaveRole = async () => {
    try {
      if (!roleForm.name) {
        throw new Error('Le nom du rôle est obligatoire');
      }

      let savedRole;
      if (roleDialog.role) {
        if (Object.keys(SYSTEM_ROLES).includes(roleDialog.role.id)) {
          throw new Error('Les rôles système ne peuvent pas être modifiés');
        }
        savedRole = await updateRole(roleDialog.role.id, roleForm);
      } else {
        savedRole = await createRole(roleForm);
      }

      const roles = await fetchRoles();
      setRoles(roles);
      
      showSnackbar('Rôle sauvegardé avec succès');
      handleCloseRoleDialog();
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const handleDeleteRole = async (roleId) => {
    try {
      if (Object.keys(SYSTEM_ROLES).includes(roleId)) {
        throw new Error('Les rôles système ne peuvent pas être supprimés');
      }
      
      await deleteRole(roleId);
      const updatedRoles = await fetchRoles();
      setRoles(updatedRoles);
      showSnackbar('Rôle supprimé avec succès');
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  // Reset password
  const handleResetPassword = async (employee) => {
    try {
      await resetPassword(employee.id);
      showSnackbar(`Un lien de réinitialisation a été envoyé à ${employee.email}`);
    } catch (error) {
      showSnackbar('Erreur lors de la réinitialisation du mot de passe', 'error');
    }
  };

  // Filter and pagination
  const filteredEmployees = employees.filter(employee => {
    const searchLower = searchTerm.toLowerCase();
    return (
      employee.firstName.toLowerCase().includes(searchLower) ||
      employee.lastName.toLowerCase().includes(searchLower) ||
      employee.email.toLowerCase().includes(searchLower) ||
      (roles.find(r => r.id === employee.role)?.name || '').toLowerCase().includes(searchLower)
    );
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Gestion des employés
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenEmployeeDialog()}
          >
            Ajouter un employé
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total employés
                </Typography>
                <Typography variant="h4">
                  {employees.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Employés actifs
                </Typography>
                <Typography variant="h4">
                  {employees.filter(e => e.status === 'active').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Dernière connexion
                </Typography>
                <Typography variant="h4">
                  {employees.length > 0 ? 
                    formatDate(employees.sort((a, b) => 
                      new Date(b.lastLogin) - new Date(a.lastLogin)
                    )[0].lastLogin) : 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Rôles différents
                </Typography>
                <Typography variant="h4">
                  {new Set(employees.map(e => e.role)).size}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Employés" />
            <Tab label="Rôles et permissions" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {tabValue === 0 ? (
          <>
            {/* Search and Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Rechercher un employé..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Filtrer par rôle</InputLabel>
                    <Select
                      value=""
                      onChange={() => {}}
                      label="Filtrer par rôle"
                    >
                      <MenuItem value="">Tous les rôles</MenuItem>
                      {roles.map(role => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            {/* Employees Table */}
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Photo</TableCell>
                      <TableCell>Nom</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Rôle</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell>Dernière connexion</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          Chargement...
                        </TableCell>
                      </TableRow>
                    ) : filteredEmployees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          Aucun employé trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEmployees
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((employee) => (
                          <TableRow key={employee.id} hover>
                            <TableCell>
                              <Avatar src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} />
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight="medium">
                                {employee.firstName} {employee.lastName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {employee.email}
                              </Typography>
                            </TableCell>
                            <TableCell>{employee.phone}</TableCell>
                            <TableCell>
                              <Chip 
                                label={roles.find(r => r.id === employee.role)?.name || employee.role} 
                                color={SYSTEM_ROLES[employee.role]?.color || 'default'} 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={employee.status === 'active' ? 'Actif' : 'Inactif'} 
                                color={employee.status === 'active' ? 'success' : 'error'} 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell>
                              {formatDate(employee.lastLogin)}
                            </TableCell>
                            <TableCell align="center">
                              <Stack direction="row" spacing={1} justifyContent="center">
                                <Tooltip title="Modifier">
                                  <IconButton onClick={() => handleOpenEmployeeDialog(employee)}>
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Horaires">
                                  <IconButton onClick={() => handleOpenScheduleDialog(employee)}>
                                    <ScheduleIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Réinitialiser mot de passe">
                                  <IconButton onClick={() => handleResetPassword(employee)}>
                                    <LockResetIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Supprimer">
                                  <IconButton onClick={() => handleDeleteEmployee(employee.id)}>
                                    <DeleteIcon fontSize="small" color="error" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredEmployees.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Lignes par page"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
              />
            </Paper>
          </>
        ) : (
          <>
            {/* Roles and Permissions Tab */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenRoleDialog()}
              >
                Créer un rôle
              </Button>
            </Box>

            <Grid container spacing={3}>
              {roles.map((role) => (
                <Grid item xs={12} sm={6} md={4} key={role.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">
                          {role.name}
                        </Typography>
                        <Chip 
                          label={`${employees.filter(e => e.role === role.id).length} employés`} 
                          size="small" 
                        />
                      </Box>
                      
                      <Stack spacing={1} sx={{ mb: 2 }}>
                        {(Array.isArray(role.permissions) ? role.permissions : []).map(permission => (
                          <Chip
                            key={permission}
                            label={PERMISSIONS.find(p => p.id === permission)?.name || permission}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Stack>

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleOpenRoleDialog(role)}
                          disabled={Object.keys(SYSTEM_ROLES).includes(role.id)}
                        >
                          Modifier
                        </Button>
                        <Button
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteRole(role.id)}
                          disabled={Object.keys(SYSTEM_ROLES).includes(role.id)}
                          color="error"
                        >
                          Supprimer
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Employee Dialog */}
        <Dialog 
          open={employeeDialog.open} 
          onClose={handleCloseEmployeeDialog} 
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {employeeDialog.mode === 'create' ? 'Nouvel employé' : `Modifier ${employeeDialog.employee?.firstName} ${employeeDialog.employee?.lastName}`}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Prénom"
                  name="firstName"
                  value={employeeForm.firstName}
                  onChange={handleEmployeeFormChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  name="lastName"
                  value={employeeForm.lastName}
                  onChange={handleEmployeeFormChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={employeeForm.email}
                  onChange={handleEmployeeFormChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  name="phone"
                  value={employeeForm.phone}
                  onChange={handleEmployeeFormChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Rôle</InputLabel>
                  <Select
                    name="role"
                    value={employeeForm.role}
                    onChange={handleEmployeeFormChange}
                    label="Rôle"
                  >
                    {roles.map(role => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={employeeForm.status === 'active'}
                        onChange={(e) => 
                          setEmployeeForm(prev => ({
                            ...prev,
                            status: e.target.checked ? 'active' : 'inactive'
                          }))
                        }
                        color="primary"
                      />
                    }
                    label={employeeForm.status === 'active' ? 'Actif' : 'Inactif'}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEmployeeDialog}>Annuler</Button>
            <Button 
              onClick={handleSaveEmployee} 
              variant="contained" 
              color="primary"
            >
              {employeeDialog.mode === 'create' ? 'Créer' : 'Enregistrer'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Schedule Dialog */}
        <Dialog
          open={scheduleDialog.open}
          onClose={handleCloseScheduleDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Horaires de {scheduleDialog.employee?.firstName} {scheduleDialog.employee?.lastName}
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mt: 2 }}>
              {DAYS.map(day => (
                <Box key={day.id} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {day.name}
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={scheduleForm[day.id]?.active || false}
                            onChange={(e) => 
                              handleScheduleChange(day.id, 'active', e.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label={scheduleForm[day.id]?.active ? 'Actif' : 'Inactif'}
                      />
                    </Grid>
                    {scheduleForm[day.id]?.active && (
                      <>
                        <Grid item xs={4}>
                          <TimePicker
                            label="Heure de début"
                            value={scheduleForm[day.id]?.start}
                            onChange={(newValue) => 
                              handleScheduleChange(day.id, 'start', newValue)
                            }
                            renderInput={(params) => <TextField {...params} fullWidth />}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TimePicker
                            label="Heure de fin"
                            value={scheduleForm[day.id]?.end}
                            onChange={(newValue) => 
                              handleScheduleChange(day.id, 'end', newValue)
                            }
                            renderInput={(params) => <TextField {...params} fullWidth />}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Box>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseScheduleDialog}>Annuler</Button>
            <Button 
              onClick={handleSaveSchedule} 
              variant="contained" 
              color="primary"
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Role Dialog */}
        <Dialog
          open={roleDialog.open}
          onClose={handleCloseRoleDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {roleDialog.role ? `Modifier le rôle ${roleDialog.role.name}` : 'Créer un nouveau rôle'}
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Nom du rôle"
                name="name"
                value={roleForm.name}
                onChange={handleRoleFormChange}
                margin="normal"
                required
                disabled={roleDialog.role && Object.keys(SYSTEM_ROLES).includes(roleDialog.role.id)}
              />
              
              <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
                Permissions
              </Typography>
              
              <Grid container spacing={2}>
                {PERMISSIONS.map(permission => (
                  <Grid item xs={12} sm={6} key={permission.id}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={roleForm.permissions.includes(permission.id)}
                          onChange={() => handlePermissionToggle(permission.id)}
                          color="primary"
                          disabled={roleDialog.role && Object.keys(SYSTEM_ROLES).includes(roleDialog.role.id)}
                        />
                      }
                      label={permission.name}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRoleDialog}>Annuler</Button>
            <Button 
              onClick={handleSaveRole} 
              variant="contained" 
              color="primary"
              disabled={!roleForm.name || (roleDialog.role && Object.keys(SYSTEM_ROLES).includes(roleDialog.role.id))}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default Employees;