import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
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
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Service pour gérer les employés
const EmployeeService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/employees`);
      // Assurez-vous que la réponse contient un tableau
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.employees)) {
        return data.employees;
      } else if (data && Array.isArray(data.data)) {
        return data.data;
      } else {
        console.warn('Format de données inattendu:', data);
        return [];
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des employés');
    }
  },

  create: async (employeeData) => {
    try {
      const response = await axios.post(`${API_URL}/employees`, employeeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création de l\'employé');
    }
  },

  update: async (id, employeeData) => {
    try {
      const response = await axios.put(`${API_URL}/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'employé');
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${API_URL}/employees/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de l\'employé');
    }
  }
};

// Rôles prédéfinis
const ROLES = [
  { id: 'ADMIN', name: 'Administrateur', color: 'error' },
  { id: 'MANAGER', name: 'Gérant', color: 'warning' },
  { id: 'CASHIER', name: 'Caissier', color: 'primary' },
  { id: 'STOCK', name: 'Stockiste', color: 'success' }
];

const Employees = () => {
  // Initialisation explicite avec un tableau vide
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  const [employeeDialog, setEmployeeDialog] = useState({
    open: false,
    mode: 'create',
    employee: null
  });
  
  const [employeeForm, setEmployeeForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    status: 'active'
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // API Services
  const fetchEmployees = async () => {
    try {
      return await EmployeeService.getAll();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const createEmployee = async (employeeData) => {
    try {
      return await EmployeeService.create(employeeData);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const updateEmployee = async (id, employeeData) => {
    try {
      return await EmployeeService.update(id, employeeData);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await EmployeeService.delete(id);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        const employeesData = await fetchEmployees();
        
        // Vérification supplémentaire que les données sont bien un tableau
        if (Array.isArray(employeesData)) {
          setEmployees(employeesData);
        } else {
          console.error('Les données reçues ne sont pas un tableau:', employeesData);
          setEmployees([]);
          showSnackbar('Format de données incorrect reçu du serveur', 'error');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des employés:', error);
        showSnackbar(error.message, 'error');
        setEmployees([]); // S'assurer que employees reste un tableau même en cas d'erreur
      } finally {
        setLoading(false);
      }
    };
    
    loadEmployees();
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
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleInfo = (roleId) => {
    return ROLES.find(r => r.id === roleId) || { name: roleId || 'Non défini', color: 'default' };
  };

  // Gestion des employés
  const handleOpenEmployeeDialog = (employee = null) => {
    if (employee) {
      setEmployeeForm({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        role: employee.role || '',
        status: employee.status || 'active'
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
    setEmployeeForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      status: 'active'
    });
  };

  const handleEmployeeFormChange = (e) => {
    const { name, value } = e.target;
    setEmployeeForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEmployee = async () => {
    try {
      // Validation
      if (!employeeForm.firstName?.trim()) {
        throw new Error('Le prénom est obligatoire');
      }
      if (!employeeForm.lastName?.trim()) {
        throw new Error('Le nom est obligatoire');
      }
      if (!employeeForm.email?.trim()) {
        throw new Error('L\'email est obligatoire');
      }
      if (!employeeForm.role) {
        throw new Error('Le rôle est obligatoire');
      }

      const employeeData = {
        firstName: employeeForm.firstName.trim(),
        lastName: employeeForm.lastName.trim(),
        email: employeeForm.email.trim(),
        phone: employeeForm.phone?.trim() || null,
        role: employeeForm.role,
        status: employeeForm.status
      };

      if (employeeDialog.mode === 'create') {
        const createdEmployee = await createEmployee(employeeData);
        setEmployees(prev => {
          // Vérification que prev est bien un tableau
          if (Array.isArray(prev)) {
            return [...prev, createdEmployee];
          } else {
            console.error('employees n\'est pas un tableau lors de l\'ajout');
            return [createdEmployee];
          }
        });
        showSnackbar('Employé créé avec succès');
      } else {
        const updatedEmployee = await updateEmployee(employeeDialog.employee.id, employeeData);
        setEmployees(prev => {
          // Vérification que prev est bien un tableau
          if (Array.isArray(prev)) {
            return prev.map(e => 
              e.id === employeeDialog.employee.id ? updatedEmployee : e
            );
          } else {
            console.error('employees n\'est pas un tableau lors de la mise à jour');
            return [updatedEmployee];
          }
        });
        showSnackbar('Employé mis à jour avec succès');
      }

      handleCloseEmployeeDialog();
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const handleDeleteEmployee = async (employee) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${employee.firstName} ${employee.lastName} ?`)) {
      return;
    }

    try {
      await deleteEmployee(employee.id);
      setEmployees(prev => {
        // Vérification que prev est bien un tableau
        if (Array.isArray(prev)) {
          return prev.filter(e => e.id !== employee.id);
        } else {
          console.error('employees n\'est pas un tableau lors de la suppression');
          return [];
        }
      });
      showSnackbar('Employé supprimé avec succès');
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  // Filtrage et pagination - avec vérification de sécurité CORRIGÉE
  const filteredEmployees = React.useMemo(() => {
    // Vérification que employees est bien un tableau avant de filtrer
    if (!Array.isArray(employees)) {
      console.error('employees n\'est pas un tableau:', employees);
      return [];
    }

    return employees.filter(employee => {
      const searchLower = searchTerm.toLowerCase();
      
      // Vérification de sécurité pour chaque propriété avant toLowerCase()
      const firstName = employee.firstName || '';
      const lastName = employee.lastName || '';
      const email = employee.email || '';
      const roleInfo = getRoleInfo(employee.role);
      const roleName = roleInfo.name || '';
      
      const matchesSearch = (
        firstName.toLowerCase().includes(searchLower) ||
        lastName.toLowerCase().includes(searchLower) ||
        email.toLowerCase().includes(searchLower) ||
        roleName.toLowerCase().includes(searchLower)
      );
      
      const matchesRole = !roleFilter || employee.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [employees, searchTerm, roleFilter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Statistiques - avec vérifications de sécurité
  const activeEmployees = Array.isArray(employees) ? 
    employees.filter(e => e.status === 'active').length : 0;
    
  const lastLoginEmployee = Array.isArray(employees) && employees.length > 0 ? 
    employees.reduce((latest, current) => 
      new Date(current.lastLogin || 0) > new Date(latest.lastLogin || 0) ? current : latest
    ) : null;

  const uniqueRoles = Array.isArray(employees) ? 
    new Set(employees.map(e => e.role)).size : 0;

  return (
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

      {/* Cartes statistiques */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total employés
              </Typography>
              <Typography variant="h4">
                {Array.isArray(employees) ? employees.length : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Employés actifs
              </Typography>
              <Typography variant="h4">
                {activeEmployees}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Dernière connexion
              </Typography>
              <Typography variant="body1">
                {lastLoginEmployee ? 
                  `${lastLoginEmployee.firstName || ''} ${lastLoginEmployee.lastName || ''}`.trim() || 'Nom non défini' : 
                  'Aucune'
                }
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {lastLoginEmployee ? formatDate(lastLoginEmployee.lastLogin) : ''}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Rôles différents
              </Typography>
              <Typography variant="h4">
                {uniqueRoles}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recherche et filtres */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher un employé (nom, prénom, email)..."
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
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                label="Filtrer par rôle"
              >
                <MenuItem value="">Tous les rôles</MenuItem>
                {ROLES.map(role => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Table des employés */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell>Nom complet</TableCell>
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
                    {searchTerm || roleFilter ? 'Aucun employé trouvé avec ces critères' : 'Aucun employé'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((employee) => {
                    const roleInfo = getRoleInfo(employee.role);
                    return (
                      <TableRow key={employee.id} hover>
                        <TableCell>
                          <Avatar 
                            src={employee.avatar} 
                            alt={`${employee.firstName || ''} ${employee.lastName || ''}`}
                          >
                            {(employee.firstName || '')[0]}{(employee.lastName || '')[0]}
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="medium">
                            {employee.firstName || ''} {employee.lastName || ''}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {employee.email || ''}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {employee.phone || 'Non renseigné'}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={roleInfo.name}
                            color={roleInfo.color}
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
                          <Typography variant="body2">
                            {formatDate(employee.lastLogin)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="Modifier">
                              <IconButton 
                                onClick={() => handleOpenEmployeeDialog(employee)}
                                size="small"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <IconButton 
                                onClick={() => handleDeleteEmployee(employee)}
                                size="small"
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
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

      {/* Dialog pour employé */}
      <Dialog 
        open={employeeDialog.open} 
        onClose={handleCloseEmployeeDialog} 
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {employeeDialog.mode === 'create' ? 'Nouvel employé' : 'Modifier l\'employé'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                name="firstName"
                value={employeeForm.firstName}
                onChange={handleEmployeeFormChange}
                required
                error={!employeeForm.firstName?.trim()}
                helperText={!employeeForm.firstName?.trim() ? 'Le prénom est obligatoire' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                name="lastName"
                value={employeeForm.lastName}
                onChange={handleEmployeeFormChange}
                required
                error={!employeeForm.lastName?.trim()}
                helperText={!employeeForm.lastName?.trim() ? 'Le nom est obligatoire' : ''}
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
                required
                error={!employeeForm.email?.trim()}
                helperText={!employeeForm.email?.trim() ? 'L\'email est obligatoire' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                name="phone"
                value={employeeForm.phone}
                onChange={handleEmployeeFormChange}
                placeholder="Ex: +224 123 456 789"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!employeeForm.role}>
                <InputLabel>Rôle</InputLabel>
                <Select
                  name="role"
                  value={employeeForm.role}
                  onChange={handleEmployeeFormChange}
                  label="Rôle"
                >
                  {ROLES.map(role => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
                {!employeeForm.role && (
                  <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                    Le rôle est obligatoire
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Typography component="span" sx={{ mr: 2 }}>
                    Statut:
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2">Inactif</Typography>
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
                    <Typography variant="body2">Actif</Typography>
                  </Stack>
                </Box>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEmployeeDialog}>
            Annuler
          </Button>
          <Button 
            onClick={handleSaveEmployee} 
            variant="contained" 
            color="primary"
            disabled={!employeeForm.firstName?.trim() || !employeeForm.lastName?.trim() || !employeeForm.email?.trim() || !employeeForm.role}
          >
            {employeeDialog.mode === 'create' ? 'Créer' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
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
  );
};

export default Employees;