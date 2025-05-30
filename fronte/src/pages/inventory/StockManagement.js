import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import StockAlerts from '../../components/inventory/StockAlerts';
import StockNotificationService from '../../services/StockNotificationService';

// Seuil d'alerte pour stock bas (à déplacer dans les paramètres système plus tard)
const LOW_STOCK_THRESHOLD = 10;

const StockManagement = () => {
    const [products, setProducts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        quantity: '',
        minQuantity: '',
        maxQuantity: '',
        price: '',
        unit: '',
        supplier: '',
    });
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [showAlerts, setShowAlerts] = useState(true);

    // Simuler le chargement des produits (à remplacer par un appel API)
    useEffect(() => {
        // Données de test
        setProducts([
            {
                id: 1,
                name: 'Riz local',
                description: 'Riz local de qualité supérieure',
                category: 'Céréales',
                quantity: 50,
                minQuantity: 20,
                maxQuantity: 100,
                price: 15000,
                unit: 'kg',
                supplier: 'Fournisseur A'
            },
            // Autres produits...
        ]);
    }, []);

    const handleOpenDialog = (product = null) => {
        if (product) {
            setSelectedProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                category: product.category,
                quantity: product.quantity.toString(),
                minQuantity: product.minQuantity.toString(),
                maxQuantity: product.maxQuantity.toString(),
                price: product.price.toString(),
                unit: product.unit,
                supplier: product.supplier,
            });
        } else {
            setSelectedProduct(null);
            setFormData({
                name: '',
                description: '',
                category: '',
                quantity: '',
                minQuantity: '',
                maxQuantity: '',
                price: '',
                unit: '',
                supplier: '',
            });
        }
        setErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedProduct(null);
        setFormData({
            name: '',
            description: '',
            category: '',
            quantity: '',
            minQuantity: '',
            maxQuantity: '',
            price: '',
            unit: '',
            supplier: '',
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Le nom est requis';
        if (!formData.quantity) newErrors.quantity = 'La quantité est requise';
        if (isNaN(formData.quantity)) newErrors.quantity = 'La quantité doit être un nombre';
        if (!formData.price) newErrors.price = 'Le prix est requis';
        if (isNaN(formData.price)) newErrors.price = 'Le prix doit être un nombre';
        if (!formData.minQuantity) newErrors.minQuantity = 'La quantité minimale est requise';
        if (!formData.maxQuantity) newErrors.maxQuantity = 'La quantité maximale est requise';
        if (parseInt(formData.minQuantity) >= parseInt(formData.maxQuantity)) {
            newErrors.minQuantity = 'La quantité minimale doit être inférieure à la quantité maximale';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const productData = {
            ...formData,
            quantity: parseInt(formData.quantity),
            minQuantity: parseInt(formData.minQuantity),
            maxQuantity: parseInt(formData.maxQuantity),
            price: parseFloat(formData.price),
        };

        if (selectedProduct) {
            // Mise à jour du produit
            setProducts(products.map(p => 
                p.id === selectedProduct.id ? { ...p, ...productData } : p
            ));
            setSnackbar({
                open: true,
                message: 'Produit mis à jour avec succès',
                severity: 'success'
            });
        } else {
            // Ajout d'un nouveau produit
            setProducts([...products, { id: Date.now(), ...productData }]);
            setSnackbar({
                open: true,
                message: 'Produit ajouté avec succès',
                severity: 'success'
            });
        }

        handleCloseDialog();
    };

    const handleDelete = (productId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            setProducts(products.filter(p => p.id !== productId));
            setSnackbar({
                open: true,
                message: 'Produit supprimé avec succès',
                severity: 'success'
            });
        }
    };

    const isStockLow = (product) => {
        return product.quantity <= product.minQuantity;
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleNotifySupplier = async (product) => {
        try {
            const supplier = {
                email: product.supplier.email,
                phone: product.supplier.phone
            };
            
            const result = await StockNotificationService.notifyLowStock(supplier, product);
            
            setSnackbar({
                open: true,
                message: result.success ? 'Notification envoyée avec succès' : result.message,
                severity: result.success ? 'success' : 'error'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Erreur lors de l\'envoi de la notification',
                severity: 'error'
            });
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Gestion des Stocks</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Ajouter un Produit
                </Button>
            </Box>

            {showAlerts && (
                <Box sx={{ mb: 3 }}>
                    <StockAlerts 
                        products={products}
                        onNotifySupplier={handleNotifySupplier}
                    />
                </Box>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nom</TableCell>
                            <TableCell>Catégorie</TableCell>
                            <TableCell>Quantité</TableCell>
                            <TableCell>Stock Min/Max</TableCell>
                            <TableCell>Prix</TableCell>
                            <TableCell>Fournisseur</TableCell>
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
                                <TableCell>{product.price.toLocaleString()} FCFA</TableCell>
                                <TableCell>{product.supplier}</TableCell>
                                <TableCell align="right">
                                    <IconButton 
                                        color="primary"
                                        onClick={() => handleOpenDialog(product)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        color="error"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedProduct ? 'Modifier le Produit' : 'Ajouter un Produit'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
                        <TextField
                            label="Nom du produit"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={2}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Catégorie</InputLabel>
                            <Select
                                value={formData.category}
                                label="Catégorie"
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <MenuItem value="Céréales">Céréales</MenuItem>
                                <MenuItem value="Légumes">Légumes</MenuItem>
                                <MenuItem value="Fruits">Fruits</MenuItem>
                                <MenuItem value="Viandes">Viandes</MenuItem>
                                <MenuItem value="Boissons">Boissons</MenuItem>
                            </Select>
                        </FormControl>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                            <TextField
                                label="Quantité"
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                error={!!errors.quantity}
                                helperText={errors.quantity}
                            />
                            <TextField
                                label="Quantité minimale"
                                type="number"
                                value={formData.minQuantity}
                                onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                                error={!!errors.minQuantity}
                                helperText={errors.minQuantity}
                            />
                            <TextField
                                label="Quantité maximale"
                                type="number"
                                value={formData.maxQuantity}
                                onChange={(e) => setFormData({ ...formData, maxQuantity: e.target.value })}
                                error={!!errors.maxQuantity}
                                helperText={errors.maxQuantity}
                            />
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <TextField
                                label="Prix unitaire"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                error={!!errors.price}
                                helperText={errors.price}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Unité</InputLabel>
                                <Select
                                    value={formData.unit}
                                    label="Unité"
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                >
                                    <MenuItem value="kg">Kilogramme (kg)</MenuItem>
                                    <MenuItem value="g">Gramme (g)</MenuItem>
                                    <MenuItem value="l">Litre (l)</MenuItem>
                                    <MenuItem value="unité">Unité</MenuItem>
                                    <MenuItem value="carton">Carton</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <TextField
                            label="Fournisseur"
                            fullWidth
                            value={formData.supplier}
                            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Annuler</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedProduct ? 'Modifier' : 'Ajouter'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
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

export default StockManagement; 