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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../../services/productService';
import { orderService } from '../../../services/orderService';
import { loyaltyService } from '../../../services/loyaltyService';
import { useProductContext } from '../../../context/ProductContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const scanLoyaltyCard = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('CARD123456');
    }, 1000);
  });
};

const HomePage = () => {
  const navigate = useNavigate();
  const { cartItems = [], addToCart, clearCart } = useCart();
  const queryClient = useQueryClient();
  const productContext = useProductContext();
  const newProductAdded = productContext?.newProductAdded;
  const stockUpdated = productContext?.stockUpdated;
  const clearNewProduct = productContext?.clearNewProduct;
  const clearStockUpdate = productContext?.clearStockUpdate;
  
  const totalCartAmount = cartItems.reduce((total, item) => {
    const itemPrice = item?.price || 0;
    const itemQuantity = item?.quantity || 0;
    return total + (itemPrice * itemQuantity);
  }, 0);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loyaltyCard, setLoyaltyCard] = useState(null);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDistance, setDeliveryDistance] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('orange_money');
  const [orderTotal, setOrderTotal] = useState(0);

  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  useEffect(() => {
    const loadLoyaltyCard = async () => {
      try {
        const customerId = getCurrentCustomerId();
        if (customerId) {
          const card = await loyaltyService.getLoyaltyCard(customerId);
          setLoyaltyCard(card);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la carte de fidélité:', error);
        showNotification('Erreur lors du chargement de la carte de fidélité', 'error');
      }
    };
    loadLoyaltyCard();
  }, []);

  useEffect(() => {
    if (newProductAdded) {
      showNotification(`Nouveau produit disponible: ${newProductAdded.nom}`, 'success');
      clearNewProduct?.();
    }
  }, [newProductAdded, clearNewProduct]);

  useEffect(() => {
    if (stockUpdated) {
      const cartItem = cartItems.find(item => item.id === stockUpdated.id);
      if (cartItem && cartItem.quantity > stockUpdated.stock) {
        showNotification(`Stock mis à jour pour ${stockUpdated.nom}. Nouveau stock: ${stockUpdated.stock}`, 'warning');
      }
      clearStockUpdate?.();
    }
  }, [stockUpdated, clearStockUpdate, cartItems]);

  const getCurrentCustomerId = () => {
    return localStorage.getItem('customerId') || null;
  };

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAllProducts,
    retry: 2,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    onError: (error) => {
      console.error('Erreur lors de la récupération des produits:', error);
      showNotification('Erreur lors de la récupération des produits', 'error');
    }
  });

  const { data: promotions = [], isLoading: promotionsLoading } = useQuery({
    queryKey: ['promotions'],
    queryFn: productService.getPromotionalProducts,
    retry: 2,
    staleTime: 1000 * 60 * 10,
    onError: (error) => {
      console.error('Erreur lors de la récupération des promotions:', error);
    }
  });

  const handleAddToCart = async (product) => {
    if (!product || !product.nom || product.prix === undefined) {
      showNotification('Erreur: Produit invalide', 'error');
      return;
    }
    
    if (product.stock <= 0) {
      showNotification('Ce produit est en rupture de stock', 'error');
      return;
    }

    addToCart({ 
      id: product.id,
      name: product.nom,
      price: product.prix,
      quantity: 1,
      stock: product.stock
    });
    
    showNotification(`${product.nom} ajouté au panier`, 'success');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCartToggle = () => {
    setCartOpen(!cartOpen);
  };

  const handleOrangeMoneyPayment = () => {
    window.location.href = '/api/payment/orange-money';
  };

  const handleSplitPayment = () => {
    navigate('/payment/split');
  };

  const handleLoyaltyCardScan = async () => {
    try {
      const scannedCardId = await scanLoyaltyCard();
      if (scannedCardId) {
        const card = await loyaltyService.getLoyaltyCard(scannedCardId);
        setLoyaltyCard(card);
        setShowRedeemDialog(true);
        showNotification('Carte scannée avec succès', 'success');
      }
    } catch (error) {
      console.error('Erreur lors du scan de la carte:', error);
      showNotification('Erreur lors du scan de la carte', 'error');
    }
  };

  const handleRedeemPoints = async () => {
    try {
      if (!loyaltyCard || pointsToRedeem <= 0) return;

      if (pointsToRedeem > loyaltyCard.points) {
        showNotification('Points insuffisants', 'error');
        return;
      }

      await loyaltyService.redeemPoints(loyaltyCard.id, pointsToRedeem);
      
      setLoyaltyCard({
        ...loyaltyCard,
        points: loyaltyCard.points - pointsToRedeem
      });
      
      showNotification(`${pointsToRedeem} points réduits avec succès`, 'success');
      
      setShowRedeemDialog(false);
      setPointsToRedeem(0);
    } catch (error) {
      console.error('Erreur lors de la réduction des points:', error);
      showNotification('Erreur lors de la réduction des points', 'error');
    }
  };

  const createOrderMutation = useMutation({
    mutationFn: (orderData) => orderService.createOrder(orderData),
    onSuccess: (data) => {
      showNotification('Commande créée avec succès', 'success');
      clearCart();
      setDeliveryAddress('');
      setDeliveryDistance(0);
      setDeliveryFee(0);
      setPaymentMethod('orange_money');
      navigate('/order-confirmation');
    },
    onError: (error) => {
      showNotification('Erreur lors de la création de la commande', 'error');
      console.error('Erreur commande:', error);
    }
  });

  const handleCheckout = () => {
    if (!deliveryAddress) {
      showNotification('Veuillez entrer une adresse de livraison', 'error');
      return;
    }

    if (deliveryDistance <= 0) {
      showNotification('Veuillez entrer une distance valide', 'error');
      return;
    }

    if (!paymentMethod) {
      showNotification('Veuillez choisir une méthode de paiement', 'error');
      return;
    }

    const customerId = getCurrentCustomerId();
    if (!customerId) {
      showNotification('Veuillez vous connecter pour passer commande', 'error');
      navigate('/login');
      return;
    }

    const orderData = {
      clientId: customerId,
      deliveryAddress,
      deliveryDistance,
      paymentMethod,
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity || 1
      }))
    };

    createOrderMutation.mutate(orderData);
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return '0';
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF'
    }).format(price);
  };

  const filteredProducts = (Array.isArray(products) ? products : []).filter(product => {
    if (!product || typeof product !== 'object') return false;

    const productName = product.nom || '';
    const productDescription = product.description || '';
    
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isSeasonal = product.saison && 
      product.date_debut_saison && product.date_fin_saison &&
      new Date(product.date_debut_saison) <= new Date() &&
      new Date(product.date_fin_saison) >= new Date();
    
    const isOnPromotion = product.promotion && 
      product.date_debut_promo && product.date_fin_promo &&
      new Date(product.date_debut_promo) <= new Date() &&
      new Date(product.date_fin_promo) >= new Date();
    
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            App Superette
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

      <Container maxWidth="lg" sx={{ py: 3, flex: 1 }}>
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

          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Carte de Fidélité
            </Typography>
            
            {loyaltyCard ? (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {loyaltyCard.cardNumber}
                        </Typography>
                        <Typography color="textSecondary">
                          Niveau: {loyaltyCard.tier}
                        </Typography>
                        <Typography variant="h5" sx={{ mt: 1 }}>
                          {loyaltyCard.points} points
                        </Typography>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<QrIcon />}
                          onClick={handleLoyaltyCardScan}
                          sx={{ mt: 2 }}
                        >
                          Scanner la carte
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Avantages:
                    </Typography>
                    <List>
                      {loyaltyCard.tier === 'Bronze' && (
                        <ListItem>
                          <ListItemText>
                            1 point pour chaque 100 GNF dépensés
                          </ListItemText>
                        </ListItem>
                      )}
                      {loyaltyCard.tier === 'Silver' && (
                        <ListItem>
                          <ListItemText>
                            1.5 points pour chaque 100 GNF dépensés
                          </ListItemText>
                        </ListItem>
                      )}
                      {loyaltyCard.tier === 'Gold' && (
                        <ListItem>
                          <ListItemText>
                            2 points pour chaque 100 GNF dépensés
                          </ListItemText>
                        </ListItem>
                      )}
                    </List>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => setShowRedeemDialog(true)}
                      >
                        Réduire des points
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body1">
                  Vous n'avez pas encore de carte de fidélité
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/loyalty')}
                  sx={{ mt: 2 }}
                >
                  Créer une carte
                </Button>
              </Box>
            )}
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Total à payer: {formatPrice(totalCartAmount)} GNF
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleCheckout}
              sx={{ mt: 2 }}
              disabled={cartItems.length === 0}
            >
              Passer à la caisse
            </Button>
          </Box>
        </Paper>

        {!promotionsLoading && promotions.length > 0 && (
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
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            Produits Disponibles
          </Typography>
          
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="product categories">
            <Tab label="Tous" />
            <Tab label="Boissons" />
            <Tab label="Produits Laitiers" />
            <Tab label="Fruits et Légumes" />
          </Tabs>
        </Box>

        {filteredProducts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="textSecondary">
              Aucun produit trouvé
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Essayez de modifier vos critères de recherche ou de changer de catégorie.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredProducts.map((product) => {
              
              const isPromo = product.promotion && 
                new Date(product.date_debut_promo) <= new Date() && 
                new Date(product.date_fin_promo) >= new Date();
              
              const promoPrice = isPromo 
                ? product.type_promotion === 'percentage'
                  ? product.prix * (1 - product.valeur_promotion / 100)
                  : product.prix - product.valeur_promotion
                : null;

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id || Math.random()}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {isPromo && (
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
                      image={product.image || '/placeholder-product.png'}
                      alt={product.nom || 'Produit'}
                      onError={(e) => {
                        e.target.src = '/placeholder-product.png';
                      }}
                    />
                    
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h3">
                        {product.nom || 'Nom non disponible'}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {product.description || 'Description non disponible'}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isPromo ? (
                          <>
                            <Typography sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
                              {formatPrice(product.prix)}
                            </Typography>
                            <Typography color="error" fontWeight="bold">
                              {formatPrice(promoPrice)}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="h6" color="primary">
                            {formatPrice(product.prix)}
                          </Typography>
                        )}
                      </Box>
                      
                      {product.stock > 0 && product.stock <= 5 && (
                        <Typography variant="caption" color="warning.main" sx={{ display: 'block', mb: 1 }}>
                          Plus que {product.stock} en stock
                        </Typography>
                      )}
                      
                      <Button
                        variant="contained"
                        startIcon={<CartIcon />}
                        onClick={() => handleAddToCart(product)}
                        fullWidth
                        disabled={product.stock === 0}
                        sx={{ mt: 1 }}
                      >
                        {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

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
                {cartItems.map((item, index) => (
                  <ListItem key={item.id || index}>
                    <ListItemText
                      primary={item.name || 'Produit'}
                      secondary={`${item.quantity || 1} x ${formatPrice(item.price)} GNF`}
                    />
                    <Typography>
                      {formatPrice((item.price || 0) * (item.quantity || 1))} GNF
                    </Typography>
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" sx={{ mb: 2 }}>
                Total: {formatPrice(totalCartAmount)} GNF
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

      <Dialog open={showRedeemDialog} onClose={() => setShowRedeemDialog(false)}>
        <DialogTitle>Réduire des points</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Points à réduire"
              type="number"
              value={pointsToRedeem}
              onChange={(e) => setPointsToRedeem(parseInt(e.target.value) || 0)}
              inputProps={{ min: 0, max: loyaltyCard?.points || 0 }}
              helperText={`Points disponibles: ${loyaltyCard?.points || 0}`}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRedeemDialog(false)}>Annuler</Button>
          <Button 
            onClick={handleRedeemPoints} 
            variant="contained" 
            color="primary"
            disabled={pointsToRedeem <= 0 || pointsToRedeem > (loyaltyCard?.points || 0)}
          >
            Réduire
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', p: 2, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            {new Date().getFullYear()} App Superette - Tous droits réservés
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;