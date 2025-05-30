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
    FormControlLabel,
    Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Event as EventIcon
} from '@mui/icons-material';

const SeasonalOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        season: '',
        startDate: new Date(),
        endDate: new Date(),
        discountType: 'percentage',
        discountValue: '',
        products: [],
        active: true
    });

    const seasons = [
        { value: 'summer', label: 'Été' },
        { value: 'winter', label: 'Hiver' },
        { value: 'ramadan', label: 'Ramadan' },
        { value: 'backToSchool', label: 'Rentrée scolaire' },
        { value: 'endOfYear', label: 'Fin d\'année' }
    ];

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                // Simuler un appel API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Données mockées
                const mockOffers = [
                    {
                        id: '1',
                        name: 'Spécial Ramadan',
                        description: 'Offres spéciales pour le mois de Ramadan',
                        season: 'ramadan',
                        startDate: '2024-03-10',
                        endDate: '2024-04-10',
                        discountType: 'percentage',
                        discountValue: 15,
                        products: ['Dattes', 'Lait', 'Huile'],
                        active: true
                    },
                    {
                        id: '2',
                        name: 'Rentrée des classes',
                        description: 'Promotions sur les fournitures scolaires',
                        season: 'backToSchool',
                        startDate: '2024-09-01',
                        endDate: '2024-09-30',
                        discountType: 'fixed',
                        discountValue: 25000,
                        products: ['Cahiers', 'Stylos', 'Cartables'],
                        active: true
                    }
                ];

                setOffers(mockOffers);
            } catch (err) {
                setError('Erreur lors du chargement des offres saisonnières');
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    const handleAdd = () => {
        setSelectedOffer(null);
        setFormData({
            name: '',
            description: '',
            season: '',
            startDate: new Date(),
            endDate: new Date(),
            discountType: 'percentage',
            discountValue: '',
            products: [],
            active: true
        });
        setOpenDialog(true);
    };

    const handleEdit = (offer) => {
        setSelectedOffer(offer);
        setFormData({
            ...offer,
            startDate: new Date(offer.startDate),
            endDate: new Date(offer.endDate)
        });
        setOpenDialog(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
            try {
                // TODO: Implémenter la suppression
                console.log('Suppression de l\'offre:', id);
                setOffers(prev => prev.filter(offer => offer.id !== id));
            } catch (err) {
                setError('Erreur lors de la suppression');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // TODO: Implémenter la sauvegarde
            const newOffer = {
                id: selectedOffer?.id || Date.now().toString(),
                ...formData,
                discountValue: parseFloat(formData.discountValue)
            };

            if (selectedOffer) {
                setOffers(prev => prev.map(offer => offer.id === selectedOffer.id ? newOffer : offer));
            } else {
                setOffers(prev => [...prev, newOffer]);
            }

            setOpenDialog(false);
        } catch (err) {
            setError('Erreur lors de la sauvegarde');
        }
    };

    const getSeasonLabel = (seasonValue) => {
        const season = seasons.find(s => s.value === seasonValue);
        return season ? season.label : seasonValue;
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
                Offres Saisonnières
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Liste des offres */}
            <Card>
                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nom</TableCell>
                                    <TableCell>Saison</TableCell>
                                    <TableCell>Période</TableCell>
                                    <TableCell>Réduction</TableCell>
                                    <TableCell>Produits</TableCell>
                                    <TableCell>Statut</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {offers.map((offer) => (
                                    <TableRow key={offer.id}>
                                        <TableCell>{offer.name}</TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={<EventIcon />}
                                                label={getSeasonLabel(offer.season)}
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {offer.discountType === 'percentage'
                                                ? `${offer.discountValue}%`
                                                : `${offer.discountValue.toLocaleString()} GNF`
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {offer.products.map((product, index) => (
                                                <Chip
                                                    key={index}
                                                    label={product}
                                                    size="small"
                                                    sx={{ mr: 0.5, mb: 0.5 }}
                                                />
                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={offer.active}
                                                        onChange={() => {
                                                            setOffers(prev =>
                                                                prev.map(o =>
                                                                    o.id === offer.id
                                                                        ? { ...o, active: !o.active }
                                                                        : o
                                                                )
                                                            );
                                                        }}
                                                    />
                                                }
                                                label={offer.active ? 'Active' : 'Inactive'}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEdit(offer)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(offer.id)}
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
                        {selectedOffer ? 'Modifier l\'offre' : 'Nouvelle offre'}
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
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Saison"
                                    value={formData.season}
                                    onChange={(e) => setFormData(prev => ({ ...prev, season: e.target.value }))}
                                    required
                                >
                                    {seasons.map((season) => (
                                        <MenuItem key={season.value} value={season.value}>
                                            {season.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
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
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Produits (séparés par des virgules)"
                                    value={formData.products.join(', ')}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        products: e.target.value.split(',').map(p => p.trim()).filter(p => p)
                                    }))}
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
                                    label="Offre active"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" variant="contained">
                            {selectedOffer ? 'Modifier' : 'Ajouter'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default SeasonalOffers; 