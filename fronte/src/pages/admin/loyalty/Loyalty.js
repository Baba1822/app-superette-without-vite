import React, { useState, useEffect } from 'react';
import {
    Add as AddIcon,
    Edit as EditIcon,
    CardGiftcard as GiftIcon,
    Loyalty as LoyaltyIcon,
    Person as PersonIcon,
    QrCode as QrCodeIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import {
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
    Paper,
    Select,
    Snackbar,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';
import LoyaltyService from '../../../services/LoyaltyService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Loyalty = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [cards, setCards] = useState([]);
    const [loyaltyTiers, setLoyaltyTiers] = useState([]);
    const [availableRewards, setAvailableRewards] = useState([]);
    const [pointHistory, setPointHistory] = useState([]);
    const [analytics, setAnalytics] = useState({
        trends: [],
        rewardDistribution: [],
        forecast: [],
        metrics: {}
    });
    const [showCardDialog, setShowCardDialog] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showRewardDialog, setShowRewardDialog] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null);
    const [loading, setLoading] = useState({
        cards: true,
        tiers: true,
        rewards: true,
        history: true,
        analytics: true
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    // Charger les données initiales
    useEffect(() => {
        const loadData = async () => {
            try {
                // Charger les cartes de fidélité
                const clientId = 1; // À remplacer par l'ID réel du client ou une gestion d'authentification
                const cardData = await LoyaltyService.getLoyaltyCard(clientId);
                setCards([{
                    id: clientId,
                    customerId: clientId,
                    customerName: `Client ${clientId}`,
                    cardNumber: cardData.cardNumber,
                    points: cardData.points,
                    tier: cardData.tier,
                    joinDate: cardData.joinDate,
                    lastPurchase: new Date().toISOString().split('T')[0],
                    totalSpent: cardData.totalSpent
                }]);
                setLoading(prev => ({ ...prev, cards: false }));

                // Charger les niveaux de fidélité
                const tierInfo = await LoyaltyService.checkLoyaltyTier(clientId);
                setLoyaltyTiers([
                    {
                        name: 'Bronze',
                        minPoints: 0,
                        benefits: ['1 point par 100 GNF dépensés', 'Offres spéciales occasionnelles']
                    },
                    {
                        name: 'Silver',
                        minPoints: 500,
                        benefits: ['1.5 points par 100 GNF dépensés', 'Offres exclusives']
                    },
                    {
                        name: 'Gold',
                        minPoints: 1000,
                        benefits: ['2 points par 100 GNF dépensés', 'Offres VIP']
                    }
                ]);
                setLoading(prev => ({ ...prev, tiers: false }));

                // Charger les récompenses disponibles
                const rewards = await LoyaltyService.getAvailableRewards(clientId);
                setAvailableRewards(rewards);
                setLoading(prev => ({ ...prev, rewards: false }));

                // Charger l'historique des points
                const history = await LoyaltyService.getPointsHistory(clientId);
                setPointHistory(history.map(item => ({
                    id: item.date,
                    cardId: clientId,
                    date: item.date,
                    points: item.type === 'earn' ? item.points : -item.points,
                    type: item.type === 'earn' ? 'purchase' : 'redemption',
                    description: item.transaction || `Échange pour ${item.rewardName || 'récompense'}`
                })));
                setLoading(prev => ({ ...prev, history: false }));

                // Charger les analyses
                const stats = await LoyaltyService.getLoyaltyStats();
                setAnalytics({
                    trends: stats.trends,
                    rewardDistribution: stats.rewardDistribution,
                    forecast: stats.forecast,
                    metrics: {
                        growthRate: stats.growthRate,
                        redemptionRate: stats.redemptionRate,
                        forecastAccuracy: stats.forecastAccuracy
                    }
                });
                setLoading(prev => ({ ...prev, analytics: false }));

            } catch (error) {
                setSnackbar({
                    open: true,
                    message: 'Erreur lors du chargement des données',
                    severity: 'error',
                });
                console.error('Error loading data:', error);
            }
        };

        loadData();
    }, []);

    // Fonction pour calculer le niveau basé sur les points
    const calculateTier = (points) => {
        return loyaltyTiers
            .filter(tier => points >= tier.minPoints)
            .sort((a, b) => b.minPoints - a.minPoints)[0]?.name || 'Bronze';
    };

    // Sauvegarder une carte (création ou mise à jour)
    const handleSaveCard = async () => {
        try {
            if (selectedCard?.id) {
                // Mise à jour d'une carte existante
                const updatedCard = await LoyaltyService.updateLoyaltyCard(selectedCard.id, selectedCard);
                setCards(cards.map(c => c.id === selectedCard.id ? updatedCard : c));
                setSnackbar({
                    open: true,
                    message: 'Carte mise à jour avec succès',
                    severity: 'success',
                });
            } else {
                // Création d'une nouvelle carte
                const newCard = await LoyaltyService.createLoyaltyCard({
                    ...selectedCard,
                    points: selectedCard.points || 0,
                    tier: calculateTier(selectedCard?.points || 0)
                });
                setCards([...cards, newCard]);
                setSnackbar({
                    open: true,
                    message: 'Carte créée avec succès',
                    severity: 'success',
                });
            }
            setShowCardDialog(false);
            setSelectedCard(null);
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Erreur lors de la sauvegarde de la carte',
                severity: 'error',
            });
            console.error('Error saving card:', error);
        }
    };

    // Supprimer une carte
    const handleDeleteCard = async (cardId) => {
        try {
            await LoyaltyService.deleteLoyaltyCard(cardId);
            setCards(cards.filter(c => c.id !== cardId));
            setSnackbar({
                open: true,
                message: 'Carte supprimée avec succès',
                severity: 'success',
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Erreur lors de la suppression de la carte',
                severity: 'error',
            });
            console.error('Error deleting card:', error);
        }
    };

    // Échanger une récompense
    const redeemReward = async (card, reward) => {
        try {
            const result = await LoyaltyService.redeemPoints(card.customerId, reward.id, reward.pointsCost);
            
            // Mettre à jour les points localement
            setCards(cards.map(c => 
                c.id === card.id 
                    ? { ...c, points: c.points - reward.pointsCost }
                    : c
            ));
            
            setSnackbar({
                open: true,
                message: `Récompense "${reward.name}" échangée avec succès`,
                severity: 'success',
            });
            
            return true;
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Erreur lors de l\'échange de la récompense',
                severity: 'error',
            });
            return false;
        }
    };

    // Ajouter des points suite à un achat
    const addPointsFromPurchase = async (cardId, amount) => {
        try {
            const card = cards.find(c => c.id === cardId);
            if (!card) return;
            
            const result = await LoyaltyService.addPoints(card.customerId, amount, `purchase-${Date.now()}`);
            
            // Mettre à jour les points localement
            setCards(cards.map(c => 
                c.id === cardId 
                    ? { ...c, points: c.points + result.pointsAdded }
                    : c
            ));
            
            setSnackbar({
                open: true,
                message: `${result.pointsAdded} points ajoutés à votre carte`,
                severity: 'success',
            });
            
            return result.pointsAdded;
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Erreur lors de l\'ajout des points',
                severity: 'error',
            });
            return 0;
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Cartes de fidélité</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setSelectedCard({
                            customerName: '',
                            cardNumber: '',
                            points: 0,
                            joinDate: format(new Date(), 'yyyy-MM-dd'),
                            lastPurchase: format(new Date(), 'yyyy-MM-dd'),
                            totalSpent: 0
                        });
                        setShowCardDialog(true);
                    }}
                    disabled={loading.tiers}
                >
                    Nouvelle carte
                </Button>
            </Box>

            {/* Afficher le chargement si nécessaire */}
            {loading.cards || loading.tiers ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* Statistics Cards */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={4}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <LoyaltyIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography color="textSecondary">
                                            Cartes actives
                                        </Typography>
                                    </Box>
                                    <Typography variant="h5">
                                        {cards.length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <GiftIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography color="textSecondary">
                                            Points totaux
                                        </Typography>
                                    </Box>
                                    <Typography variant="h5">
                                        {cards.reduce((sum, card) => sum + card.points, 0)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <PersonIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography color="textSecondary">
                                            Membres Gold
                                        </Typography>
                                    </Box>
                                    <Typography variant="h5">
                                        {cards.filter(card => card.tier === 'Gold').length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Tabs */}
                    <Paper sx={{ mt: 3 }}>
                        <Tabs
                            value={activeTab}
                            onChange={(e, newValue) => setActiveTab(newValue)}
                            variant="fullWidth"
                        >
                            <Tab label="Cartes" />
                            <Tab label="Récompenses" />
                            <Tab label="Historique" />
                            <Tab label="Analyses" />
                        </Tabs>

                        {/* Cards Tab */}
                        {activeTab === 0 && (
                            <Box sx={{ p: 3 }}>
                                {loading.cards ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Client</TableCell>
                                                    <TableCell>Numéro de carte</TableCell>
                                                    <TableCell>Points</TableCell>
                                                    <TableCell>Niveau</TableCell>
                                                    <TableCell>Date d'adhésion</TableCell>
                                                    <TableCell>Dernier achat</TableCell>
                                                    <TableCell align="right">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {cards.map((card) => (
                                                    <TableRow key={card.id}>
                                                        <TableCell>{card.customerName}</TableCell>
                                                        <TableCell>{card.cardNumber}</TableCell>
                                                        <TableCell>{card.points}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={card.tier}
                                                                color={
                                                                    card.tier === 'Gold' ? 'warning' :
                                                                    card.tier === 'Silver' ? 'default' :
                                                                    'primary'
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>{card.joinDate}</TableCell>
                                                        <TableCell>{card.lastPurchase}</TableCell>
                                                        <TableCell align="right">
                                                            <IconButton onClick={() => {
                                                                setSelectedCard(card);
                                                                setShowCardDialog(true);
                                                            }}>
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton onClick={() => handleDeleteCard(card.id)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                            <IconButton>
                                                                <QrCodeIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Box>
                        )}

                        {/* Rewards Tab */}
                        {activeTab === 1 && (
                            <Box sx={{ p: 3 }}>
                                {loading.rewards ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <Grid container spacing={3}>
                                        {availableRewards.map((reward) => (
                                            <Grid item xs={12} sm={6} md={4} key={reward.id}>
                                                <Card>
                                                    <CardContent>
                                                        <Typography variant="h6" gutterBottom>
                                                            {reward.name}
                                                        </Typography>
                                                        <Typography color="textSecondary" gutterBottom>
                                                            {reward.description}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                                            <LoyaltyIcon color="primary" sx={{ mr: 1 }} />
                                                            <Typography>
                                                                {reward.pointsCost} points
                                                            </Typography>
                                                        </Box>
                                                        <Button
                                                            variant="contained"
                                                            fullWidth
                                                            sx={{ mt: 2 }}
                                                            onClick={() => {
                                                                setSelectedReward(reward);
                                                                setShowRewardDialog(true);
                                                            }}
                                                            disabled={cards.length === 0}
                                                        >
                                                            Échanger
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Box>
                        )}

                        {/* History Tab */}
                        {activeTab === 2 && (
                            <Box sx={{ p: 3 }}>
                                {loading.history ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell>Client</TableCell>
                                                    <TableCell>Points</TableCell>
                                                    <TableCell>Type</TableCell>
                                                    <TableCell>Description</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {pointHistory.map((entry) => (
                                                    <TableRow key={entry.id}>
                                                        <TableCell>{entry.date}</TableCell>
                                                        <TableCell>
                                                            {cards.find(c => c.id === entry.cardId)?.customerName}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography
                                                                color={entry.points > 0 ? 'success.main' : 'error.main'}
                                                            >
                                                                {entry.points > 0 ? '+' : ''}{entry.points}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={entry.type === 'purchase' ? 'Achat' : 'Échange'}
                                                                color={entry.type === 'purchase' ? 'success' : 'primary'}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>{entry.description}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Box>
                        )}

                        {/* Analyses Tab */}
                        {activeTab === 3 && (
                            <Box sx={{ p: 3 }}>
                                {loading.analytics ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Paper sx={{ p: 2 }}>
                                                <Typography variant="h6" gutterBottom>
                                                    Tendances des points de fidélité
                                                </Typography>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <LineChart data={analytics.trends}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="month" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Line type="monotone" dataKey="points" stroke="#8884d8" name="Points" />
                                                        <Line type="monotone" dataKey="redemptions" stroke="#82ca9d" name="Rédemptions" />
                                                        <Line type="monotone" dataKey="newMembers" stroke="#ffc658" name="Nouveaux membres" />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Paper sx={{ p: 2 }}>
                                                <Typography variant="h6" gutterBottom>
                                                    Distribution des récompenses
                                                </Typography>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <PieChart>
                                                        <Pie
                                                            data={analytics.rewardDistribution}
                                                            dataKey="value"
                                                            nameKey="name"
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={80}
                                                            label
                                                        >
                                                            {analytics.rewardDistribution.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Paper sx={{ p: 2 }}>
                                                <Typography variant="h6" gutterBottom>
                                                    Prévisions des points de fidélité
                                                </Typography>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <BarChart data={analytics.forecast}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="month" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar dataKey="actual" fill="#8884d8" name="Réel" />
                                                        <Bar dataKey="forecast" fill="#82ca9d" name="Prévision" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Paper sx={{ p: 2 }}>
                                                <Typography variant="h6" gutterBottom>
                                                    Métriques clés
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={4}>
                                                        <Card>
                                                            <CardContent>
                                                                <Typography color="textSecondary" gutterBottom>
                                                                    Taux de croissance mensuel
                                                                </Typography>
                                                                <Typography variant="h4">
                                                                    {analytics.metrics.growthRate}
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <Card>
                                                            <CardContent>
                                                                <Typography color="textSecondary" gutterBottom>
                                                                    Taux de rédemption
                                                                </Typography>
                                                                <Typography variant="h4">
                                                                    {analytics.metrics.redemptionRate}
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <Card>
                                                            <CardContent>
                                                                <Typography color="textSecondary" gutterBottom>
                                                                    Précision des prévisions
                                                                </Typography>
                                                                <Typography variant="h4">
                                                                    {analytics.metrics.forecastAccuracy}
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                )}
                            </Box>
                        )}
                    </Paper>
                </>
            )}

            {/* Card Dialog */}
            <Dialog
                open={showCardDialog}
                onClose={() => {
                    setShowCardDialog(false);
                    setSelectedCard(null);
                }}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {selectedCard?.id ? 'Modifier la carte' : 'Nouvelle carte'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nom du client"
                                value={selectedCard?.customerName || ''}
                                onChange={(e) => setSelectedCard({ ...selectedCard, customerName: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Numéro de carte"
                                value={selectedCard?.cardNumber || ''}
                                onChange={(e) => setSelectedCard({ ...selectedCard, cardNumber: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Points"
                                type="number"
                                value={selectedCard?.points || ''}
                                onChange={(e) => setSelectedCard({ ...selectedCard, points: parseInt(e.target.value) || 0 })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Date d'adhésion"
                                type="date"
                                value={selectedCard?.joinDate || format(new Date(), 'yyyy-MM-dd')}
                                onChange={(e) => setSelectedCard({ ...selectedCard, joinDate: e.target.value })}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Dernier achat"
                                type="date"
                                value={selectedCard?.lastPurchase || format(new Date(), 'yyyy-MM-dd')}
                                onChange={(e) => setSelectedCard({ ...selectedCard, lastPurchase: e.target.value })}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowCardDialog(false);
                        setSelectedCard(null);
                    }}>
                        Annuler
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveCard}
                    >
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reward Dialog */}
            <Dialog
                open={showRewardDialog}
                onClose={() => {
                    setShowRewardDialog(false);
                    setSelectedReward(null);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Échanger une récompense</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Client</InputLabel>
                                <Select
                                    value={''}
                                    onChange={(e) => {
                                        const card = cards.find(c => c.id === e.target.value);
                                        if (card && selectedReward) {
                                            redeemReward(card, selectedReward);
                                            setShowRewardDialog(false);
                                        }
                                    }}
                                    label="Client"
                                >
                                    {cards.map((card) => (
                                        <MenuItem key={card.id} value={card.id}>
                                            {card.customerName} ({card.points} points)
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowRewardDialog(false);
                        setSelectedReward(null);
                    }}>
                        Annuler
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Loyalty;