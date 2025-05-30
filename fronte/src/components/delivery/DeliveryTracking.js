import {
    LocalShipping as DeliveryIcon,
    LocationOn as LocationIcon,
    Person as PersonIcon,
    AccessTime as TimeIcon
} from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    LinearProgress,
    Paper,
    Step,
    StepLabel,
    Stepper,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
   import { DeliveryService } from '../../../services/DeliveryService';

const DELIVERY_STEPS = [
    { label: 'Commande confirmée', description: 'La commande a été validée' },
    { label: 'En préparation', description: 'La commande est en cours de préparation' },
    { label: 'En route', description: 'Le livreur est en route' },
    { label: 'Livrée', description: 'La commande a été livrée' }
];

const DeliveryTracking = ({ deliveryId }) => {
    const [delivery, setDelivery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeStep, setActiveStep] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState(null);

    useEffect(() => {
        loadDeliveryDetails();
        const interval = setInterval(loadDeliveryDetails, 60000); // Mise à jour toutes les minutes
        return () => clearInterval(interval);
    }, [deliveryId]);

    const loadDeliveryDetails = async () => {
        try {
            const data = await DeliveryService.getDeliveryById(deliveryId);
            setDelivery(data);
            updateDeliveryProgress(data.status);
            calculateEstimatedTime(data);
        } catch (error) {
            console.error('Erreur lors du chargement des détails de la livraison:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateDeliveryProgress = (status) => {
        switch (status) {
            case 'CONFIRMED':
                setActiveStep(0);
                break;
            case 'PREPARING':
                setActiveStep(1);
                break;
            case 'IN_TRANSIT':
                setActiveStep(2);
                break;
            case 'DELIVERED':
                setActiveStep(3);
                break;
            default:
                setActiveStep(0);
        }
    };

    const calculateEstimatedTime = (deliveryData) => {
        if (deliveryData.estimatedDeliveryTime) {
            const estimatedDate = new Date(deliveryData.estimatedDeliveryTime);
            const now = new Date();
            const diffInMinutes = Math.round((estimatedDate - now) / 60000);
            setEstimatedTime(diffInMinutes);
        }
    };

    const formatTime = (minutes) => {
        if (minutes <= 0) return 'Arrivée imminente';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
        }
        return `${mins} minutes`;
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress />
            </Box>
        );
    }

    if (!delivery) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography color="error">
                    Impossible de charger les informations de livraison
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Suivi de Livraison
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {DELIVERY_STEPS.map((step, index) => (
                                <Step key={step.label}>
                                    <StepLabel>{step.label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Détails de la livraison
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <LocationIcon color="primary" />
                                        <Typography>
                                            Adresse de livraison:
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ ml: 4 }}>
                                        {delivery.deliveryAddress}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>

                                <Grid item xs={12}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <TimeIcon color="primary" />
                                        <Typography>
                                            Temps estimé:
                                        </Typography>
                                        <Chip
                                            label={estimatedTime ? formatTime(estimatedTime) : 'N/A'}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </Box>
                                </Grid>

                                {delivery.driver && (
                                    <>
                                        <Grid item xs={12}>
                                            <Divider />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <PersonIcon color="primary" />
                                                <Typography>
                                                    Livreur:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {delivery.driver.name}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Statut actuel
                            </Typography>
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Chip
                                    icon={<DeliveryIcon />}
                                    label={DELIVERY_STEPS[activeStep].label}
                                    color="primary"
                                    sx={{ width: 'fit-content' }}
                                />
                                <Typography variant="body2" color="textSecondary">
                                    {DELIVERY_STEPS[activeStep].description}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DeliveryTracking; 