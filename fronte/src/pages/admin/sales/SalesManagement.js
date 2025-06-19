import {
    Add as AddIcon,
    Assessment as AssessmentIcon,
    DateRange as DateRangeIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Print as PrintIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    Snackbar,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SalesService from '../../../services/SalesService';
import CustomerService from '../../../services/CustomerService';

const SalesManagement = () => {
    const [sales, setSales] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [currentTab, setCurrentTab] = useState(0);
    const [dateRange, setDateRange] = useState({
        start: new Date(),
        end: new Date(),
    });
    const [formData, setFormData] = useState({
        date: new Date(),
        clientId: '',
        products: [],
        totalAmount: 0,
        paymentMethod: 'cash',
        status: 'completed',
        notes: '',
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // Statistiques des ventes
    const [salesStats, setSalesStats] = useState({
        dailyTotal: 0,
        weeklyTotal: 0,
        monthlyTotal: 0,
        bestSellingProducts: [],
        topCustomers: [],
    });

    // Utiliser useQuery pour récupérer les données de ventes
    const { data: fetchedSales = [], isLoading, error: salesError } = useQuery({
        queryKey: ['sales'],
        queryFn: SalesService.getAllSales,
        staleTime: 5 * 60 * 1000, // 5 minutes
        onSuccess: (data) => {
            console.log('Données des ventes reçues du service:', data);
            if (data && data.length > 0) {
                console.log('Première vente:', data[0]);
                console.log('Structure de la première vente:', {
                    id: data[0].id,
                    date: data[0].date,
                    totalAmount: data[0].totalAmount,
                    total_amount: data[0].total_amount,
                    products: data[0].products,
                    products_json: data[0].products_json
                });
            }
        },
        onError: (error) => {
            console.error('Erreur lors du chargement des ventes:', error);
            setSnackbar({
                open: true,
                message: `Erreur lors du chargement des ventes: ${error.message}`,
                severity: 'error',
            });
        },
    });

    // Utiliser useQuery pour récupérer les données des clients
    const { data: fetchedCustomers = [], isLoading: customersLoading, error: customersError } = useQuery({
        queryKey: ['customers'],
        queryFn: CustomerService.getAllCustomers,
        staleTime: 5 * 60 * 1000, // 5 minutes
        onError: (error) => {
            console.error('Erreur lors du chargement des clients:', error);
            setSnackbar({
                open: true,
                message: `Erreur lors du chargement des clients: ${error.message}`,
                severity: 'error',
            });
        },
    });

    useEffect(() => {
        if (fetchedSales.length > 0 && fetchedCustomers.length > 0) {
            console.log('Données reçues - Ventes:', fetchedSales);
            console.log('Données reçues - Clients:', fetchedCustomers);
            
            const salesWithCustomerDetails = fetchedSales.map(sale => {
                const customer = fetchedCustomers.find(cust => cust.id === sale.clientId);
                return {
                    ...sale,
                    customerAddress: customer ? customer.address : 'N/A',
                    customerPhone: customer ? customer.phone : 'N/A',
                };
            });
            setSales(salesWithCustomerDetails);
            calculateSalesStats(salesWithCustomerDetails);
        } else if (fetchedSales.length > 0) {
            // If customers are not loaded, just set sales
            console.log('Données reçues - Ventes seulement:', fetchedSales);
            setSales(fetchedSales);
            calculateSalesStats(fetchedSales);
        }
    }, [fetchedSales, fetchedCustomers]);

    const calculateSalesStats = (salesData) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        console.log('Calcul des statistiques:', {
            today: today.toISOString(),
            weekAgo: weekAgo.toISOString(),
            monthAgo: monthAgo.toISOString(),
            salesCount: salesData.length,
            sampleSale: salesData[0]
        });

        const stats = {
            totalSales: salesData.length,
            totalRevenue: salesData.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0),
            dailyTotal: salesData
                .filter(sale => {
                    if (!sale.date) return false;
                    const saleDate = new Date(sale.date);
                    const saleDateOnly = new Date(saleDate.getFullYear(), saleDate.getMonth(), saleDate.getDate());
                    return saleDateOnly.getTime() === today.getTime();
                })
                .reduce((sum, sale) => sum + (sale.totalAmount || 0), 0),
            weeklyTotal: salesData
                .filter(sale => {
                    if (!sale.date) return false;
                    const saleDate = new Date(sale.date);
                    return saleDate >= weekAgo;
                })
                .reduce((sum, sale) => sum + (sale.totalAmount || 0), 0),
            monthlyTotal: salesData
                .filter(sale => {
                    if (!sale.date) return false;
                    const saleDate = new Date(sale.date);
                    return saleDate >= monthAgo;
                })
                .reduce((sum, sale) => sum + (sale.totalAmount || 0), 0),
            bestSellingProducts: calculateBestSellingProducts(salesData),
            topCustomers: calculateTopCustomers(salesData),
        };

        console.log('Statistiques calculées:', stats);
        setSalesStats(stats);
    };

    const calculateBestSellingProducts = (salesData) => {
        const productSales = {};
        salesData.forEach(sale => {
            sale.products.forEach(product => {
                if (!productSales[product.name]) {
                    productSales[product.name] = {
                        quantity: 0,
                        revenue: 0,
                    };
                }
                productSales[product.name].quantity += product.quantity;
                productSales[product.name].revenue += product.quantity * product.price;
            });
        });

        return Object.entries(productSales)
            .map(([name, data]) => ({
                name,
                ...data,
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
    };

    const calculateTopCustomers = (salesData) => {
        const customerSales = {};
        salesData.forEach(sale => {
            // Use sale.customerName if available, otherwise fallback to sale.clientName
            const customerIdentifier = sale.customerName || sale.clientName || 'Client anonyme';
            if (!customerSales[customerIdentifier]) {
                customerSales[customerIdentifier] = {
                    totalPurchases: 0,
                    frequency: 0,
                };
            }
            customerSales[customerIdentifier].totalPurchases += (sale.totalAmount || 0);
            customerSales[customerIdentifier].frequency += 1;
        });

        return Object.entries(customerSales)
            .map(([name, data]) => ({
                name,
                ...data,
            }))
            .sort((a, b) => b.totalPurchases - a.totalPurchases)
            .slice(0, 5);
    };

    const handleOpenDialog = (sale = null) => {
        setSelectedSale(sale);
        if (sale) {
            setFormData({
                date: new Date(sale.date),
                clientId: sale.clientId,
                products: sale.products,
                totalAmount: sale.totalAmount,
                paymentMethod: sale.paymentMethod,
                status: sale.status,
                notes: sale.notes || '',
            });
        } else {
            setFormData({
                date: new Date(),
                clientId: '',
                products: [],
                totalAmount: 0,
                paymentMethod: 'cash',
                status: 'completed',
                notes: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedSale(null);
    };

    const handleSubmit = () => {
        const saleData = {
            ...formData,
            id: selectedSale ? selectedSale.id : Date.now(),
        };

        if (selectedSale) {
            setSales(sales.map(s => s.id === selectedSale.id ? saleData : s));
            setSnackbar({
                open: true,
                message: 'Vente mise à jour avec succès',
                severity: 'success',
            });
        } else {
            setSales([...sales, saleData]);
            setSnackbar({
                open: true,
                message: 'Vente ajoutée avec succès',
                severity: 'success',
            });
        }

        calculateSalesStats([...sales, saleData]);
        handleCloseDialog();
    };

    const handleDelete = (saleId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette vente ?')) {
            const updatedSales = sales.filter(s => s.id !== saleId);
            setSales(updatedSales);
            calculateSalesStats(updatedSales);
            setSnackbar({
                open: true,
                message: 'Vente supprimée avec succès',
                severity: 'success',
            });
        }
    };

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const handleDateRangeChange = (type, date) => {
        setDateRange(prev => ({
            ...prev,
            [type]: date,
        }));
    };

    const handlePrintInvoice = (saleId) => {
        alert(`Impression de la facture pour la vente ${saleId}`);
    };

    const renderSalesTable = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Client</TableCell>
                        <TableCell>Adresse Client</TableCell>
                        <TableCell>Téléphone Client</TableCell>
                        <TableCell>Produits</TableCell>
                        <TableCell>Montant Total</TableCell>
                        <TableCell>Méthode de Paiement</TableCell>
                        <TableCell>Statut</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sales.map((sale) => (
                        <TableRow key={sale.id}>
                            <TableCell>{sale.date ? new Date(sale.date).toLocaleDateString() : 'N/A'}</TableCell>
                            <TableCell>{sale.clientName || 'N/A'}</TableCell>
                            <TableCell>{sale.customerAddress || 'N/A'}</TableCell>
                            <TableCell>{sale.customerPhone || 'N/A'}</TableCell>
                            <TableCell>
                                {sale.products && Array.isArray(sale.products) 
                                    ? sale.products.map(p => `${p.name || 'N/A'} (${p.quantity || 0})`).join(', ')
                                    : 'N/A'
                                }
                            </TableCell>
                            <TableCell>{(sale.totalAmount || 0).toLocaleString()} GNF</TableCell>
                            <TableCell>{sale.paymentMethod || 'N/A'}</TableCell>
                            <TableCell>{sale.status || 'N/A'}</TableCell>
                            <TableCell align="right">
                                <IconButton
                                    color="primary"
                                    onClick={() => handleOpenDialog(sale)}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => handleDelete(sale.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton
                                    color="default"
                                    onClick={() => handlePrintInvoice(sale.id)}
                                >
                                    <PrintIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const renderDashboard = () => (
        <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Total Ventes</Typography>
                        <Typography variant="h4">
                            {salesStats.totalSales || 0}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Chiffre d'affaires</Typography>
                        <Typography variant="h4">
                            {(salesStats.totalRevenue || 0).toLocaleString()} GNF
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Ventes Aujourd'hui</Typography>
                        <Typography variant="h4">
                            {(salesStats.dailyTotal || 0).toLocaleString()} GNF
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Ventes cette Semaine</Typography>
                        <Typography variant="h4">
                            {(salesStats.weeklyTotal || 0).toLocaleString()} GNF
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Ventes ce Mois</Typography>
                        <Typography variant="h4">
                            {(salesStats.monthlyTotal || 0).toLocaleString()} GNF
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Meilleurs Produits</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Produit</TableCell>
                                    <TableCell>Quantité</TableCell>
                                    <TableCell>Revenu</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {salesStats.bestSellingProducts && salesStats.bestSellingProducts.map((product) => (
                                    <TableRow key={product.name}>
                                        <TableCell>{product.name || 'N/A'}</TableCell>
                                        <TableCell>{product.quantity || 0}</TableCell>
                                        <TableCell>
                                            {(product.revenue || 0).toLocaleString()} GNF
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Meilleurs Clients</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Client</TableCell>
                                    <TableCell>Total Achats</TableCell>
                                    <TableCell>Fréquence</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {salesStats.topCustomers && salesStats.topCustomers.map((customer) => (
                                    <TableRow key={customer.name}>
                                        <TableCell>{customer.name || 'N/A'}</TableCell>
                                        <TableCell>
                                            {(customer.totalPurchases || 0).toLocaleString()} GNF
                                        </TableCell>
                                        <TableCell>{customer.frequency || 0}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Gestion des Ventes</Typography>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={currentTab} onChange={handleTabChange}>
                    <Tab label="Tableau de Bord" icon={<AssessmentIcon />} />
                    <Tab label="Liste des Ventes" icon={<DateRangeIcon />} />
                </Tabs>
            </Box>

            {currentTab === 0 ? renderDashboard() : renderSalesTable()}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedSale ? 'Modifier la Vente' : 'Nouvelle Vente'}
                </DialogTitle>
                <DialogContent>
                    {/* Formulaire de vente */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Annuler</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedSale ? 'Modifier' : 'Ajouter'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SalesManagement; 