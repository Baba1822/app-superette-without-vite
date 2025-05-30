import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Remove as RemoveIcon,
    QrCodeScanner as ScannerIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Alert,
    CircularProgress,
    Snackbar,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment
} from '@mui/material';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const CashierInterface = () => {
    const { user, logout } = useAuth();
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountReceived, setAmountReceived] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [changeDue, setChangeDue] = useState(0);

    // Simuler la recherche d'un produit
    const findProduct = (barcode) => {
        const mockProducts = {
            '123456': { id: '1', name: 'Riz local', price: 50000 },
            '789012': { id: '2', name: 'Huile végétale', price: 15000 }
        };
        return mockProducts[barcode];
    };

    const handleScan = () => {
        const barcode = prompt('Entrez le code-barres');
        if (barcode) {
            try {
                const product = findProduct(barcode);
                if (product) {
                    addToCart(product);
                    setSuccess('Produit ajouté au panier');
                } else {
                    setError('Produit non trouvé');
                }
            } catch (err) {
                setError('Erreur lors de la lecture du code-barres');
            }
        }
    };

    const addToCart = (product) => {
        if (!product.id || !product.name || !product.price) {
            setError('Produit invalide');
            return;
        }
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
        if (newQuantity < 0) {
            setError('La quantité ne peut pas être négative');
            return;
        }
        if (newQuantity === 0) {
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
        setSuccess('Produit retiré du panier');
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleAmountReceivedChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d*$/.test(value)) {
            setAmountReceived(value);
            if (value) {
                const received = parseInt(value);
                const total = calculateTotal();
                setChangeDue(received >= total ? received - total : 0);
            } else {
                setChangeDue(0);
            }
        }
    };

    const validateCheckout = () => {
        if (cart.length === 0) {
            setError('Le panier est vide');
            return false;
        }
        if (paymentMethod === 'cash' && (!amountReceived || parseInt(amountReceived) < calculateTotal())) {
            setError('Montant reçu insuffisant');
            return false;
        }
        return true;
    };

    const handleCheckout = async () => {
        if (!validateCheckout()) return;

        setLoading(true);
        try {
            // Simuler un appel API
            await new Promise(resolve => setTimeout(resolve, 1000));

            const receipt = {
                items: cart,
                total: calculateTotal(),
                customerName,
                paymentMethod,
                amountReceived: parseInt(amountReceived),
                changeDue,
                date: new Date(),
                cashier: user?.name
            };

            // TODO: Envoyer receipt au backend
            console.log('Reçu:', receipt);

            setSuccess('Paiement effectué avec succès');
            setCart([]);
            setCustomerName('');
            setPaymentMethod('cash');
            setAmountReceived('');
            setChangeDue(0);
        } catch (err) {
            setError('Erreur lors du paiement');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Snackbar 
                open={!!error} 
                autoHideDuration={6000} 
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
            </Snackbar>

            <Snackbar 
                open={!!success} 
                autoHideDuration={6000} 
                onClose={() => setSuccess(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
            </Snackbar>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Caisse - {user?.name}
                </Typography>
                <Button variant="outlined" onClick={logout}>
                    Déconnexion
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Panier */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Panier</Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<ScannerIcon />}
                                    onClick={handleScan}
                                >
                                    Scanner
                                </Button>
                            </Box>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Produit</TableCell>
                                            <TableCell align="right">Prix</TableCell>
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
                                        {cart.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">
                                                    <Typography color="textSecondary">
                                                        Le panier est vide
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
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
                                        Mobile
                                    </Button>
                                </Box>
                            </Box>

                            {paymentMethod === 'cash' && (
                                <>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <InputLabel>Montant reçu</InputLabel>
                                        <OutlinedInput
                                            type="text"
                                            value={amountReceived}
                                            onChange={handleAmountReceivedChange}
                                            endAdornment={<InputAdornment position="end">GNF</InputAdornment>}
                                            label="Montant reçu"
                                        />
                                    </FormControl>

                                    {changeDue > 0 && (
                                        <Typography color="primary" variant="h6" gutterBottom>
                                            Monnaie à rendre: {changeDue.toLocaleString()} GNF
                                        </Typography>
                                    )}
                                </>
                            )}

                            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                                Total: {calculateTotal().toLocaleString()} GNF
                            </Typography>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handleCheckout}
                                disabled={loading || cart.length === 0}
                            >
                                Valider le paiement
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CashierInterface; 