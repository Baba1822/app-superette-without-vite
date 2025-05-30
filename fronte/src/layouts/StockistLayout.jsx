import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Assessment as ReportIcon,
  SwapHoriz as MovementIcon,
  Storefront as StorefrontIcon
} from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const StockistLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { text: 'Gestion des stocks', icon: <InventoryIcon />, path: '/inventaire' },
    { text: 'Rapports', icon: <ReportIcon />, path: '/inventaire/rapports' },
    { text: 'Mouvements', icon: <MovementIcon />, path: '/inventaire/mouvements' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          display: 'flex',
          alignItems: 'center',
          p: 1
        }}
      >
        <Toolbar sx={{ px: 0 }}>
          <StorefrontIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
            App Superette
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Déconnexion
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '64px',
            top: '64px'
          }
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.text} onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px',
          width: `calc(100% - ${drawerWidth}px)`
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default StockistLayout;