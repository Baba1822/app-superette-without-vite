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

    useEffect(() => {
        // Simuler le chargement des ventes (à remplacer par un appel API)
        const mockSales = [
            {
                id: 1,
                date: new Date(),
                clientName: 'John Doe',
                products: [
                    { id: 1, name: 'Produit A', quantity: 2, price: 15000 },
                    { id: 2, name: 'Produit B', quantity: 1, price: 25000 },
                ],
                totalAmount: 55000,
                paymentMethod: 'cash',
                status: 'completed',
            },
            // Autres ventes...
        ];
        setSales(mockSales);
        calculateSalesStats(mockSales);
    }, []);

    const calculateSalesStats = (salesData) => {
        const now = new Date();
        const today = now.toDateString();
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));

        const stats = {
            dailyTotal: salesData
                .filter(sale => new Date(sale.date).toDateString() === today)
                .reduce((sum, sale) => sum + sale.totalAmount, 0),
            weeklyTotal: salesData
                .filter(sale => new Date(sale.date) >= weekAgo)
                .reduce((sum, sale) => sum + sale.totalAmount, 0),
            monthlyTotal: salesData
                .filter(sale => new Date(sale.date) >= monthAgo)
                .reduce((sum, sale) => sum + sale.totalAmount, 0),
            bestSellingProducts: calculateBestSellingProducts(salesData),
            topCustomers: calculateTopCustomers(salesData),
        };

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
            if (!customerSales[sale.clientName]) {
                customerSales[sale.clientName] = {
                    totalPurchases: 0,
                    frequency: 0,
                };
            }
            customerSales[sale.clientName].totalPurchases += sale.totalAmount;
            customerSales[sale.clientName].frequency += 1;
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
                            <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                            <TableCell>{sale.clientName}</TableCell>
                            <TableCell>
                                {sale.products.map(p => `${p.name} (${p.quantity})`).join(', ')}
                            </TableCell>
                            <TableCell>{sale.totalAmount.toLocaleString()} FCFA</TableCell>
                            <TableCell>{sale.paymentMethod}</TableCell>
                            <TableCell>{sale.status}</TableCell>
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
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Ventes Aujourd'hui</Typography>
                        <Typography variant="h4">
                            {salesStats.dailyTotal.toLocaleString()} FCFA
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Ventes cette Semaine</Typography>
                        <Typography variant="h4">
                            {salesStats.weeklyTotal.toLocaleString()} FCFA
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Ventes ce Mois</Typography>
                        <Typography variant="h4">
                            {salesStats.monthlyTotal.toLocaleString()} FCFA
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
                                {salesStats.bestSellingProducts.map((product) => (
                                    <TableRow key={product.name}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.quantity}</TableCell>
                                        <TableCell>
                                            {product.revenue.toLocaleString()} FCFA
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
                                {salesStats.topCustomers.map((customer) => (
                                    <TableRow key={customer.name}>
                                        <TableCell>{customer.name}</TableCell>
                                        <TableCell>
                                            {customer.totalPurchases.toLocaleString()} FCFA
                                        </TableCell>
                                        <TableCell>{customer.frequency}</TableCell>
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
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Nouvelle Vente
                </Button>
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