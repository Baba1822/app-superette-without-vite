import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  AccountCircle as ProfileIcon,
  Loyalty as LoyaltyIcon,
  Payment as PaymentIcon,
  QrCode as QrIcon,
  PhoneAndroid as MobilePaymentIcon,
  AttachMoney as SplitPaymentIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../../services/productService';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { cartItems = [], addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loyaltyCard] = useState({
    points: 1250,
    level: 'Silver',
    cardNumber: '1234 5678 9012'
  });

  // Utilisation de React Query pour récupérer les produits
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAllProducts,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('Erreur lors de la récupération des produits:', error);
    }
  });

  // Mock des promotions (à remplacer par une API réelle)
  const promotions = [
    {
      id: 1,
      title: 'Promo du mois',
      description: '20% sur tous les produits frais',
      image: '/promo1.jpg'
    },
    {
      id: 2,
      title: 'Offre spéciale',
      description: 'Achetez 2, obtenez 1 gratuit',
      image: '/promo2.jpg'
    }
  ];

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCartToggle = () => {
    setCartOpen(!cartOpen);
  };

  const handleOrangeMoneyPayment = () => {
    alert('Redirection vers Orange Money');
  };

  const handleSplitPayment = () => {
    alert('Option de paiement fractionné');
  };

  const handleLoyaltyCardScan = () => {
    alert('Scanner la carte de fidélité');
  };

  // Filtrage des produits en fonction de la recherche et de la catégorie active
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeTab === 0 || // Tous les produits
      (activeTab === 1 && product.category === 'Alimentation') ||
      (activeTab === 2 && product.category === 'Boissons') ||
      (activeTab === 3 && product.category === 'Produits Frais');
    
    return matchesSearch && matchesCategory;
  });

  // Calcul sécurisé du total
  const totalCartAmount = cartItems?.reduce((sum, item) => sum + ((item?.price || 0) * (item?.quantity || 0)), 0) || 0;

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Superette XYZ
          </Typography>
          
          <IconButton color="inherit" onClick={() => navigate('/profile')}>
            <ProfileIcon />
          </IconButton>
          
          <IconButton color="inherit" onClick={handleCartToggle}>
            <Badge badgeContent={cartItems?.length || 0} color="secondary">
              <CartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
        
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher des produits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />
            }}
          />
        </Box>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 3, flex: 1 }}>
        {/* Payment Methods Section */}
        <Paper sx={{ p: 2, mb: 3 }} elevation={3}>
          <Typography variant="h6" gutterBottom>
            Options de Paiement
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<QrIcon />}
                onClick={() => navigate('/online-payment')}
              >
                Paiement en Ligne
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                color="warning"
                startIcon={<MobilePaymentIcon />}
                onClick={handleOrangeMoneyPayment}
              >
                Orange Money
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                startIcon={<SplitPaymentIcon />}
                onClick={handleSplitPayment}
              >
                Paiement Fractionné
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Loyalty Card Section */}
        <Paper sx={{ p: 2, mb: 3 }} elevation={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Carte de Fidélité
              </Typography>
              <Typography variant="body1">
                Niveau: <Chip label={loyaltyCard.level} color="primary" size="small" />
              </Typography>
              <Typography variant="body1">
                Points: <Chip label={loyaltyCard.points} avatar={<Avatar>{loyaltyCard.points > 1000 ? '★' : '☆'}</Avatar>} />
              </Typography>
            </Box>
            
            <Button
              variant="outlined"
              startIcon={<LoyaltyIcon />}
              onClick={handleLoyaltyCardScan}
            >
              Scanner ma carte
            </Button>
          </Box>
        </Paper>

        {/* Promotions Slider */}
        <Box sx={{ mb: 3 }}>
          <Slider {...{
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000
          }}>
            {promotions.map(promo => (
              <Box key={promo.id} sx={{ p: 1 }}>
                <Paper sx={{ p: 2, textAlign: 'center', height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h6">{promo.title}</Typography>
                  <Typography variant="body1">{promo.description}</Typography>
                </Paper>
              </Box>
            ))}
          </Slider>
        </Box>

        {/* Products Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            Produits Disponibles
          </Typography>
          
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="product categories">
            <Tab label="Tous" />
            <Tab label="Alimentation" />
            <Tab label="Boissons" />
            <Tab label="Produits Frais" />
          </Tabs>
        </Box>

        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {product.promotion && (
                  <Chip
                    label="PROMO"
                    color="secondary"
                    size="small"
                    sx={{ position: 'absolute', m: 1, zIndex: 1 }}
                  />
                )}
                
                <CardMedia
                  component="img"
                  height="140"
                  image={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x140?text=Produit';
                  }}
                />
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {product.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>
                  
                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    {product.price.toLocaleString()} GNF
                  </Typography>
                  
                  <Button
                    variant="contained"
                    startIcon={<CartIcon />}
                    onClick={() => handleAddToCart(product)}
                    fullWidth
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Cart Drawer */}
      <Drawer anchor="right" open={cartOpen} onClose={handleCartToggle}>
        <Box sx={{ width: 350, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Mon Panier</Typography>
            <IconButton onClick={handleCartToggle}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider />
          
          {!cartItems || cartItems.length === 0 ? (
            <Typography sx={{ mt: 2 }}>Votre panier est vide</Typography>
          ) : (
            <>
              <List>
                {cartItems.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText
                      primary={item.name}
                      secondary={`${item.quantity} x ${item.price?.toLocaleString() || 0} GNF`}
                    />
                    <Typography>
                      {((item.price || 0) * (item.quantity || 0)).toLocaleString()} GNF
                    </Typography>
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" sx={{ mb: 2 }}>
                Total: {totalCartAmount.toLocaleString()} GNF
              </Typography>
              
              <Button
                fullWidth
                variant="contained"
                color="warning"
                startIcon={<MobilePaymentIcon />}
                onClick={handleOrangeMoneyPayment}
                sx={{ mb: 2 }}
              >
                Payer avec Orange Money
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                startIcon={<SplitPaymentIcon />}
                onClick={handleSplitPayment}
              >
                Paiement Fractionné
              </Button>
            </>
          )}
        </Box>
      </Drawer>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', p: 2, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            2023 Superette XYZ - Tous droits réservés
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;