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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

const Promotions = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        startDate: new Date(),
        endDate: new Date(),
        active: true,
        conditions: '',
        minPurchase: ''
    });

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                // Simuler un appel API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Données mockées
                const mockPromotions = [
                    {
                        id: '1',
                        name: 'Soldes d\'été',
                        description: 'Réduction sur tous les produits',
                        discountType: 'percentage',
                        discountValue: 20,
                        startDate: '2024-06-01',
                        endDate: '2024-06-30',
                        active: true,
                        conditions: 'Sur tous les produits',
                        minPurchase: 100000
                    },
                    {
                        id: '2',
                        name: 'Pack Famille',
                        description: 'Réduction sur les achats en gros',
                        discountType: 'fixed',
                        discountValue: 50000,
                        startDate: '2024-03-15',
                        endDate: '2024-04-15',
                        active: true,
                        conditions: 'Pour les achats > 500,000 GNF',
                        minPurchase: 500000
                    }
                ];

                setPromotions(mockPromotions);
            } catch (err) {
                setError('Erreur lors du chargement des promotions');
            } finally {
                setLoading(false);
            }
        };

        fetchPromotions();
    }, []);

    const handleAdd = () => {
        setSelectedPromotion(null);
        setFormData({
            name: '',
            description: '',
            discountType: 'percentage',
            discountValue: '',
            startDate: new Date(),
            endDate: new Date(),
            active: true,
            conditions: '',
            minPurchase: ''
        });
        setOpenDialog(true);
    };

    const handleEdit = (promotion) => {
        setSelectedPromotion(promotion);
        setFormData({
            ...promotion,
            startDate: new Date(promotion.startDate),
            endDate: new Date(promotion.endDate)
        });
        setOpenDialog(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
            try {
                // TODO: Implémenter la suppression
                console.log('Suppression de la promotion:', id);
                setPromotions(prev => prev.filter(promo => promo.id !== id));
            } catch (err) {
                setError('Erreur lors de la suppression');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // TODO: Implémenter la sauvegarde
            const newPromotion = {
                id: selectedPromotion?.id || Date.now().toString(),
                ...formData,
                discountValue: parseFloat(formData.discountValue),
                minPurchase: parseFloat(formData.minPurchase)
            };

            if (selectedPromotion) {
                setPromotions(prev => prev.map(promo => promo.id === selectedPromotion.id ? newPromotion : promo));
            } else {
                setPromotions(prev => [...prev, newPromotion]);
            }

            setOpenDialog(false);
        } catch (err) {
            setError('Erreur lors de la sauvegarde');
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
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestion des Promotions
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Liste des promotions */}
            <Card>
                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nom</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Réduction</TableCell>
                                    <TableCell>Période</TableCell>
                                    <TableCell>Statut</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {promotions.map((promotion) => (
                                    <TableRow key={promotion.id}>
                                        <TableCell>{promotion.name}</TableCell>
                                        <TableCell>{promotion.description}</TableCell>
                                        <TableCell>
                                            {promotion.discountType === 'percentage'
                                                ? `${promotion.discountValue}%`
                                                : `${promotion.discountValue.toLocaleString()} GNF`
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={promotion.active}
                                                        onChange={() => {
                                                            setPromotions(prev =>
                                                                prev.map(p =>
                                                                    p.id === promotion.id
                                                                        ? { ...p, active: !p.active }
                                                                        : p
                                                                )
                                                            );
                                                        }}
                                                    />
                                                }
                                                label={promotion.active ? 'Active' : 'Inactive'}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEdit(promotion)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(promotion.id)}
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
                        {selectedPromotion ? 'Modifier la promotion' : 'Nouvelle promotion'}
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
                                    value={formData.discountType}
                                    onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value }))}
                                    required
                                >
                                    <MenuItem value="percentage">Pourcentage</MenuItem>
                                    <MenuItem value="fixed">Montant fixe</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label={formData.discountType === 'percentage' ? 'Pourcentage' : 'Montant (GNF)'}
                                    type="number"
                                    value={formData.discountValue}
                                    onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Date début"
                                        value={formData.startDate}
                                        onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                                        renderInput={(params) => <TextField {...params} fullWidth required />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Date fin"
                                        value={formData.endDate}
                                        onChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                                        renderInput={(params) => <TextField {...params} fullWidth required />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Conditions"
                                    value={formData.conditions}
                                    onChange={(e) => setFormData(prev => ({ ...prev, conditions: e.target.value }))}
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Montant minimum d'achat (GNF)"
                                    type="number"
                                    value={formData.minPurchase}
                                    onChange={(e) => setFormData(prev => ({ ...prev, minPurchase: e.target.value }))}
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
                                    label="Promotion active"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" variant="contained">
                            {selectedPromotion ? 'Modifier' : 'Ajouter'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default Promotions; 