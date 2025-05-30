import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Inventory as InventoryIcon,
    Notifications as NotificationsIcon,
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
    Grid,
    IconButton,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

// Données initiales pour les tests
const initialProducts = [
    {
        id: 1,
        name: 'Riz',
        category: 'Alimentaire',
        quantity: 50,
        minQuantity: 100,
        maxQuantity: 200,
        price: 15000,
        unit: 'kg',
        supplier: 'Fournisseur A'
    },
    {
        id: 2,
        name: 'Huile',
        category: 'Alimentaire',
        quantity: 30,
        minQuantity: 80,
        maxQuantity: 150,
        price: 25000,
        unit: 'L',
        supplier: 'Fournisseur B'
    }
];

function Inventory() {
    const [products, setProducts] = useState(initialProducts);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Vérifier les niveaux de stock bas
    useEffect(() => {
        const checkLowStock = () => {
            const newAlerts = products
                .filter(product => product.quantity < product.minQuantity)
                .map(product => ({
                    id: Date.now(),
                    productId: product.id,
                    message: `Stock bas pour ${product.name} (${product.quantity} ${product.unit})`,
                    severity: 'warning'
                }));
            setAlerts(newAlerts);
    };

        checkLowStock();
    }, [products]);

    const handleAddProduct = () => {
        setSelectedProduct({
            name: '',
            category: '',
            quantity: 0,
            minQuantity: 0,
            maxQuantity: 0,
            price: 0,
            unit: '',
            supplier: ''
        });
        setOpenDialog(true);
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setOpenDialog(true);
    };

    const handleDeleteProduct = (productId) => {
        setProducts(products.filter(p => p.id !== productId));
        setSnackbar({
            open: true,
            message: 'Produit supprimé avec succès',
            severity: 'success'
        });
    };

    const handleSaveProduct = () => {
        if (selectedProduct.id) {
            // Modification
            setProducts(products.map(p =>
                p.id === selectedProduct.id ? selectedProduct : p
            ));
            setSnackbar({
                open: true,
                message: 'Produit modifié avec succès',
                severity: 'success'
            });
        } else {
            // Ajout
            const newProduct = {
                ...selectedProduct,
                id: Math.max(...products.map(p => p.id)) + 1
            };
            setProducts([...products, newProduct]);
            setSnackbar({
                open: true,
                message: 'Produit ajouté avec succès',
                severity: 'success'
            });
        }
        setOpenDialog(false);
    };

    const isStockLow = (product) => {
        return product.quantity < product.minQuantity;
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* En-tête avec statistiques */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <InventoryIcon color="primary" sx={{ mr: 1 }} />
                                <Typography color="textSecondary">
                                    Total des produits
                                </Typography>
                            </Box>
                            <Typography variant="h4">
                                {products.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <WarningIcon color="warning" sx={{ mr: 1 }} />
                                <Typography color="textSecondary">
                                    Alertes de stock
                                </Typography>
                            </Box>
                            <Typography variant="h4">
                                {alerts.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <NotificationsIcon color="error" sx={{ mr: 1 }} />
                                <Typography color="textSecondary">
                                    Stock critique
                                </Typography>
                            </Box>
                            <Typography variant="h4">
                                {products.filter(p => p.quantity === 0).length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Liste des produits */}
            <Paper sx={{ mb: 3 }}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                        Gestion des stocks
                    </Typography>
                            <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddProduct}
                            >
                        Ajouter un produit
                            </Button>
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nom</TableCell>
                                        <TableCell>Catégorie</TableCell>
                                        <TableCell>Quantité</TableCell>
                                <TableCell>Stock min/max</TableCell>
                                <TableCell>Prix (GNF)</TableCell>
                                        <TableCell>Fournisseur</TableCell>
                                        <TableCell>Statut</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                            {products.map((product) => (
                                <TableRow 
                                    key={product.id}
                                    sx={isStockLow(product) ? { backgroundColor: 'error.light' } : {}}
                                >
                                            <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {product.name}
                                            {isStockLow(product) && (
                                                <WarningIcon 
                                                    color="error" 
                                                    sx={{ ml: 1 }}
                                                    fontSize="small"
                                                />
                                            )}
                                        </Box>
                                                            </TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>{product.quantity} {product.unit}</TableCell>
                                    <TableCell>{product.minQuantity}/{product.maxQuantity}</TableCell>
                                    <TableCell>{product.price.toLocaleString()}</TableCell>
                                    <TableCell>{product.supplier}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={
                                                product.quantity === 0 ? 'Rupture' :
                                                isStockLow(product) ? 'Stock bas' : 'Normal'
                                                                    }
                                                                    color={
                                                product.quantity === 0 ? 'error' :
                                                isStockLow(product) ? 'warning' : 'success'
                                                                    }
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                    <TableCell align="right">
                                        <IconButton 
                                            color="primary"
                                            onClick={() => handleEditProduct(product)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteProduct(product.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
            </Paper>

            {/* Alertes de stock */}
            {alerts.length > 0 && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Alertes de stock
                    </Typography>
                    {alerts.map((alert) => (
                        <Alert 
                            key={alert.id}
                            severity={alert.severity}
                            sx={{ mb: 1 }}
                        >
                            {alert.message}
                        </Alert>
                    ))}
                </Paper>
            )}

            {/* Dialog d'ajout/modification */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {selectedProduct?.id ? 'Modifier le produit' : 'Ajouter un produit'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nom du produit"
                                value={selectedProduct?.name || ''}
                                onChange={(e) => setSelectedProduct({
                                    ...selectedProduct,
                                    name: e.target.value
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Catégorie"
                                value={selectedProduct?.category || ''}
                                onChange={(e) => setSelectedProduct({
                                    ...selectedProduct,
                                    category: e.target.value
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Quantité"
                                value={selectedProduct?.quantity || 0}
                                onChange={(e) => setSelectedProduct({
                                    ...selectedProduct,
                                    quantity: parseInt(e.target.value)
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Unité"
                                value={selectedProduct?.unit || ''}
                                onChange={(e) => setSelectedProduct({
                                    ...selectedProduct,
                                    unit: e.target.value
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Stock minimum"
                                value={selectedProduct?.minQuantity || 0}
                                onChange={(e) => setSelectedProduct({
                                    ...selectedProduct,
                                    minQuantity: parseInt(e.target.value)
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Stock maximum"
                                value={selectedProduct?.maxQuantity || 0}
                                onChange={(e) => setSelectedProduct({
                                    ...selectedProduct,
                                    maxQuantity: parseInt(e.target.value)
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Prix (GNF)"
                                value={selectedProduct?.price || 0}
                                onChange={(e) => setSelectedProduct({
                                    ...selectedProduct,
                                    price: parseInt(e.target.value)
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Fournisseur"
                                value={selectedProduct?.supplier || ''}
                                onChange={(e) => setSelectedProduct({
                                    ...selectedProduct,
                                    supplier: e.target.value
                                })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        Annuler
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveProduct}
                    >
                        {selectedProduct?.id ? 'Modifier' : 'Ajouter'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar pour les notifications */}
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
}

export default Inventory; 