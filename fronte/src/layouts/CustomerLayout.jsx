import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Typography } from '@mui/material';
import CustomerNavigation from '../components/navigation/CustomerNavigation';
import { Storefront as StorefrontIcon } from '@mui/icons-material';

const CustomerLayout = () => {
  return (
    <Box>
      <AppBar position="static" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', p: 1 }}>
        <StorefrontIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>App Superette</Typography>
      </AppBar>
      <CustomerNavigation />
      <Box component="main" sx={{ p: 3, mt: '64px' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default CustomerLayout;