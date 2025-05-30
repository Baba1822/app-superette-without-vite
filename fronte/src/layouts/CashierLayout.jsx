import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart as CartIcon,
  Receipt as ReceiptIcon,
  History as HistoryIcon,
  Storefront as StorefrontIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 240;

const CashierLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { text: 'Caisse', icon: <CartIcon />, path: '/cashier' },
    { text: 'Reçus', icon: <ReceiptIcon />, path: '/cashier/receipts' },
    { text: 'Historique', icon: <HistoryIcon />, path: '/cashier/history' }
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
          <IconButton color="inherit" onClick={handleLogout} aria-label="Se déconnecter">
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
          {menuItems.map(({ text, icon, path }) => {
            const isActive = location.pathname === path;

            return (
              <ListItemButton
                key={text}
                onClick={() => navigate(path)}
                selected={isActive}
                aria-current={isActive ? 'page' : undefined}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px',
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default CashierLayout;
