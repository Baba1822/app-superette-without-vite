import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Star as StarIcon,
    LocalOffer as OfferIcon,
    CardGiftcard as RewardIcon,
    Timeline as HistoryIcon
} from '@mui/icons-material';

const LoyaltyStatus = () => {
    const [loyaltyData, setLoyaltyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLoyaltyData = async () => {
            try {
                // Simuler un appel API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Données mockées
                const mockData = {
                    points: 750,
                    nextLevel: 1000,
                    currentLevel: 'Silver',
                    nextLevelName: 'Gold',
                    progress: 75,
                    availableRewards: [
                        { id: 1, name: 'Réduction de 10%', points: 500, status: 'available' },
                        { id: 2, name: 'Livraison gratuite', points: 800, status: 'locked' },
                        { id: 3, name: 'Cadeau surprise', points: 1000, status: 'locked' }
                    ],
                    recentTransactions: [
                        { id: 1, date: '2024-03-10', points: 50, description: 'Achat #1234' },
                        { id: 2, date: '2024-03-08', points: 30, description: 'Achat #1233' }
                    ]
                };

                setLoyaltyData(mockData);
            } catch (err) {
                setError('Erreur lors du chargement des données de fidélité');
            } finally {
                setLoading(false);
            }
        };

        fetchLoyaltyData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Programme de Fidélité
            </Typography>

            <Grid container spacing={3}>
                {/* Statut actuel */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <StarIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Niveau {loyaltyData.currentLevel}
                                </Typography>
                            </Box>

                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                {loyaltyData.points} points sur {loyaltyData.nextLevel} pour atteindre le niveau {loyaltyData.nextLevelName}
                            </Typography>

                            <LinearProgress
                                variant="determinate"
                                value={loyaltyData.progress}
                                sx={{ height: 10, borderRadius: 5, mb: 2 }}
                            />

                            <Typography variant="body2" color="primary">
                                Plus que {loyaltyData.nextLevel - loyaltyData.points} points pour le prochain niveau !
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Récompenses disponibles */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <RewardIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Récompenses Disponibles
                                </Typography>
                            </Box>

                            <List>
                                {loyaltyData.availableRewards.map((reward) => (
                                    <ListItem key={reward.id}>
                                        <ListItemIcon>
                                            <OfferIcon color={reward.status === 'available' ? 'primary' : 'disabled'} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={reward.name}
                                            secondary={`${reward.points} points requis`}
                                        />
                                        <Chip
                                            label={reward.status === 'available' ? 'Disponible' : 'Verrouillé'}
                                            color={reward.status === 'available' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Historique des points */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <HistoryIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Historique des Points
                                </Typography>
                            </Box>

                            <List>
                                {loyaltyData.recentTransactions.map((transaction) => (
                                    <ListItem key={transaction.id}>
                                        <ListItemText
                                            primary={transaction.description}
                                            secondary={new Date(transaction.date).toLocaleDateString()}
                                        />
                                        <Typography color="primary">
                                            +{transaction.points} points
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LoyaltyStatus; 