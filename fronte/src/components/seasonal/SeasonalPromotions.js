import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useEffect, useState } from 'react';
import SeasonalProductService from '../../services/SeasonalProductService';

const SeasonalPromotions = () => {
    const [promotions, setPromotions] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [currentSeason, setCurrentSeason] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: null,
        endDate: null,
        discountType: 'percentage',
        discountValue: '',
        minPurchase: '',
        maxDiscount: '',
        applicableProducts: []
    });

    useEffect(() => {
        loadCurrentSeason();
        loadPromotions();
    }, []);

    const loadCurrentSeason = async () => {
        try {
            const season = await SeasonalProductService.getCurrentSeason();
            setCurrentSeason(season);
        } catch (error) {
            showSnackbar('Erreur lors du chargement de la saison', 'error');
        }
    };

    const loadPromotions = async () => {
        // Simulation de données de promotion
        const mockPromotions = [
            {
                id: 1,
                name: 'Soldes d\'été',
                description: 'Grandes réductions sur les articles d\'été',
                startDate: new Date(2024, 5, 1),
                endDate: new Date(2024, 7, 31),
                discountType: 'percentage',
                discountValue: 30,
                minPurchase: 5000,
                maxDiscount: 15000,
                applicableProducts: ['Maillots de bain', 'Parasols', 'Crèmes solaires']
            },
            // Autres promotions...
        ];
        setPromotions(mockPromotions);
    };

    const handleOpenDialog = (promotion = null) => {
        if (promotion) {
            setSelectedPromotion(promotion);
            setFormData({ ...promotion });
        } else {
            setSelectedPromotion(null);
            setFormData({
                name: '',
                description: '',
                startDate: null,
                endDate: null,
                discountType: 'percentage',
                discountValue: '',
                minPurchase: '',
                maxDiscount: '',
                applicableProducts: []
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedPromotion(null);
    };

    const handleSubmit = async () => {
        try {
            // Validation des données
            if (!formData.name || !formData.startDate || !formData.endDate || !formData.discountValue) {
                showSnackbar('Veuillez remplir tous les champs obligatoires', 'error');
                return;
            }

            // Logique de sauvegarde
            if (selectedPromotion) {
                // Mise à jour d'une promotion existante
                const updatedPromotions = promotions.map(p =>
                    p.id === selectedPromotion.id ? { ...formData, id: p.id } : p
                );
                setPromotions(updatedPromotions);
                showSnackbar('Promotion mise à jour avec succès', 'success');
            } else {
                // Création d'une nouvelle promotion
                const newPromotion = {
                    ...formData,
                    id: Date.now() // Simuler un ID unique
                };
                setPromotions([...promotions, newPromotion]);
                showSnackbar('Promotion créée avec succès', 'success');
            }

            handleCloseDialog();
        } catch (error) {
            showSnackbar('Erreur lors de la sauvegarde de la promotion', 'error');
        }
    };

    const handleDelete = async (promotionId) => {
        try {
            // Suppression de la promotion
            const updatedPromotions = promotions.filter(p => p.id !== promotionId);
            setPromotions(updatedPromotions);
            showSnackbar('Promotion supprimée avec succès', 'success');
        } catch (error) {
            showSnackbar('Erreur lors de la suppression de la promotion', 'error');
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5" component="h2">
                        Promotions Saisonnières
                        {currentSeason && (
                            <Chip
                                label={`Saison actuelle: ${currentSeason.name}`}
                                color="primary"
                                sx={{ ml: 2 }}
                            />
                        )}
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Nouvelle Promotion
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {promotions.map((promotion) => (
                        <Grid item xs={12} md={6} lg={4} key={promotion.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {promotion.name}
                                    </Typography>
                                    <Typography color="text.secondary" gutterBottom>
                                        {promotion.description}
                                    </Typography>
                                    <Typography variant="body2">
                                        Réduction: {promotion.discountValue}
                                        {promotion.discountType === 'percentage' ? '%' : ' GNF'}
                                    </Typography>
                                    <Typography variant="body2">
                                        Du: {new Date(promotion.startDate).toLocaleDateString()}
                                        <br />
                                        Au: {new Date(promotion.endDate).toLocaleDateString()}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <IconButton
                                            onClick={() => handleOpenDialog(promotion)}
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(promotion.id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>
                        {selectedPromotion ? 'Modifier la Promotion' : 'Nouvelle Promotion'}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nom de la promotion"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <DatePicker
                                    label="Date de début"
                                    value={formData.startDate}
                                    onChange={(date) => setFormData({ ...formData, startDate: date })}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <DatePicker
                                    label="Date de fin"
                                    value={formData.endDate}
                                    onChange={(date) => setFormData({ ...formData, endDate: date })}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Type de réduction</InputLabel>
                                    <Select
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                    >
                                        <MenuItem value="percentage">Pourcentage</MenuItem>
                                        <MenuItem value="fixed">Montant fixe</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Valeur de la réduction"
                                    type="number"
                                    value={formData.discountValue}
                                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Achat minimum"
                                    type="number"
                                    value={formData.minPurchase}
                                    onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Réduction maximale"
                                    type="number"
                                    value={formData.maxDiscount}
                                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Annuler</Button>
                        <Button onClick={handleSubmit} variant="contained">
                            {selectedPromotion ? 'Mettre à jour' : 'Créer'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
};

export default SeasonalPromotions; 