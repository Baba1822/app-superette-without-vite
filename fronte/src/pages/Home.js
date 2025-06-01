// src/pages/Home.js
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  AppBar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Storefront as StorefrontIcon, 
  ShoppingCart as CartIcon, 
  LocalOffer as OfferIcon, 
  Security as SecurityIcon 
} from '@mui/icons-material';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: 'Produits Frais',
      description: 'Une large sélection de produits frais et de qualité.',
      icon: <CartIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
    },
    {
      title: 'Livraison Rapide',
      description: 'Livraison à domicile rapide et sécurisée.',
      icon: <OfferIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
    },
    {
      title: 'Programme Fidélité',
      description: 'Gagnez des points et profitez de réductions exclusives.',
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
    }
  ];

  const handleNavigation = (path) => {
    if (isAuthenticated && (path === '/Login' || path === '/Register')) {
      navigate('/profile');
    } else {
      navigate(path);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', p: 1 }}>
        <StorefrontIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>App Superette</Typography>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <StorefrontIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            Bienvenue sur App Superette
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Votre superette en ligne, simple et efficace
          </Typography>
          
          <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Grid item>
              <Button
                variant="contained"
                size="large"
                onClick={() => handleNavigation('/boutique')}
                sx={{ minWidth: 200 }}
              >
                Commencer vos achats
              </Button>
            </Grid>
            {!isAuthenticated && (
              <>
                <Grid item>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => handleNavigation('/login')}
                    sx={{ minWidth: 200 }}
                  >
                    Se connecter
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="text"
                    size="large"
                    onClick={() => handleNavigation('/register')}
                    sx={{ minWidth: 200 }}
                  >
                    S'inscrire
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', height: '100%' }}>
                  {feature.icon}
                  <Typography variant="h5" component="h2" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;