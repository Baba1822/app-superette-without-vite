import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Discount as DiscountIcon,
    Loyalty as LoyaltyIcon,
    Print as PrintIcon,
    Remove as RemoveIcon,
    Undo as ReturnIcon,
    QrCodeScanner as ScannerIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function SellerInterface() {
    const [cart, setCart] = useState([]);
    const [scanDialogOpen, setScanDialogOpen] = useState(false);
    const [barcodeInput, setBarcodeInput] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountReceived, setAmountReceived] = useState('');
    const [discount, setDiscount] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [salesHistory, setSalesHistory] = useState([]);
    const [returnDialogOpen, setReturnDialogOpen] = useState(false);
    const [selectedSaleForReturn, setSelectedSaleForReturn] = useState(null);
    const [stats, setStats] = useState({
        dailySales: 0,
        averageTicket: 0,
        topProducts: [],
        paymentMethods: {}
    });
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [lowStockAlerts, setLowStockAlerts] = useState([]);
    const [commissionRate, setCommissionRate] = useState(5);
    const [reportPeriod, setReportPeriod] = useState('day');
    const [showLowStockAlert, setShowLowStockAlert] = useState(false);
    const [loyaltyDialogOpen, setLoyaltyDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Données mockées pour les rapports
    const reportData = {
        day: [
            { time: '08:00', sales: 120000 },
            { time: '10:00', sales: 250000 },
            { time: '12:00', sales: 180000 },
            { time: '14:00', sales: 300000 },
            { time: '16:00', sales: 220000 },
            { time: '18:00', sales: 150000 }
        ],
        week: [
            { day: 'Lun', sales: 1200000 },
            { day: 'Mar', sales: 1500000 },
            { day: 'Mer', sales: 1300000 },
            { day: 'Jeu', sales: 1400000 },
            { day: 'Ven', sales: 1600000 },
            { day: 'Sam', sales: 2000000 },
            { day: 'Dim', sales: 1800000 }
        ],
        month: [
            { date: '01/06', sales: 5000000 },
            { date: '15/06', sales: 5500000 },
            { date: '30/06', sales: 6000000 }
        ]
    };

    // Simuler des données d'historique
    useEffect(() => {
        const mockHistory = [
            {
                id: '1',
                date: new Date().toISOString(),
                customer: 'Mamadou Diallo',
                items: [
                    { name: 'Riz local', quantity: 2, price: 50000 },
                    { name: 'Huile végétale', quantity: 1, price: 15000 },
                ],
                total: 115000,
                discount: 5000,
                paymentMethod: 'cash',
                seller: 'Vendeur 1'
            },
            // ... autres ventes
        ];
        setSalesHistory(mockHistory);
    }, []);

    // Simuler des statistiques en temps réel
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                dailySales: Math.random() * 1000000,
                averageTicket: Math.random() * 50000,
                topProducts: [
                    { name: 'Riz local', sales: Math.random() * 100 },
                    { name: 'Huile végétale', sales: Math.random() * 50 },
                ],
                paymentMethods: {
                    cash: Math.random() * 50,
                    card: Math.random() * 30,
                    mobile: Math.random() * 20
                }
            }));
        }, 5000); // Mise à jour toutes les 5 secondes

        return () => clearInterval(interval);
    }, []);

    // Simuler des alertes de stock bas
    useEffect(() => {
        const interval = setInterval(() => {
            const mockAlerts = [
                { product: 'Riz local', currentStock: 5, minStock: 10 },
                { product: 'Huile végétale', currentStock: 3, minStock: 5 }
            ];
            setLowStockAlerts(mockAlerts);
            if (mockAlerts.length > 0) {
                setShowLowStockAlert(true);
            }
        }, 30000); // Vérification toutes les 30 secondes

        return () => clearInterval(interval);
    }, []);

    // Fonction pour simuler la recherche d'un produit par code-barres
    const findProductByBarcode = (barcode) => {
        // Ici, vous devrez implémenter la recherche réelle dans votre base de données
        // Pour l'instant, nous utilisons des données mockées
        const mockProducts = {
            '123456': { id: '1', name: 'Riz local', price: 50000, stock: 100 },
            '789012': { id: '2', name: 'Huile végétale', price: 15000, stock: 50 },
        };
        return mockProducts[barcode];
    };

    const handleScan = () => {
        const product = findProductByBarcode(barcodeInput);
        if (product) {
            addToCart(product);
            setBarcodeInput('');
            setScanDialogOpen(false);
        }
    };

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleCheckout = () => {
        // Ici, vous implémenterez la logique de paiement
        console.log('Paiement effectué');
        // Réinitialiser le panier après le paiement
        setCart([]);
        setCustomerName('');
        setPaymentMethod('cash');
        setAmountReceived('');
    };

    const handleDiscount = (percentage) => {
        setDiscount(percentage);
    };

    const calculateTotalWithDiscount = () => {
        const total = calculateTotal();
        return total - (total * discount / 100);
    };

    const handleReturn = (sale) => {
        setSelectedSaleForReturn(sale);
        setReturnDialogOpen(true);
    };

    const processReturn = (returnData) => {
        // Implémenter la logique de retour
        console.log('Retour traité:', returnData);
        setReturnDialogOpen(false);
    };

    // Calculer la commission
    const calculateCommission = (saleAmount) => {
        return (saleAmount * commissionRate) / 100;
    };

    // Gérer les points de fidélité
    const handleLoyaltyPoints = (saleAmount) => {
        const pointsEarned = Math.floor(saleAmount / 10000); // 1 point pour chaque 10 000 GNF
        setLoyaltyPoints(prev => prev + pointsEarned);
    };

    return (
        <Box>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label="Caisse" />
                <Tab label="Historique" />
                <Tab label="Statistiques" />
                <Tab label="Rapports" />
                <Tab label="Fidélité" />
            </Tabs>

            {activeTab === 0 && (
                <Grid container spacing={3}>
                    {/* Panier avec remise */}
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h5">Panier</Typography>
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<DiscountIcon />}
                                            onClick={() => handleDiscount(10)}
                                        >
                                            10%
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<DiscountIcon />}
                                            onClick={() => handleDiscount(20)}
                                        >
                                            20%
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={<ScannerIcon />}
                                            onClick={() => setScanDialogOpen(true)}
                                        >
                                            Scanner
                                        </Button>
                                    </Stack>
                                </Box>

                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Produit</TableCell>
                                                <TableCell align="right">Prix unitaire</TableCell>
                                                <TableCell align="center">Quantité</TableCell>
                                                <TableCell align="right">Total</TableCell>
                                                <TableCell align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {cart.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell align="right">{item.price.toLocaleString()} GNF</TableCell>
                                                    <TableCell align="center">
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                                <RemoveIcon />
                                                            </IconButton>
                                                            <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                                                            <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                                <AddIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">{(item.price * item.quantity).toLocaleString()} GNF</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton onClick={() => removeFromCart(item.id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {discount > 0 && (
                                    <Box sx={{ mt: 2, textAlign: 'right' }}>
                                        <Typography color="textSecondary">
                                            Remise: {discount}%
                                        </Typography>
                                        <Typography variant="h6">
                                            Total après remise: {calculateTotalWithDiscount().toLocaleString()} GNF
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Paiement */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Paiement</Typography>
                                
                                <TextField
                                    fullWidth
                                    label="Nom du client"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    sx={{ mb: 2 }}
                                />

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1">Méthode de paiement</Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant={paymentMethod === 'cash' ? 'contained' : 'outlined'}
                                            onClick={() => setPaymentMethod('cash')}
                                        >
                                            Espèces
                                        </Button>
                                        <Button
                                            variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
                                            onClick={() => setPaymentMethod('card')}
                                        >
                                            Carte
                                        </Button>
                                        <Button
                                            variant={paymentMethod === 'mobile' ? 'contained' : 'outlined'}
                                            onClick={() => setPaymentMethod('mobile')}
                                        >
                                            Mobile Money
                                        </Button>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1">Total</Typography>
                                    <Typography variant="h5">{calculateTotal().toLocaleString()} GNF</Typography>
                                </Box>

                                {paymentMethod === 'cash' && (
                                    <TextField
                                        fullWidth
                                        label="Montant reçu"
                                        type="number"
                                        value={amountReceived}
                                        onChange={(e) => setAmountReceived(e.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                )}

                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={handleCheckout}
                                        disabled={cart.length === 0}
                                    >
                                        Payer
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<PrintIcon />}
                                        onClick={() => window.print()}
                                    >
                                        Ticket
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 1 && (
                <Card sx={{ mt: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Historique des ventes</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Client</TableCell>
                                        <TableCell>Total</TableCell>
                                        <TableCell>Remise</TableCell>
                                        <TableCell>Paiement</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {salesHistory.map((sale) => (
                                        <TableRow key={sale.id}>
                                            <TableCell>{new Date(sale.date).toLocaleString()}</TableCell>
                                            <TableCell>{sale.customer}</TableCell>
                                            <TableCell>{sale.total.toLocaleString()} GNF</TableCell>
                                            <TableCell>{sale.discount}%</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={sale.paymentMethod}
                                                    color={sale.paymentMethod === 'cash' ? 'success' : 'primary'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    startIcon={<ReturnIcon />}
                                                    onClick={() => handleReturn(sale)}
                                                >
                                                    Retour
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}

            {activeTab === 2 && (
                <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Ventes du jour</Typography>
                                <Typography variant="h4">
                                    {stats.dailySales.toLocaleString()} GNF
                                </Typography>
                                <Typography color="textSecondary">
                                    Ticket moyen: {stats.averageTicket.toLocaleString()} GNF
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Produits les plus vendus</Typography>
                                {stats.topProducts.map((product, index) => (
                                    <Box key={index} sx={{ mb: 1 }}>
                                        <Typography>{product.name}</Typography>
                                        <Typography color="textSecondary">
                                            {product.sales.toFixed(0)} unités vendues
                                        </Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Méthodes de paiement</Typography>
                                <Stack direction="row" spacing={2}>
                                    {Object.entries(stats.paymentMethods).map(([method, count]) => (
                                        <Chip
                                            key={method}
                                            label={`${method}: ${count.toFixed(0)}%`}
                                            color="primary"
                                        />
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 3 && (
                <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">Rapports de ventes</Typography>
                                    <FormControl sx={{ minWidth: 120 }}>
                                        <InputLabel>Période</InputLabel>
                                        <Select
                                            value={reportPeriod}
                                            label="Période"
                                            onChange={(e) => setReportPeriod(e.target.value)}
                                        >
                                            <MenuItem value="day">Journalier</MenuItem>
                                            <MenuItem value="week">Hebdomadaire</MenuItem>
                                            <MenuItem value="month">Mensuel</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={reportData[reportPeriod]}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey={reportPeriod === 'day' ? 'time' : reportPeriod === 'week' ? 'day' : 'date'} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Ventes (GNF)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Commission vendeur</Typography>
                                <Typography variant="h4">
                                    {calculateCommission(stats.dailySales).toLocaleString()} GNF
                                </Typography>
                                <Typography color="textSecondary">
                                    Taux: {commissionRate}%
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Alertes stock</Typography>
                                {lowStockAlerts.map((alert, index) => (
                                    <Alert
                                        key={index}
                                        severity="warning"
                                        icon={<WarningIcon />}
                                        sx={{ mb: 1 }}
                                    >
                                        {alert.product}: Stock bas ({alert.currentStock}/{alert.minStock})
                                    </Alert>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 4 && (
                <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Points de fidélité</Typography>
                                <Typography variant="h4">
                                    {loyaltyPoints} points
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<LoyaltyIcon />}
                                    onClick={() => setLoyaltyDialogOpen(true)}
                                    sx={{ mt: 2 }}
                                >
                                    Voir les récompenses
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Historique des points</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Transaction</TableCell>
                                                <TableCell>Points</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{new Date().toLocaleDateString()}</TableCell>
                                                <TableCell>Achat</TableCell>
                                                <TableCell>+10</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Dialog de retour */}
            <Dialog open={returnDialogOpen} onClose={() => setReturnDialogOpen(false)}>
                <DialogTitle>Gestion du retour</DialogTitle>
                <DialogContent>
                    {selectedSaleForReturn && (
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Client: {selectedSaleForReturn.customer}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Date: {new Date(selectedSaleForReturn.date).toLocaleString()}
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Produit</TableCell>
                                            <TableCell>Quantité</TableCell>
                                            <TableCell>Prix</TableCell>
                                            <TableCell>Retour</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedSaleForReturn.items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{item.price.toLocaleString()} GNF</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        inputProps={{ min: 0, max: item.quantity }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReturnDialogOpen(false)}>Annuler</Button>
                    <Button
                        variant="contained"
                        onClick={() => processReturn(selectedSaleForReturn)}
                    >
                        Valider le retour
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog de scan */}
            <Dialog open={scanDialogOpen} onClose={() => setScanDialogOpen(false)}>
                <DialogTitle>Scanner un produit</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Code-barres"
                        fullWidth
                        value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleScan();
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setScanDialogOpen(false)}>Annuler</Button>
                    <Button onClick={handleScan} variant="contained">Valider</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog des récompenses de fidélité */}
            <Dialog open={loyaltyDialogOpen} onClose={() => setLoyaltyDialogOpen(false)}>
                <DialogTitle>Récompenses disponibles</DialogTitle>
                <DialogContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Récompense</TableCell>
                                    <TableCell>Points requis</TableCell>
                                    <TableCell>Statut</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Remise 10%</TableCell>
                                    <TableCell>100 points</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={loyaltyPoints >= 100 ? "Disponible" : "Non disponible"}
                                            color={loyaltyPoints >= 100 ? "success" : "default"}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Produit gratuit</TableCell>
                                    <TableCell>500 points</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={loyaltyPoints >= 500 ? "Disponible" : "Non disponible"}
                                            color={loyaltyPoints >= 500 ? "success" : "default"}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLoyaltyDialogOpen(false)}>Fermer</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar pour les alertes de stock */}
            <Snackbar
                open={showLowStockAlert}
                autoHideDuration={6000}
                onClose={() => setShowLowStockAlert(false)}
            >
                <Alert
                    onClose={() => setShowLowStockAlert(false)}
                    severity="warning"
                    sx={{ width: '100%' }}
                >
                    Attention: Stock bas détecté pour certains produits
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default SellerInterface; 
    Add as AddIcon,
    Delete as DeleteIcon,
    Discount as DiscountIcon,
    Loyalty as LoyaltyIcon,
    Print as PrintIcon,
    Remove as RemoveIcon,
    Undo as ReturnIcon,
    QrCodeScanner as ScannerIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function SellerInterface() {
    const [cart, setCart] = useState([]);
    const [scanDialogOpen, setScanDialogOpen] = useState(false);
    const [barcodeInput, setBarcodeInput] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountReceived, setAmountReceived] = useState('');
    const [discount, setDiscount] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [salesHistory, setSalesHistory] = useState([]);
    const [returnDialogOpen, setReturnDialogOpen] = useState(false);
    const [selectedSaleForReturn, setSelectedSaleForReturn] = useState(null);
    const [stats, setStats] = useState({
        dailySales: 0,
        averageTicket: 0,
        topProducts: [],
        paymentMethods: {}
    });
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [lowStockAlerts, setLowStockAlerts] = useState([]);
    const [commissionRate, setCommissionRate] = useState(5);
    const [reportPeriod, setReportPeriod] = useState('day');
    const [showLowStockAlert, setShowLowStockAlert] = useState(false);
    const [loyaltyDialogOpen, setLoyaltyDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Données mockées pour les rapports
    const reportData = {
        day: [
            { time: '08:00', sales: 120000 },
            { time: '10:00', sales: 250000 },
            { time: '12:00', sales: 180000 },
            { time: '14:00', sales: 300000 },
            { time: '16:00', sales: 220000 },
            { time: '18:00', sales: 150000 }
        ],
        week: [
            { day: 'Lun', sales: 1200000 },
            { day: 'Mar', sales: 1500000 },
            { day: 'Mer', sales: 1300000 },
            { day: 'Jeu', sales: 1400000 },
            { day: 'Ven', sales: 1600000 },
            { day: 'Sam', sales: 2000000 },
            { day: 'Dim', sales: 1800000 }
        ],
        month: [
            { date: '01/06', sales: 5000000 },
            { date: '15/06', sales: 5500000 },
            { date: '30/06', sales: 6000000 }
        ]
    };

    // Simuler des données d'historique
    useEffect(() => {
        const mockHistory = [
            {
                id: '1',
                date: new Date().toISOString(),
                customer: 'Mamadou Diallo',
                items: [
                    { name: 'Riz local', quantity: 2, price: 50000 },
                    { name: 'Huile végétale', quantity: 1, price: 15000 },
                ],
                total: 115000,
                discount: 5000,
                paymentMethod: 'cash',
                seller: 'Vendeur 1'
            },
            // ... autres ventes
        ];
        setSalesHistory(mockHistory);
    }, []);

    // Simuler des statistiques en temps réel
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                dailySales: Math.random() * 1000000,
                averageTicket: Math.random() * 50000,
                topProducts: [
                    { name: 'Riz local', sales: Math.random() * 100 },
                    { name: 'Huile végétale', sales: Math.random() * 50 },
                ],
                paymentMethods: {
                    cash: Math.random() * 50,
                    card: Math.random() * 30,
                    mobile: Math.random() * 20
                }
            }));
        }, 5000); // Mise à jour toutes les 5 secondes

        return () => clearInterval(interval);
    }, []);

    // Simuler des alertes de stock bas
    useEffect(() => {
        const interval = setInterval(() => {
            const mockAlerts = [
                { product: 'Riz local', currentStock: 5, minStock: 10 },
                { product: 'Huile végétale', currentStock: 3, minStock: 5 }
            ];
            setLowStockAlerts(mockAlerts);
            if (mockAlerts.length > 0) {
                setShowLowStockAlert(true);
            }
        }, 30000); // Vérification toutes les 30 secondes

        return () => clearInterval(interval);
    }, []);

    // Fonction pour simuler la recherche d'un produit par code-barres
    const findProductByBarcode = (barcode) => {
        // Ici, vous devrez implémenter la recherche réelle dans votre base de données
        // Pour l'instant, nous utilisons des données mockées
        const mockProducts = {
            '123456': { id: '1', name: 'Riz local', price: 50000, stock: 100 },
            '789012': { id: '2', name: 'Huile végétale', price: 15000, stock: 50 },
        };
        return mockProducts[barcode];
    };

    const handleScan = () => {
        const product = findProductByBarcode(barcodeInput);
        if (product) {
            addToCart(product);
            setBarcodeInput('');
            setScanDialogOpen(false);
        }
    };

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleCheckout = () => {
        // Ici, vous implémenterez la logique de paiement
        console.log('Paiement effectué');
        // Réinitialiser le panier après le paiement
        setCart([]);
        setCustomerName('');
        setPaymentMethod('cash');
        setAmountReceived('');
    };

    const handleDiscount = (percentage) => {
        setDiscount(percentage);
    };

    const calculateTotalWithDiscount = () => {
        const total = calculateTotal();
        return total - (total * discount / 100);
    };

    const handleReturn = (sale) => {
        setSelectedSaleForReturn(sale);
        setReturnDialogOpen(true);
    };

    const processReturn = (returnData) => {
        // Implémenter la logique de retour
        console.log('Retour traité:', returnData);
        setReturnDialogOpen(false);
    };

    // Calculer la commission
    const calculateCommission = (saleAmount) => {
        return (saleAmount * commissionRate) / 100;
    };

    // Gérer les points de fidélité
    const handleLoyaltyPoints = (saleAmount) => {
        const pointsEarned = Math.floor(saleAmount / 10000); // 1 point pour chaque 10 000 GNF
        setLoyaltyPoints(prev => prev + pointsEarned);
    };

    return (
        <Box>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label="Caisse" />
                <Tab label="Historique" />
                <Tab label="Statistiques" />
                <Tab label="Rapports" />
                <Tab label="Fidélité" />
            </Tabs>

            {activeTab === 0 && (
                <Grid container spacing={3}>
                    {/* Panier avec remise */}
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h5">Panier</Typography>
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<DiscountIcon />}
                                            onClick={() => handleDiscount(10)}
                                        >
                                            10%
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<DiscountIcon />}
                                            onClick={() => handleDiscount(20)}
                                        >
                                            20%
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={<ScannerIcon />}
                                            onClick={() => setScanDialogOpen(true)}
                                        >
                                            Scanner
                                        </Button>
                                    </Stack>
                                </Box>

                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Produit</TableCell>
                                                <TableCell align="right">Prix unitaire</TableCell>
                                                <TableCell align="center">Quantité</TableCell>
                                                <TableCell align="right">Total</TableCell>
                                                <TableCell align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {cart.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell align="right">{item.price.toLocaleString()} GNF</TableCell>
                                                    <TableCell align="center">
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                                <RemoveIcon />
                                                            </IconButton>
                                                            <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                                                            <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                                <AddIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">{(item.price * item.quantity).toLocaleString()} GNF</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton onClick={() => removeFromCart(item.id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {discount > 0 && (
                                    <Box sx={{ mt: 2, textAlign: 'right' }}>
                                        <Typography color="textSecondary">
                                            Remise: {discount}%
                                        </Typography>
                                        <Typography variant="h6">
                                            Total après remise: {calculateTotalWithDiscount().toLocaleString()} GNF
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Paiement */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Paiement</Typography>
                                
                                <TextField
                                    fullWidth
                                    label="Nom du client"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    sx={{ mb: 2 }}
                                />

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1">Méthode de paiement</Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant={paymentMethod === 'cash' ? 'contained' : 'outlined'}
                                            onClick={() => setPaymentMethod('cash')}
                                        >
                                            Espèces
                                        </Button>
                                        <Button
                                            variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
                                            onClick={() => setPaymentMethod('card')}
                                        >
                                            Carte
                                        </Button>
                                        <Button
                                            variant={paymentMethod === 'mobile' ? 'contained' : 'outlined'}
                                            onClick={() => setPaymentMethod('mobile')}
                                        >
                                            Mobile Money
                                        </Button>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1">Total</Typography>
                                    <Typography variant="h5">{calculateTotal().toLocaleString()} GNF</Typography>
                                </Box>

                                {paymentMethod === 'cash' && (
                                    <TextField
                                        fullWidth
                                        label="Montant reçu"
                                        type="number"
                                        value={amountReceived}
                                        onChange={(e) => setAmountReceived(e.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                )}

                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={handleCheckout}
                                        disabled={cart.length === 0}
                                    >
                                        Payer
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<PrintIcon />}
                                        onClick={() => window.print()}
                                    >
                                        Ticket
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 1 && (
                <Card sx={{ mt: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Historique des ventes</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Client</TableCell>
                                        <TableCell>Total</TableCell>
                                        <TableCell>Remise</TableCell>
                                        <TableCell>Paiement</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {salesHistory.map((sale) => (
                                        <TableRow key={sale.id}>
                                            <TableCell>{new Date(sale.date).toLocaleString()}</TableCell>
                                            <TableCell>{sale.customer}</TableCell>
                                            <TableCell>{sale.total.toLocaleString()} GNF</TableCell>
                                            <TableCell>{sale.discount}%</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={sale.paymentMethod}
                                                    color={sale.paymentMethod === 'cash' ? 'success' : 'primary'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    startIcon={<ReturnIcon />}
                                                    onClick={() => handleReturn(sale)}
                                                >
                                                    Retour
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}

            {activeTab === 2 && (
                <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Ventes du jour</Typography>
                                <Typography variant="h4">
                                    {stats.dailySales.toLocaleString()} GNF
                                </Typography>
                                <Typography color="textSecondary">
                                    Ticket moyen: {stats.averageTicket.toLocaleString()} GNF
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Produits les plus vendus</Typography>
                                {stats.topProducts.map((product, index) => (
                                    <Box key={index} sx={{ mb: 1 }}>
                                        <Typography>{product.name}</Typography>
                                        <Typography color="textSecondary">
                                            {product.sales.toFixed(0)} unités vendues
                                        </Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Méthodes de paiement</Typography>
                                <Stack direction="row" spacing={2}>
                                    {Object.entries(stats.paymentMethods).map(([method, count]) => (
                                        <Chip
                                            key={method}
                                            label={`${method}: ${count.toFixed(0)}%`}
                                            color="primary"
                                        />
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 3 && (
                <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">Rapports de ventes</Typography>
                                    <FormControl sx={{ minWidth: 120 }}>
                                        <InputLabel>Période</InputLabel>
                                        <Select
                                            value={reportPeriod}
                                            label="Période"
                                            onChange={(e) => setReportPeriod(e.target.value)}
                                        >
                                            <MenuItem value="day">Journalier</MenuItem>
                                            <MenuItem value="week">Hebdomadaire</MenuItem>
                                            <MenuItem value="month">Mensuel</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={reportData[reportPeriod]}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey={reportPeriod === 'day' ? 'time' : reportPeriod === 'week' ? 'day' : 'date'} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Ventes (GNF)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Commission vendeur</Typography>
                                <Typography variant="h4">
                                    {calculateCommission(stats.dailySales).toLocaleString()} GNF
                                </Typography>
                                <Typography color="textSecondary">
                                    Taux: {commissionRate}%
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Alertes stock</Typography>
                                {lowStockAlerts.map((alert, index) => (
                                    <Alert
                                        key={index}
                                        severity="warning"
                                        icon={<WarningIcon />}
                                        sx={{ mb: 1 }}
                                    >
                                        {alert.product}: Stock bas ({alert.currentStock}/{alert.minStock})
                                    </Alert>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 4 && (
                <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Points de fidélité</Typography>
                                <Typography variant="h4">
                                    {loyaltyPoints} points
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<LoyaltyIcon />}
                                    onClick={() => setLoyaltyDialogOpen(true)}
                                    sx={{ mt: 2 }}
                                >
                                    Voir les récompenses
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Historique des points</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Transaction</TableCell>
                                                <TableCell>Points</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{new Date().toLocaleDateString()}</TableCell>
                                                <TableCell>Achat</TableCell>
                                                <TableCell>+10</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Dialog de retour */}
            <Dialog open={returnDialogOpen} onClose={() => setReturnDialogOpen(false)}>
                <DialogTitle>Gestion du retour</DialogTitle>
                <DialogContent>
                    {selectedSaleForReturn && (
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Client: {selectedSaleForReturn.customer}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Date: {new Date(selectedSaleForReturn.date).toLocaleString()}
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Produit</TableCell>
                                            <TableCell>Quantité</TableCell>
                                            <TableCell>Prix</TableCell>
                                            <TableCell>Retour</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedSaleForReturn.items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{item.price.toLocaleString()} GNF</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        inputProps={{ min: 0, max: item.quantity }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReturnDialogOpen(false)}>Annuler</Button>
                    <Button
                        variant="contained"
                        onClick={() => processReturn(selectedSaleForReturn)}
                    >
                        Valider le retour
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog de scan */}
            <Dialog open={scanDialogOpen} onClose={() => setScanDialogOpen(false)}>
                <DialogTitle>Scanner un produit</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Code-barres"
                        fullWidth
                        value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleScan();
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setScanDialogOpen(false)}>Annuler</Button>
                    <Button onClick={handleScan} variant="contained">Valider</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog des récompenses de fidélité */}
            <Dialog open={loyaltyDialogOpen} onClose={() => setLoyaltyDialogOpen(false)}>
                <DialogTitle>Récompenses disponibles</DialogTitle>
                <DialogContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Récompense</TableCell>
                                    <TableCell>Points requis</TableCell>
                                    <TableCell>Statut</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Remise 10%</TableCell>
                                    <TableCell>100 points</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={loyaltyPoints >= 100 ? "Disponible" : "Non disponible"}
                                            color={loyaltyPoints >= 100 ? "success" : "default"}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Produit gratuit</TableCell>
                                    <TableCell>500 points</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={loyaltyPoints >= 500 ? "Disponible" : "Non disponible"}
                                            color={loyaltyPoints >= 500 ? "success" : "default"}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLoyaltyDialogOpen(false)}>Fermer</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar pour les alertes de stock */}
            <Snackbar
                open={showLowStockAlert}
                autoHideDuration={6000}
                onClose={() => setShowLowStockAlert(false)}
            >
                <Alert
                    onClose={() => setShowLowStockAlert(false)}
                    severity="warning"
                    sx={{ width: '100%' }}
                >
                    Attention: Stock bas détecté pour certains produits
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default SellerInterface; 
    Add as AddIcon,
    Delete as DeleteIcon,
    Discount as DiscountIcon,
    Loyalty as LoyaltyIcon,
    Print as PrintIcon,
    Remove as RemoveIcon,
    Undo as ReturnIcon,
    QrCodeScanner as ScannerIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function SellerInterface() {
    const [cart, setCart] = useState([]);
    const [scanDialogOpen, setScanDialogOpen] = useState(false);
    const [barcodeInput, setBarcodeInput] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountReceived, setAmountReceived] = useState('');
    const [discount, setDiscount] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [salesHistory, setSalesHistory] = useState([]);
    const [returnDialogOpen, setReturnDialogOpen] = useState(false);
    const [selectedSaleForReturn, setSelectedSaleForReturn] = useState(null);
    const [stats, setStats] = useState({
        dailySales: 0,
        averageTicket: 0,
        topProducts: [],
        paymentMethods: {}
    });
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [lowStockAlerts, setLowStockAlerts] = useState([]);
    const [commissionRate, setCommissionRate] = useState(5);
    const [reportPeriod, setReportPeriod] = useState('day');
    const [showLowStockAlert, setShowLowStockAlert] = useState(false);
    const [loyaltyDialogOpen, setLoyaltyDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Données mockées pour les rapports
    const reportData = {
        day: [
            { time: '08:00', sales: 120000 },
            { time: '10:00', sales: 250000 },
            { time: '12:00', sales: 180000 },
            { time: '14:00', sales: 300000 },
            { time: '16:00', sales: 220000 },
            { time: '18:00', sales: 150000 }
        ],
        week: [
            { day: 'Lun', sales: 1200000 },
            { day: 'Mar', sales: 1500000 },
            { day: 'Mer', sales: 1300000 },
            { day: 'Jeu', sales: 1400000 },
            { day: 'Ven', sales: 1600000 },
            { day: 'Sam', sales: 2000000 },
            { day: 'Dim', sales: 1800000 }
        ],
        month: [
            { date: '01/06', sales: 5000000 },
            { date: '15/06', sales: 5500000 },
            { date: '30/06', sales: 6000000 }
        ]
    };

    // Simuler des données d'historique
    useEffect(() => {
        const mockHistory = [
            {
                id: '1',
                date: new Date().toISOString(),
                customer: 'Mamadou Diallo',
                items: [
                    { name: 'Riz local', quantity: 2, price: 50000 },
                    { name: 'Huile végétale', quantity: 1, price: 15000 },
                ],
                total: 115000,
                discount: 5000,
                paymentMethod: 'cash',
                seller: 'Vendeur 1'
            },
            // ... autres ventes
        ];
        setSalesHistory(mockHistory);
    }, []);

    // Simuler des statistiques en temps réel
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                dailySales: Math.random() * 1000000,
                averageTicket: Math.random() * 50000,
                topProducts: [
                    { name: 'Riz local', sales: Math.random() * 100 },
                    { name: 'Huile végétale', sales: Math.random() * 50 },
                ],
                paymentMethods: {
                    cash: Math.random() * 50,
                    card: Math.random() * 30,
                    mobile: Math.random() * 20
                }
            }));
        }, 5000); // Mise à jour toutes les 5 secondes

        return () => clearInterval(interval);
    }, []);

    // Simuler des alertes de stock bas
    useEffect(() => {
        const interval = setInterval(() => {
            const mockAlerts = [
                { product: 'Riz local', currentStock: 5, minStock: 10 },
                { product: 'Huile végétale', currentStock: 3, minStock: 5 }
            ];
            setLowStockAlerts(mockAlerts);
            if (mockAlerts.length > 0) {
                setShowLowStockAlert(true);
            }
        }, 30000); // Vérification toutes les 30 secondes

        return () => clearInterval(interval);
    }, []);

    // Fonction pour simuler la recherche d'un produit par code-barres
    const findProductByBarcode = (barcode) => {
        // Ici, vous devrez implémenter la recherche réelle dans votre base de données
        // Pour l'instant, nous utilisons des données mockées
        const mockProducts = {
            '123456': { id: '1', name: 'Riz local', price: 50000, stock: 100 },
            '789012': { id: '2', name: 'Huile végétale', price: 15000, stock: 50 },
        };
        return mockProducts[barcode];
    };

    const handleScan = () => {
        const product = findProductByBarcode(barcodeInput);
        if (product) {
            addToCart(product);
            setBarcodeInput('');
            setScanDialogOpen(false);
        }
    };

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleCheckout = () => {
        // Ici, vous implémenterez la logique de paiement
        console.log('Paiement effectué');
        // Réinitialiser le panier après le paiement
        setCart([]);
        setCustomerName('');
        setPaymentMethod('cash');
        setAmountReceived('');
    };

    const handleDiscount = (percentage) => {
        setDiscount(percentage);
    };

    const calculateTotalWithDiscount = () => {
        const total = calculateTotal();
        return total - (total * discount / 100);
    };

    const handleReturn = (sale) => {
        setSelectedSaleForReturn(sale);
        setReturnDialogOpen(true);
    };

    const processReturn = (returnData) => {
        // Implémenter la logique de retour
        console.log('Retour traité:', returnData);
        setReturnDialogOpen(false);
    };

    // Calculer la commission
    const calculateCommission = (saleAmount) => {
        return (saleAmount * commissionRate) / 100;
    };

    // Gérer les points de fidélité
    const handleLoyaltyPoints = (saleAmount) => {
        const pointsEarned = Math.floor(saleAmount / 10000); // 1 point pour chaque 10 000 GNF
        setLoyaltyPoints(prev => prev + pointsEarned);
    };

    return (
        <Box>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label="Caisse" />
                <Tab label="Historique" />
                <Tab label="Statistiques" />
                <Tab label="Rapports" />
                <Tab label="Fidélité" />
            </Tabs>

            {activeTab === 0 && (
                <Grid container spacing={3}>
                    {/* Panier avec remise */}
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h5">Panier</Typography>
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<DiscountIcon />}
                                            onClick={() => handleDiscount(10)}
                                        >
                                            10%
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<DiscountIcon />}
                                            onClick={() => handleDiscount(20)}
                                        >
                                            20%
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={<ScannerIcon />}
                                            onClick={() => setScanDialogOpen(true)}
                                        >
                                            Scanner
                                        </Button>
                                    </Stack>
                                </Box>

                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Produit</TableCell>
                                                <TableCell align="right">Prix unitaire</TableCell>
                                                <TableCell align="center">Quantité</TableCell>
                                                <TableCell align="right">Total</TableCell>
                                                <TableCell align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {cart.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell align="right">{item.price.toLocaleString()} GNF</TableCell>
                                                    <TableCell align="center">
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                                <RemoveIcon />
                                                            </IconButton>
                                                            <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                                                            <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                                <AddIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">{(item.price * item.quantity).toLocaleString()} GNF</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton onClick={() => removeFromCart(item.id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {discount > 0 && (
                                    <Box sx={{ mt: 2, textAlign: 'right' }}>
                                        <Typography color="textSecondary">
                                            Remise: {discount}%
                                        </Typography>
                                        <Typography variant="h6">
                                            Total après remise: {calculateTotalWithDiscount().toLocaleString()} GNF
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Paiement */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Paiement</Typography>
                                
                                <TextField
                                    fullWidth
                                    label="Nom du client"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    sx={{ mb: 2 }}
                                />

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1">Méthode de paiement</Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant={paymentMethod === 'cash' ? 'contained' : 'outlined'}
                                            onClick={() => setPaymentMethod('cash')}
                                        >
                                            Espèces
                                        </Button>
                                        <Button
                                            variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
                                            onClick={() => setPaymentMethod('card')}
                                        >
                                            Carte
                                        </Button>
                                        <Button
                                            variant={paymentMethod === 'mobile' ? 'contained' : 'outlined'}
                                            onClick={() => setPaymentMethod('mobile')}
                                        >
                                            Mobile Money
                                        </Button>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1">Total</Typography>
                                    <Typography variant="h5">{calculateTotal().toLocaleString()} GNF</Typography>
                                </Box>

                                {paymentMethod === 'cash' && (
                                    <TextField
                                        fullWidth
                                        label="Montant reçu"
                                        type="number"
                                        value={amountReceived}
                                        onChange={(e) => setAmountReceived(e.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                )}

                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={handleCheckout}
                                        disabled={cart.length === 0}
                                    >
                                        Payer
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<PrintIcon />}
                                        onClick={() => window.print()}
                                    >
                                        Ticket
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 1 && (
                <Card sx={{ mt: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Historique des ventes</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Client</TableCell>
                                        <TableCell>Total</TableCell>
                                        <TableCell>Remise</TableCell>
                                        <TableCell>Paiement</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {salesHistory.map((sale) => (
                                        <TableRow key={sale.id}>
                                            <TableCell>{new Date(sale.date).toLocaleString()}</TableCell>
                                            <TableCell>{sale.customer}</TableCell>
                                            <TableCell>{sale.total.toLocaleString()} GNF</TableCell>
                                            <TableCell>{sale.discount}%</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={sale.paymentMethod}
                                                    color={sale.paymentMethod === 'cash' ? 'success' : 'primary'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    startIcon={<ReturnIcon />}
                                                    onClick={() => handleReturn(sale)}
                                                >
                                                    Retour
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}

            {activeTab === 2 && (
                <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Ventes du jour</Typography>
                                <Typography variant="h4">
                                    {stats.dailySales.toLocaleString()} GNF
                                </Typography>
                                <Typography color="textSecondary">
                                    Ticket moyen: {stats.averageTicket.toLocaleString()} GNF
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Produits les plus vendus</Typography>
                                {stats.topProducts.map((product, index) => (
                                    <Box key={index} sx={{ mb: 1 }}>
                                        <Typography>{product.name}</Typography>
                                        <Typography color="textSecondary">
                                            {product.sales.toFixed(0)} unités vendues
                                        </Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Méthodes de paiement</Typography>
                                <Stack direction="row" spacing={2}>
                                    {Object.entries(stats.paymentMethods).map(([method, count]) => (
                                        <Chip
                                            key={method}
                                            label={`${method}: ${count.toFixed(0)}%`}
                                            color="primary"
                                        />
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 3 && (
                <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">Rapports de ventes</Typography>
                                    <FormControl sx={{ minWidth: 120 }}>
                                        <InputLabel>Période</InputLabel>
                                        <Select
                                            value={reportPeriod}
                                            label="Période"
                                            onChange={(e) => setReportPeriod(e.target.value)}
                                        >
                                            <MenuItem value="day">Journalier</MenuItem>
                                            <MenuItem value="week">Hebdomadaire</MenuItem>
                                            <MenuItem value="month">Mensuel</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={reportData[reportPeriod]}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey={reportPeriod === 'day' ? 'time' : reportPeriod === 'week' ? 'day' : 'date'} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Ventes (GNF)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Commission vendeur</Typography>
                                <Typography variant="h4">
                                    {calculateCommission(stats.dailySales).toLocaleString()} GNF
                                </Typography>
                                <Typography color="textSecondary">
                                    Taux: {commissionRate}%
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Alertes stock</Typography>
                                {lowStockAlerts.map((alert, index) => (
                                    <Alert
                                        key={index}
                                        severity="warning"
                                        icon={<WarningIcon />}
                                        sx={{ mb: 1 }}
                                    >
                                        {alert.product}: Stock bas ({alert.currentStock}/{alert.minStock})
                                    </Alert>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 4 && (
                <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Points de fidélité</Typography>
                                <Typography variant="h4">
                                    {loyaltyPoints} points
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<LoyaltyIcon />}
                                    onClick={() => setLoyaltyDialogOpen(true)}
                                    sx={{ mt: 2 }}
                                >
                                    Voir les récompenses
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Historique des points</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Transaction</TableCell>
                                                <TableCell>Points</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{new Date().toLocaleDateString()}</TableCell>
                                                <TableCell>Achat</TableCell>
                                                <TableCell>+10</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Dialog de retour */}
            <Dialog open={returnDialogOpen} onClose={() => setReturnDialogOpen(false)}>
                <DialogTitle>Gestion du retour</DialogTitle>
                <DialogContent>
                    {selectedSaleForReturn && (
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Client: {selectedSaleForReturn.customer}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Date: {new Date(selectedSaleForReturn.date).toLocaleString()}
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Produit</TableCell>
                                            <TableCell>Quantité</TableCell>
                                            <TableCell>Prix</TableCell>
                                            <TableCell>Retour</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedSaleForReturn.items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{item.price.toLocaleString()} GNF</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        inputProps={{ min: 0, max: item.quantity }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReturnDialogOpen(false)}>Annuler</Button>
                    <Button
                        variant="contained"
                        onClick={() => processReturn(selectedSaleForReturn)}
                    >
                        Valider le retour
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog de scan */}
            <Dialog open={scanDialogOpen} onClose={() => setScanDialogOpen(false)}>
                <DialogTitle>Scanner un produit</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Code-barres"
                        fullWidth
                        value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleScan();
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setScanDialogOpen(false)}>Annuler</Button>
                    <Button onClick={handleScan} variant="contained">Valider</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog des récompenses de fidélité */}
            <Dialog open={loyaltyDialogOpen} onClose={() => setLoyaltyDialogOpen(false)}>
                <DialogTitle>Récompenses disponibles</DialogTitle>
                <DialogContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Récompense</TableCell>
                                    <TableCell>Points requis</TableCell>
                                    <TableCell>Statut</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Remise 10%</TableCell>
                                    <TableCell>100 points</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={loyaltyPoints >= 100 ? "Disponible" : "Non disponible"}
                                            color={loyaltyPoints >= 100 ? "success" : "default"}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Produit gratuit</TableCell>
                                    <TableCell>500 points</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={loyaltyPoints >= 500 ? "Disponible" : "Non disponible"}
                                            color={loyaltyPoints >= 500 ? "success" : "default"}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLoyaltyDialogOpen(false)}>Fermer</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar pour les alertes de stock */}
            <Snackbar
                open={showLowStockAlert}
                autoHideDuration={6000}
                onClose={() => setShowLowStockAlert(false)}
            >
                <Alert
                    onClose={() => setShowLowStockAlert(false)}
                    severity="warning"
                    sx={{ width: '100%' }}
                >
                    Attention: Stock bas détecté pour certains produits
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default SellerInterface; 