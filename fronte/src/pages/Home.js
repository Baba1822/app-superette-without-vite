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
  CardMedia,
  useTheme,
  useMediaQuery,
  AppBar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Storefront as StorefrontIcon, ShoppingCart as CartIcon, LocalOffer as OfferIcon, Security as SecurityIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: 'Produits Frais',
      description: 'Une large sélection de produits frais et de qualité.',
      image: '/images/fresh-products.jpg'
    },
    {
      title: 'Livraison Rapide',
      description: 'Livraison à domicile rapide et sécurisée.',
      image: '/images/delivery.jpg'
    },
    {
      title: 'Programme Fidélité',
      description: 'Gagnez des points et profitez de réductions exclusives.',
      image: '/images/loyalty.jpg'
    }
  ];

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
                onClick={() => navigate('/boutique')}
              >
                Commencer vos achats
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/connexion')}
              >
                Se connecter
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CartIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Shopping Facile
                </Typography>
                <Typography color="text.secondary">
                  Parcourez notre catalogue et faites vos achats en quelques clics
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <OfferIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Offres Spéciales
                </Typography>
                <Typography color="text.secondary">
                  Profitez de nos promotions et réductions exclusives
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <SecurityIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Paiement Sécurisé
                </Typography>
                <Typography color="text.secondary">
                  Transactions sécurisées et protection de vos données
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;