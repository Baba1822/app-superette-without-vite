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
  AppBar,
  Paper,
  styled
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Storefront as StorefrontIcon, 
  ShoppingCart, 
  LocalOffer, 
  Security as SecurityIcon 
} from '@mui/icons-material';

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  padding: theme.spacing(8, 0),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 4),
  textTransform: 'none',
  fontSize: '1.1rem',
  fontWeight: 600,
}));

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [];

  const handleNavigation = (path) => {
    if (isAuthenticated && (path === '/Login' || path === '/Register')) {
      navigate('/profile');
    } else {
      navigate(path);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <HeroSection>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <StorefrontIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Bienvenue sur App Superette
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              App Superette - Simple et efficace
            </Typography>
            
            <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
              {!isAuthenticated && (
                <>
                  <Grid item>
                    <StyledButton
                      variant="contained"
                      color="secondary"
                      size="large"
                      onClick={() => handleNavigation('/login')}
                      sx={{ minWidth: 200 }}
                    >
                      Se connecter
                    </StyledButton>
                  </Grid>
                  <Grid item>
                    <StyledButton
                      variant="outlined"
                      color="secondary"
                      size="large"
                      onClick={() => handleNavigation('/register')}
                      sx={{ minWidth: 200 }}
                    >
                      S'inscrire
                    </StyledButton>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ mt: 8, mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          Pourquoi choisir App Superette ?
        </Typography>
        
        <Grid container spacing={4}>
          {[
            {
              title: 'Achats Faciles',
              description: 'Commandez en quelques clics',
              icon: <ShoppingCart sx={{ fontSize: 40, mb: 2 }} />
            },
            {
              title: 'Livraison Rapide',
              description: 'Recevez vos courses rapidement',
              icon: <LocalOffer sx={{ fontSize: 40, mb: 2 }} />
            },
            {
              title: 'Sécurité',
              description: 'Paiement et livraison sécurisés',
              icon: <SecurityIcon sx={{ fontSize: 40, mb: 2 }} />
            }
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', height: '100%' }}>
                  {feature.icon}
                  <Typography variant="h5" component="h2" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;