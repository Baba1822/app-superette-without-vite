import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  AttachMoney as SalesIcon,
  Receipt as ExpensesIcon,
  Assessment as ReportsIcon,
  LocalOffer as PromotionsIcon,
  Discount as DiscountsIcon,
  Event as SeasonalIcon,
  Storefront as StorefrontIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 240;

const ManagerLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/finances' },
    { text: 'Ventes', icon: <SalesIcon />, path: '/finances/ventes' },
    { text: 'Dépenses', icon: <ExpensesIcon />, path: '/finances/depenses' },
    { text: 'Rapports', icon: <ReportsIcon />, path: '/finances/rapports' },
    { text: 'Promotions', icon: <PromotionsIcon />, path: '/offres/promotions' },
    { text: 'Réductions', icon: <DiscountsIcon />, path: '/offres/reductions' },
    { text: 'Offres saisonnières', icon: <SeasonalIcon />, path: '/offres/saisonnieres' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StorefrontIcon />
          <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
            App Superette
          </Typography>
          <IconButton
            color="inherit"
            aria-label="Se déconnecter"
            onClick={handleLogout}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            marginTop: '64px',
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px',
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          minHeight: '100vh'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default ManagerLayout;