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
    Button,
    IconButton,
    Grid,
    TextField,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Fab,
    Switch,
    FormControlLabel
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

const Discounts = () => {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'percentage',
        value: '',
        productCategory: '',
        minQuantity: '',
        active: true
    });

    const categories = [
        { value: 'food', label: 'Alimentation' },
        { value: 'beverages', label: 'Boissons' },
        { value: 'household', label: 'Maison' },
        { value: 'hygiene', label: 'Hygiène' },
        { value: 'other', label: 'Autres' }
    ];

    useEffect(() => {
        const fetchDiscounts = async () => {
            try {
                // Simuler un appel API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Données mockées
                const mockDiscounts = [
                    {
                        id: '1',
                        name: 'Réduction alimentaire',
                        description: 'Réduction sur les produits alimentaires',
                        type: 'percentage',
                        value: 10,
                        productCategory: 'food',
                        minQuantity: 5,
                        active: true
                    },
                    {
                        id: '2',
                        name: 'Pack hygiène',
                        description: 'Réduction sur les produits d\'hygiène',
                        type: 'fixed',
                        value: 20000,
                        productCategory: 'hygiene',
                        minQuantity: 3,
                        active: true
                    }
                ];

                setDiscounts(mockDiscounts);
            } catch (err) {
                setError('Erreur lors du chargement des réductions');
            } finally {
                setLoading(false);
            }
        };

        fetchDiscounts();
    }, []);

    const handleAdd = () => {
        setSelectedDiscount(null);
        setFormData({
            name: '',
            description: '',
            type: 'percentage',
            value: '',
            productCategory: '',
            minQuantity: '',
            active: true
        });
        setOpenDialog(true);
    };

    const handleEdit = (discount) => {
        setSelectedDiscount(discount);
        setFormData(discount);
        setOpenDialog(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réduction ?')) {
            try {
                // TODO: Implémenter la suppression
                console.log('Suppression de la réduction:', id);
                setDiscounts(prev => prev.filter(discount => discount.id !== id));
            } catch (err) {
                setError('Erreur lors de la suppression');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // TODO: Implémenter la sauvegarde
            const newDiscount = {
                id: selectedDiscount?.id || Date.now().toString(),
                ...formData,
                value: parseFloat(formData.value),
                minQuantity: parseInt(formData.minQuantity)
            };

            if (selectedDiscount) {
                setDiscounts(prev => prev.map(disc => disc.id === selectedDiscount.id ? newDiscount : disc));
            } else {
                setDiscounts(prev => [...prev, newDiscount]);
            }

            setOpenDialog(false);
        } catch (err) {
            setError('Erreur lors de la sauvegarde');
        }
    };

    const getCategoryLabel = (categoryValue) => {
        const category = categories.find(cat => cat.value === categoryValue);
        return category ? category.label : categoryValue;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestion des Réductions
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Liste des réductions */}
            <Card>
                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nom</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Réduction</TableCell>
                                    <TableCell>Catégorie</TableCell>
                                    <TableCell>Quantité min.</TableCell>
                                    <TableCell>Statut</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {discounts.map((discount) => (
                                    <TableRow key={discount.id}>
                                        <TableCell>{discount.name}</TableCell>
                                        <TableCell>{discount.description}</TableCell>
                                        <TableCell>
                                            {discount.type === 'percentage'
                                                ? `${discount.value}%`
                                                : `${discount.value.toLocaleString()} GNF`
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {getCategoryLabel(discount.productCategory)}
                                        </TableCell>
                                        <TableCell>{discount.minQuantity}</TableCell>
                                        <TableCell>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={discount.active}
                                                        onChange={() => {
                                                            setDiscounts(prev =>
                                                                prev.map(d =>
                                                                    d.id === discount.id
                                                                        ? { ...d, active: !d.active }
                                                                        : d
                                                                )
                                                            );
                                                        }}
                                                    />
                                                }
                                                label={discount.active ? 'Active' : 'Inactive'}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEdit(discount)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(discount.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Bouton d'ajout */}
            <Fab
                color="primary"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={handleAdd}
            >
                <AddIcon />
            </Fab>

            {/* Modal d'ajout/modification */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        {selectedDiscount ? 'Modifier la réduction' : 'Nouvelle réduction'}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nom"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    multiline
                                    rows={3}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Type de réduction"
                                    value={formData.type}
                                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                    required
                                >
                                    <MenuItem value="percentage">Pourcentage</MenuItem>
                                    <MenuItem value="fixed">Montant fixe</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label={formData.type === 'percentage' ? 'Pourcentage' : 'Montant (GNF)'}
                                    type="number"
                                    value={formData.value}
                                    onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Catégorie de produits"
                                    value={formData.productCategory}
                                    onChange={(e) => setFormData(prev => ({ ...prev, productCategory: e.target.value }))}
                                    required
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.value} value={category.value}>
                                            {category.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Quantité minimum"
                                    type="number"
                                    value={formData.minQuantity}
                                    onChange={(e) => setFormData(prev => ({ ...prev, minQuantity: e.target.value }))}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.active}
                                            onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                        />
                                    }
                                    label="Réduction active"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" variant="contained">
                            {selectedDiscount ? 'Modifier' : 'Ajouter'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default Discounts; 