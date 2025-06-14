import React from 'react';
import {
    Assessment as AssessmentIcon,
    ShoppingCart as CartIcon,
    Dashboard as DashboardIcon,
    LocalShipping as DeliveryIcon,
    Inventory as InventoryIcon,
    LocalMall as LocalMallIcon,
    CardMembership as LoyaltyIcon,
    People as PeopleIcon,
    Person as PersonIcon,
    Store as StoreIcon,
    Receipt as OrderIcon,
    Payment as PaymentIcon,
    Settings as SettingsIcon,
    TrendingUp as TrendingUpIcon,
    AttachMoney as MoneyIcon,
    Group as GroupIcon,
    Inventory2 as ProductIcon
} from '@mui/icons-material';
import { BarChart, Bar, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import {
    Box,
    Card,
    CardContent,
    Drawer,
    Grid,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography,
    useMediaQuery,
    CircularProgress,
    Alert
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import DashboardService from '../../../services/DashboardService';
import moment from 'moment';

// Couleurs pour les graphiques
const COLORS = ['#4CAF50', '#FF9800', '#2196F3', '#009688', '#F44336'];

const drawerWidth = 240;

const Dashboard = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Utilisation de React Query pour récupérer les données
    const { data: dashboardStats, isLoading: statsLoading, error: statsError } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: DashboardService.getDashboardStats,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
    });

    const { data: salesData, isLoading: salesLoading, error: salesError } = useQuery({
        queryKey: ['salesData'],
        queryFn: DashboardService.getSalesData,
        staleTime: 1000 * 60 * 5,
        retry: 3
    });

    const { data: topProducts, isLoading: topProductsLoading, error: topProductsError } = useQuery({
        queryKey: ['topProducts'],
        queryFn: () => DashboardService.getTopProducts(5),
        staleTime: 1000 * 60 * 5,
        retry: 3
    });

    // Calculer les dates pour l'historique des ventes (dernier mois)
    const endDate = moment().endOf('day').toISOString();
    const startDate = moment().subtract(30, 'days').startOf('day').toISOString();

    const { data: salesHistory, isLoading: salesHistoryLoading, error: salesHistoryError } = useQuery({
        queryKey: ['salesHistory', startDate, endDate],
        queryFn: () => DashboardService.getSalesHistory(startDate, endDate),
        staleTime: 1000 * 60 * 5,
        retry: 3
    });

    // Gestion des erreurs
    const hasError = statsError || salesError || topProductsError || salesHistoryError;
    const error = statsError || salesError || topProductsError || salesHistoryError;

    const menuItems = [
        { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/administration' },
        { text: 'Produits', icon: <LocalMallIcon />, path: '/administration/produits' },
        { text: 'Clientèle', icon: <PersonIcon />, path: '/administration/clients' },
        { text: 'Ventes', icon: <CartIcon />, path: '/administration/ventes' },   
        { text: 'Commandes', icon: <OrderIcon />, path: '/administration/commandes' },
        { text: 'Paiements', icon: <PaymentIcon />, path: '/administration/paiements' },
        { text: 'Fournisseurs', icon: <StoreIcon />, path: '/administration/fournisseurs' },
        { text: 'Employés', icon: <PeopleIcon />, path: '/administration/employes' },
        { text: 'Rapports', icon: <AssessmentIcon />, path: '/administration/rapports' },
        { text: 'Fidélité', icon: <LoyaltyIcon />, path: '/administration/fidelite' },
        { text: 'Livraisons', icon: <DeliveryIcon />, path: '/administration/livraisons' },
        { text: 'Paramètres', icon: <SettingsIcon />, path: '/administration/parametres' } 
    ];

    // Afficher un message d'erreur si présent
    if (hasError) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    Une erreur est survenue lors du chargement des données: {error?.message || 'Erreur inconnue'}
                </Alert>
            </Box>
        );
    }

    // Afficher un indicateur de chargement si tout est en cours de chargement
    if (statsLoading && salesLoading && topProductsLoading && salesHistoryLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Données par défaut si pas de données
    const defaultStats = {
        statCards: [
            { title: 'Total Ventes', value: 0, trend: '+0%', icon: <TrendingUpIcon /> },
            { title: 'Chiffre d\'affaires', value: '0 Gnf', trend: '+0%', icon: <MoneyIcon /> },
            { title: 'Total Clients', value: 0, trend: '+0%', icon: <GroupIcon /> },
            { title: 'Total Produits', value: 0, trend: '+0%', icon: <ProductIcon /> }
        ]
    };

    const stats = dashboardStats || defaultStats;
    const sales = salesData || [];
    const products = topProducts || [];
    const history = salesHistory || [];

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar */}
            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={!isMobile}
                onClose={() => {}}
                PaperProps={{
                    sx: {
                        width: drawerWidth,
                        backgroundColor: theme.palette.primary.dark,
                        color: theme.palette.primary.contrastText
                    }
                }}
            >
                <List>
                    {menuItems.map((item) => (
                        <ListItemButton
                            key={item.text}
                            onClick={() => navigate(item.path)}
                            selected={location.pathname === item.path}
                            sx={{
                                color: theme.palette.primary.contrastText,
                                '&.Mui-selected': {
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" sx={{ mb: 4, mt: 2 }}>
                    Tableau de bord
                </Typography>

                {/* Statistiques */}
                <Grid container spacing={3}>
                    {stats.statCards?.map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={card.title}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                                        <Typography variant="h6" color="text.secondary">
                                            {card.title}
                                        </Typography>
                                        {card.icon}
                                    </Stack>
                                    <Typography variant="h4">
                                        {card.value}
                                    </Typography>
                                    <Typography variant="body2" color={card.trend.includes('+') ? 'success.main' : 'error.main'}>
                                        {card.trend}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Graphiques */}
                <Grid container spacing={3} sx={{ mt: 4 }}>
                    {/* Graphique des ventes par catégorie */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Ventes par période
                                </Typography>
                                {!salesLoading && sales.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={sales}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {sales.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : salesLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 10 }}>
                                        Aucune donnée de vente disponible
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Top produits */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Top produits
                                </Typography>
                                {!topProductsLoading && products.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={products}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#4CAF50" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : topProductsLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 10 }}>
                                        Aucun produit disponible
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Historique des ventes */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Historique des ventes (30 derniers jours)
                                </Typography>
                                {!salesHistoryLoading && history.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={history}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="amount" stroke="#2196F3" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : salesHistoryLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 10 }}>
                                        Aucune donnée historique disponible
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Dashboard;