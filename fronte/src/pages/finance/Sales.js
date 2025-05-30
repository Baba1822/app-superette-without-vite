import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Grid,
    TextField,
    MenuItem,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    Visibility as VisibilityIcon,
    Print as PrintIcon,
    FileDownload as ExportIcon
} from '@mui/icons-material';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSale, setSelectedSale] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [filters, setFilters] = useState({
        startDate: null,
        endDate: null,
        paymentMethod: 'all'
    });

    useEffect(() => {
        const fetchSales = async () => {
            try {
                // Simuler un appel API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Données mockées
                const mockSales = [
                    {
                        id: '1',
                        date: '2024-03-10',
                        total: 150000,
                        paymentMethod: 'cash',
                        cashier: 'John Doe',
                        items: [
                            { id: 1, name: 'Riz local', quantity: 2, price: 50000 },
                            { id: 2, name: 'Huile végétale', quantity: 1, price: 50000 }
                        ]
                    },
                    {
                        id: '2',
                        date: '2024-03-09',
                        total: 75000,
                        paymentMethod: 'card',
                        cashier: 'Jane Smith',
                        items: [
                            { id: 1, name: 'Sucre', quantity: 3, price: 25000 }
                        ]
                    }
                ];

                setSales(mockSales);
            } catch (err) {
                setError('Erreur lors du chargement des ventes');
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, []);

    const handleViewDetails = (sale) => {
        setSelectedSale(sale);
        setOpenDialog(true);
    };

    const handleExport = () => {
        // TODO: Implémenter l'export des ventes
        console.log('Export des ventes');
    };

    const handlePrint = (sale) => {
        // TODO: Implémenter l'impression du reçu
        console.log('Impression du reçu:', sale.id);
    };

    const getPaymentMethodLabel = (method) => {
        const methods = {
            cash: 'Espèces',
            card: 'Carte',
            mobile: 'Mobile'
        };
        return methods[method] || method;
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
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestion des Ventes
            </Typography>

            {/* Filtres */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Date début"
                                    value={filters.startDate}
                                    onChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Date fin"
                                    value={filters.endDate}
                                    onChange={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                select
                                fullWidth
                                label="Moyen de paiement"
                                value={filters.paymentMethod}
                                onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
                            >
                                <MenuItem value="all">Tous</MenuItem>
                                <MenuItem value="cash">Espèces</MenuItem>
                                <MenuItem value="card">Carte</MenuItem>
                                <MenuItem value="mobile">Mobile</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Button
                                variant="contained"
                                startIcon={<ExportIcon />}
                                onClick={handleExport}
                                fullWidth
                            >
                                Exporter
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Liste des ventes */}
            <Card>
                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>N° Vente</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Caissier</TableCell>
                                    <TableCell>Paiement</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sales.map((sale) => (
                                    <TableRow key={sale.id}>
                                        <TableCell>{sale.id}</TableCell>
                                        <TableCell>
                                            {new Date(sale.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{sale.cashier}</TableCell>
                                        <TableCell>
                                            {getPaymentMethodLabel(sale.paymentMethod)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {sale.total.toLocaleString()} GNF
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleViewDetails(sale)}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handlePrint(sale)}
                                            >
                                                <PrintIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Modal de détails */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Détails de la vente #{selectedSale?.id}
                </DialogTitle>
                <DialogContent>
                    {selectedSale && (
                        <Box>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1">
                                        Date: {new Date(selectedSale.date).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1">
                                        Caissier: {selectedSale.cashier}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <TableContainer sx={{ mt: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Produit</TableCell>
                                            <TableCell align="right">Quantité</TableCell>
                                            <TableCell align="right">Prix unitaire</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedSale.items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell align="right">{item.quantity}</TableCell>
                                                <TableCell align="right">
                                                    {item.price.toLocaleString()} GNF
                                                </TableCell>
                                                <TableCell align="right">
                                                    {(item.price * item.quantity).toLocaleString()} GNF
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell colSpan={3} align="right">
                                                <strong>Total</strong>
                                            </TableCell>
                                            <TableCell align="right">
                                                <strong>{selectedSale.total.toLocaleString()} GNF</strong>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        Fermer
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<PrintIcon />}
                        onClick={() => handlePrint(selectedSale)}
                    >
                        Imprimer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Sales; 