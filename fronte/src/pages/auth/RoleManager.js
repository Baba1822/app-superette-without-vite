import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';

// Définition des rôles et leurs permissions
const ROLES = {
    ADMIN: {
        name: 'Administrateur',
        permissions: ['all'],
        description: 'Accès complet au système'
    },
    MANAGER: {
        name: 'Gérant',
        permissions: ['sales', 'inventory', 'reports', 'employees'],
        description: 'Gestion des ventes, stocks et employés'
    },
    CASHIER: {
        name: 'Caissier',
        permissions: ['sales', 'returns'],
        description: 'Gestion des ventes et retours'
    },
    STOCKIST: {
        name: 'Stockiste',
        permissions: ['inventory', 'orders'],
        description: 'Gestion des stocks et commandes'
    }
};

function RoleManager() {
    const [employees, setEmployees] = useState([
        {
            id: 1,
            name: 'Mamadou Diallo',
            role: 'MANAGER',
            username: 'mamadou',
            password: '******'
        },
        {
            id: 2,
            name: 'Fatoumata Bamba',
            role: 'CASHIER',
            username: 'fatoumata',
            password: '******'
        },
        {
            id: 3,
            name: 'Ibrahim Traoré',
            role: 'STOCKIST',
            username: 'ibrahim',
            password: '******'
        }
    ]);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        username: '',
        password: ''
    });

    const handleOpenDialog = (employee = null) => {
        if (employee) {
            setSelectedEmployee(employee);
            setFormData({
                name: employee.name,
                role: employee.role,
                username: employee.username,
                password: employee.password
            });
        } else {
            setSelectedEmployee(null);
            setFormData({
                name: '',
                role: '',
                username: '',
                password: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedEmployee(null);
    };

    const handleSaveEmployee = () => {
        if (selectedEmployee) {
            // Mise à jour d'un employé existant
            setEmployees(employees.map(emp =>
                emp.id === selectedEmployee.id
                    ? { ...emp, ...formData }
                    : emp
            ));
        } else {
            // Ajout d'un nouvel employé
            const newEmployee = {
                id: employees.length + 1,
                ...formData
            };
            setEmployees([...employees, newEmployee]);
        }
        handleCloseDialog();
    };

    return (
        <Box>
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5">Gestion des employés</Typography>
                        <Button
                            variant="contained"
                            onClick={() => handleOpenDialog()}
                        >
                            Ajouter un employé
                        </Button>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nom</TableCell>
                                    <TableCell>Rôle</TableCell>
                                    <TableCell>Nom d'utilisateur</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employees.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell>{employee.name}</TableCell>
                                        <TableCell>
                                            <Typography>
                                                {ROLES[employee.role].name}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {ROLES[employee.role].description}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{employee.username}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                onClick={() => handleOpenDialog(employee)}
                                            >
                                                Modifier
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {selectedEmployee ? 'Modifier un employé' : 'Ajouter un employé'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nom complet"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Rôle</InputLabel>
                                <Select
                                    value={formData.role}
                                    label="Rôle"
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    {Object.entries(ROLES).map(([key, role]) => (
                                        <MenuItem key={key} value={key}>
                                            {role.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nom d'utilisateur"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mot de passe"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Annuler</Button>
                    <Button onClick={handleSaveEmployee} variant="contained">
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default RoleManager; 