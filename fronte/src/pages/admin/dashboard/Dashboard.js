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
    Settings as SettingsIcon
} from '@mui/icons-material';
import { BarChart, Bar, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
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
    Typography,
    useMediaQuery
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

const Dashboard = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

    const statCards = [
        {
            title: 'Ventes du jour',
            value: '1 250 000 GNF',
            trend: '+12%',
            icon: <CartIcon sx={{ color: 'success.main' }} />
        },
        {
            title: 'Nouveaux clients',
            value: '15',
            trend: '+5%',
            icon: <PersonIcon sx={{ color: 'primary.main' }} />
        },
        {
            title: 'Produits en stock',
            value: '1,250',
            trend: '-2%',
            icon: <InventoryIcon sx={{ color: 'warning.main' }} />
        },
        {
            title: 'Commandes en attente',
            value: '8',
            trend: '+3',
            icon: <CartIcon sx={{ color: 'error.main' }} />
        }
    ];

    const salesData = [
        { name: 'Alimentaire', value: 450000 },
        { name: 'Boissons', value: 300000 },
        { name: 'Hygiène', value: 250000 },
        { name: 'Ménage', value: 150000 },
        { name: 'Autres', value: 100000 }
    ];

    const topProductsData = [
        { name: 'Riz', value: 120 },
        { name: 'Huile', value: 90 },
        { name: 'Sucre', value: 75 },
        { name: 'Lait', value: 60 },
        { name: 'Pain', value: 45 }
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar */}
            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={!isMobile}
                onClose={() => {}}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: theme.palette.primary.main,
                        color: 'white'
                    },
                }}
            >
                <Box sx={{ mt: 8 }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItemButton
                                key={item.text}
                                onClick={() => navigate(item.path)}
                                selected={location.pathname.startsWith(item.path)}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: 'white' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* Main content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" sx={{ mb: 4, mt: 2 }}>
                    Tableau de bord
                </Typography>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {statCards.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            {stat.title}
                                        </Typography>
                                        {stat.icon}
                                    </Box>
                                    <Typography variant="h5">
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color={stat.trend.startsWith('+') ? 'success.main' : 'error.main'}>
                                        {stat.trend}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Charts */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Ventes par catégorie
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`${value} GNF`, 'Ventes']} />
                                    <Legend />
                                    <Bar dataKey="value" fill={theme.palette.primary.main} name="Ventes (GNF)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Produits les plus vendus
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={topProductsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill={theme.palette.secondary.main} name="Quantité vendue" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Dashboard;
