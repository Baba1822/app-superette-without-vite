import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function ManagerDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Données mockées pour le tableau de bord
    const dashboardData = {
        sales: {
            today: 1500000,
            week: 8500000,
            month: 35000000
        },
        inventory: {
            lowStock: 5,
            outOfStock: 2,
            totalProducts: 150
        },
        employees: {
            total: 8,
            present: 6,
            absent: 2
        }
    };

    // Gestionnaires d'événements pour les actions rapides
    const handleManageEmployees = () => {
        navigate('/admin/employees');
    };

    const handleCheckInventory = () => {
        navigate('/inventory');
    };

    const handleGenerateReports = () => {
        navigate('/admin/reports');
    };

    const handleManagePromotions = () => {
        navigate('/offers/promotions');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Tableau de bord - Gérant
                </Typography>
                <Button variant="outlined" onClick={logout}>
                    Déconnexion
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Ventes */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Ventes</Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Aujourd'hui</TableCell>
                                            <TableCell align="right">{dashboardData.sales.today.toLocaleString()} GNF</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Cette semaine</TableCell>
                                            <TableCell align="right">{dashboardData.sales.week.toLocaleString()} GNF</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Ce mois</TableCell>
                                            <TableCell align="right">{dashboardData.sales.month.toLocaleString()} GNF</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Stock */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Stock</Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Produits en stock bas</TableCell>
                                            <TableCell align="right">{dashboardData.inventory.lowStock}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Produits épuisés</TableCell>
                                            <TableCell align="right">{dashboardData.inventory.outOfStock}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Total produits</TableCell>
                                            <TableCell align="right">{dashboardData.inventory.totalProducts}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Employés */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Employés</Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Total employés</TableCell>
                                            <TableCell align="right">{dashboardData.employees.total}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Présents</TableCell>
                                            <TableCell align="right">{dashboardData.employees.present}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Absents</TableCell>
                                            <TableCell align="right">{dashboardData.employees.absent}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Actions rapides */}
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>Actions rapides</Typography>
                <Grid container spacing={2}>
                    <Grid item>
                        <Button variant="contained" onClick={handleManageEmployees}>
                            Gérer les employés
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={handleCheckInventory}>
                            Vérifier le stock
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={handleGenerateReports}>
                            Générer des rapports
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={handleManagePromotions}>
                            Configurer les promotions
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default ManagerDashboard; 