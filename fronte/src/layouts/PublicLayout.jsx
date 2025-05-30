import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container
} from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart as ShopIcon } from '@mui/icons-material';

const PublicLayout = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed">
        <Toolbar>
          <ShopIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SuperMarché en Ligne
          </Typography>
          <Button color="inherit" onClick={() => navigate('/login')}>
            Se connecter
          </Button>
          <Button color="inherit" onClick={() => navigate('/register')}>
            S'inscrire
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: '64px',
          px: 2,
        }}
      >
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          bgcolor: 'background.paper',
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} SuperMarché en Ligne. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicLayout;