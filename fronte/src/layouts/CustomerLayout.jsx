import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';
import CustomerNavigation from '../components/navigation/CustomerNavigation';
import { Storefront as StorefrontIcon } from '@mui/icons-material';

const CustomerLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header avec AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <StorefrontIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="h1" sx={{ 
            fontWeight: 'bold',
            flexGrow: 1 
          }}>
            App Superette
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Navigation */}
      <CustomerNavigation />

      {/* Contenu principal */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          pt: '128px', // Espace pour AppBar + Navigation
          pb: 3,
          minHeight: 'calc(100vh - 128px)'
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default CustomerLayout;