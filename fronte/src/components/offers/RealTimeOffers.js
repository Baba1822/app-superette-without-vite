import {
    AccessTime as AccessTimeIcon,
    Close as CloseIcon,
    Notifications as NotificationsIcon,
    Share as ShareIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Snackbar,
    Typography,
    useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import RealTimeOffersService from '../../services/RealTimeOffersService';

const RealTimeOffers = ({ clientId }) => {
    const theme = useTheme();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        loadOffers();
        // Rafraîchir les offres toutes les 5 minutes
        const interval = setInterval(loadOffers, 300000);
        return () => clearInterval(interval);
    }, [clientId]);

    const loadOffers = async () => {
        try {
            const personalizedOffers = await RealTimeOffersService.getPersonalizedOffers(clientId);
            setOffers(personalizedOffers);
        } catch (error) {
            console.error('Erreur lors du chargement des offres:', error);
            showSnackbar('Erreur lors du chargement des offres', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOfferClick = async (offer) => {
        setSelectedOffer(offer);
        setOpenDialog(true);
        // Enregistrer l'interaction
        await RealTimeOffersService.trackOfferInteraction(clientId, offer.id, 'view');
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedOffer(null);
    };

    const handleAcceptOffer = async () => {
        try {
            const isEligible = await RealTimeOffersService.checkOfferEligibility(
                clientId,
                selectedOffer.id
            );

            if (isEligible) {
                await RealTimeOffersService.trackOfferInteraction(
                    clientId,
                    selectedOffer.id,
                    'accept'
                );
                showSnackbar('Offre acceptée avec succès !', 'success');
                handleCloseDialog();
            } else {
                showSnackbar('Désolé, vous n\'êtes plus éligible pour cette offre', 'error');
            }
        } catch (error) {
            showSnackbar('Erreur lors de l\'acceptation de l\'offre', 'error');
        }
    };

    const handleSendNotification = async (offer) => {
        try {
            await RealTimeOffersService.sendOfferNotification(clientId, offer.id);
            showSnackbar('Notification envoyée avec succès', 'success');
        } catch (error) {
            showSnackbar('Erreur lors de l\'envoi de la notification', 'error');
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const formatPrice = (value) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0
        }).format(value);
    };

    const getTimeRemaining = (validUntil) => {
        const now = new Date();
        const end = new Date(validUntil);
        const diff = end - now;
        
        if (diff <= 0) return 'Expirée';
        
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes} min`;
        
        const hours = Math.floor(minutes / 60);
        return `${hours} h ${minutes % 60} min`;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ py: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Offres Personnalisées
            </Typography>

            <Grid container spacing={2}>
                {offers.map((offer) => (
                    <Grid item xs={12} sm={6} md={4} key={offer.id}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                '&:hover': {
                                    boxShadow: theme.shadows[4]
                                }
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        mb: 2
                                    }}
                                >
                                    <Typography variant="h6" component="div">
                                        {offer.title}
                                    </Typography>
                                    <Chip
                                        size="small"
                                        color={offer.priority === 'high' ? 'error' : 'primary'}
                                        label={offer.category}
                                    />
                                </Box>

                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {offer.description}
                                </Typography>

                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Prix de base: {formatPrice(offer.basePrice)}
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        Économisez: {offer.discountType === 'percentage' 
                                            ? `${offer.discountValue}%`
                                            : formatPrice(offer.discountValue)}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mt: 2,
                                        color: 'text.secondary'
                                    }}
                                >
                                    <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                    <Typography variant="caption">
                                        Expire dans: {getTimeRemaining(offer.validUntil)}
                                    </Typography>
                                </Box>
                            </CardContent>

                            <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => handleOfferClick(offer)}
                                >
                                    Voir les détails
                                </Button>
                                <Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleSendNotification(offer)}
                                    >
                                        <NotificationsIcon />
                                    </IconButton>
                                    <IconButton size="small">
                                        <ShareIcon />
                                    </IconButton>
                                </Box>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                {selectedOffer && (
                    <>
                        <DialogTitle>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                {selectedOffer.title}
                                <IconButton size="small" onClick={handleCloseDialog}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body1" paragraph>
                                {selectedOffer.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                {selectedOffer.conditions}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    Économisez: {selectedOffer.discountType === 'percentage'
                                        ? `${selectedOffer.discountValue}%`
                                        : formatPrice(selectedOffer.discountValue)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Prix de base: {formatPrice(selectedOffer.basePrice)}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mt: 2,
                                    color: 'text.secondary'
                                }}
                            >
                                <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                <Typography variant="body2">
                                    Valable jusqu'au {new Date(selectedOffer.validUntil).toLocaleString()}
                                </Typography>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Fermer</Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAcceptOffer}
                            >
                                Profiter de l'offre
                            </Button>
                        </DialogActions>
                    </>
                )}
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

export default RealTimeOffers; 