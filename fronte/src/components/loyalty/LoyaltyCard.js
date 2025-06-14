import {
    CardMembership as CardIcon,
    History as HistoryIcon,
    Redeem as RedeemIcon,
    Stars as StarsIcon
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
    Divider,
    Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Snackbar,
    Tab,
    Tabs,
    Typography,
    useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import LoyaltyService from '../../services/loyaltyService';

const LoyaltyCard = ({ clientId }) => {
    const theme = useTheme();
    const [loyaltyData, setLoyaltyData] = useState(null);
    const [rewards, setRewards] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        loadLoyaltyData();
    }, [clientId]);

    const loadLoyaltyData = async () => {
        try {
            const [card, availableRewards] = await Promise.all([
                LoyaltyService.getLoyaltyCard(clientId),
                LoyaltyService.getAvailableRewards(clientId)
            ]);
            setLoyaltyData(card);
            setRewards(availableRewards);
        } catch (error) {
            console.error('Erreur lors du chargement des données de fidélité:', error);
            showSnackbar('Erreur lors du chargement de la carte de fidélité', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRedeemPoints = async (reward) => {
        setSelectedReward(reward);
        setOpenDialog(true);
    };

    const confirmRedemption = async () => {
        try {
            const isAvailable = await LoyaltyService.checkRewardAvailability(
                clientId,
                selectedReward.id
            );

            if (!isAvailable) {
                showSnackbar('Cette récompense n\'est plus disponible', 'error');
                return;
            }

            if (loyaltyData.points < selectedReward.pointsCost) {
                showSnackbar('Points insuffisants pour cette récompense', 'error');
                return;
            }

            await LoyaltyService.redeemPoints(
                clientId,
                selectedReward.id,
                selectedReward.pointsCost
            );

            await loadLoyaltyData(); // Recharger les données
            showSnackbar('Récompense obtenue avec succès !', 'success');
            setOpenDialog(false);
        } catch (error) {
            showSnackbar('Erreur lors de l\'utilisation des points', 'error');
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

    const getTierColor = (tier) => {
        switch (tier) {
            case 'Gold':
                return theme.palette.warning.main;
            case 'Silver':
                return theme.palette.grey[400];
            case 'Bronze':
                return theme.palette.brown;
            default:
                return theme.palette.primary.main;
        }
    };

    if (loading || !loyaltyData) {
        return (
            <Box sx={{ width: '100%', mt: 3 }}>
                <LinearProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ py: 3 }}>
            {/* Carte de fidélité principale */}
            <Card
                sx={{
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                    color: 'white',
                    mb: 3
                }}
            >
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box display="flex" alignItems="center">
                                <CardIcon sx={{ fontSize: 40, mr: 2 }} />
                                <Box>
                                    <Typography variant="h5">
                                        Carte de Fidélité
                                    </Typography>
                                    <Typography variant="body2">
                                        {loyaltyData.cardNumber}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box display="flex" justifyContent="flex-end" alignItems="center">
                                <Box textAlign="right" mr={2}>
                                    <Typography variant="h4">
                                        {loyaltyData.points}
                                    </Typography>
                                    <Typography variant="body2">
                                        points disponibles
                                    </Typography>
                                </Box>
                                <Chip
                                    icon={<StarsIcon />}
                                    label={loyaltyData.tier}
                                    sx={{
                                        backgroundColor: getTierColor(loyaltyData.tier),
                                        color: 'white'
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Onglets */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={selectedTab}
                    onChange={(_, newValue) => setSelectedTab(newValue)}
                >
                    <Tab label="Récompenses" icon={<RedeemIcon />} iconPosition="start" />
                    <Tab label="Historique" icon={<HistoryIcon />} iconPosition="start" />
                </Tabs>
            </Box>

            {/* Contenu des onglets */}
            {selectedTab === 0 && (
                <Grid container spacing={2}>
                    {rewards.map((reward) => (
                        <Grid item xs={12} sm={6} md={4} key={reward.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {reward.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {reward.description}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mt: 2
                                        }}
                                    >
                                        <Chip
                                            label={`${reward.pointsCost} points`}
                                            color={loyaltyData.points >= reward.pointsCost ? 'primary' : 'default'}
                                        />
                                        <Button
                                            variant="contained"
                                            disabled={loyaltyData.points < reward.pointsCost}
                                            onClick={() => handleRedeemPoints(reward)}
                                        >
                                            Échanger
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {selectedTab === 1 && (
                <List>
                    {loyaltyData.history.map((item, index) => (
                        <React.Fragment key={index}>
                            <ListItem>
                                <ListItemIcon>
                                    {item.type === 'earn' ? <StarsIcon color="primary" /> : <RedeemIcon color="secondary" />}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.transaction}
                                    secondary={new Date(item.date).toLocaleDateString()}
                                />
                                <ListItemSecondaryAction>
                                    <Typography
                                        color={item.type === 'earn' ? 'primary' : 'secondary'}
                                        variant="body2"
                                    >
                                        {item.type === 'earn' ? '+' : '-'}{item.points} points
                                        {item.amount && ` (${formatPrice(item.amount)})`}
                                    </Typography>
                                </ListItemSecondaryAction>
                            </ListItem>
                            {index < loyaltyData.history.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            )}

            {/* Dialog de confirmation */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Confirmer l'échange</DialogTitle>
                <DialogContent>
                    {selectedReward && (
                        <>
                            <Typography variant="h6" gutterBottom>
                                {selectedReward.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                {selectedReward.description}
                            </Typography>
                            <Typography variant="body1">
                                Coût: {selectedReward.pointsCost} points
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Points restants après échange: {loyaltyData.points - selectedReward.pointsCost}
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        Annuler
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={confirmRedemption}
                    >
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar pour les notifications */}
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

export default LoyaltyCard; 