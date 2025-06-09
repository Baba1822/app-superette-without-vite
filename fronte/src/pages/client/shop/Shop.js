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
import LoyaltyService from '../../../services/LoyaltyService';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { cartItems = [], addToCart } = useCart();
  const queryClient = useQueryClient();
  const totalCartAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loyaltyCard, setLoyaltyCard] = useState(null);
  const [loyaltyCardLoading, setLoyaltyCardLoading] = useState(true);
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

  // Afficher une notification
  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Charger la carte de fidélité au chargement
  useEffect(() => {
    const loadLoyaltyCard = async () => {
      try {
        // Pour le moment, on utilise un ID client fixe pour le test
        const customerId = 1; // À remplacer par la vraie authentification
        const card = await LoyaltyService.getLoyaltyCard(customerId);
        setLoyaltyCard(card);
      } catch (error) {
        console.error('Erreur lors du chargement de la carte de fidélité:', error);
      } finally {
        setLoyaltyCardLoading(false);
      }
    };
    loadLoyaltyCard();
  }, []);


  // Utilisation de React Query pour récupérer les produits
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAllProducts,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    onError: (error) => {
      console.error('Erreur lors de la récupération des produits:', error);
      showNotification('Erreur lors de la récupération des produits', 'error');
    }
  });

  // Effacer le cache des produits quand un nouveau produit est ajouté
  const invalidateProductsCache = () => {
    queryClient.invalidateQueries(['products']);
  };

  // Vérifier les mises à jour des produits toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.refetchQueries(['products']);
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, [queryClient]);

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

  // Scanner la carte de fidélité
  const handleLoyaltyCardScan = async () => {
    try {
      // Simuler le scan d'une carte
      const scannedCard = await LoyaltyService.getLoyaltyCard(1); // À remplacer par le vrai scan
      if (scannedCard) {
        setLoyaltyCard(scannedCard);
        setShowRedeemDialog(true);
      }
    } catch (error) {
      console.error('Erreur lors du scan de la carte:', error);
      showNotification('Erreur lors du scan de la carte', 'error');
    }
  };

  // Réduire les points
  const handleRedeemPoints = async () => {
    try {
      if (!loyaltyCard || pointsToRedeem <= 0) return;

      // Vérifier si on a assez de points
      if (pointsToRedeem > loyaltyCard.points) {
        showNotification('Points insuffisants', 'error');
        return;
      }

      // Appel API pour réduire les points
      await LoyaltyService.redeemPoints(loyaltyCard.id, pointsToRedeem);
      
      // Mettre à jour la carte localement
      setLoyaltyCard({
        ...loyaltyCard,
        points: loyaltyCard.points - pointsToRedeem
      });
      
      // Afficher une notification de succès
      showNotification(`Points réduits avec succès. Nouveau total: ${loyaltyCard.points - pointsToRedeem} points`, 'success');
      
      setShowRedeemDialog(false);
      setPointsToRedeem(0);
    } catch (error) {
      console.error('Erreur lors de la réduction des points:', error);
      showNotification('Erreur lors de la réduction des points', 'error');
    }
  };

  // Mutation pour créer une commande
  const createOrderMutation = useMutation({
    mutationFn: (orderData) => orderService.createOrder(orderData),
    onSuccess: (data) => {
      showNotification('Commande créée avec succès', 'success');
      // Vider le panier après la commande
      addToCart([]);
      // Réinitialiser les champs
      setDeliveryAddress('');
      setDeliveryDistance(0);
      setDeliveryFee(0);
      setPaymentMethod('orange_money');
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

    const orderData = {
      clientId: 1, // À remplacer par l'ID du client connecté
      deliveryAddress,
      deliveryDistance,
      paymentMethod,
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    createOrderMutation.mutate(orderData);
  };

  // Filtrage des produits en fonction de la recherche et de la catégorie active
  const filteredProducts = (Array.isArray(products) ? products : []).filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeTab === 0 || // Tous les produits
      (activeTab === 1 && product.category === 'Alimentation') ||
      (activeTab === 2 && product.category === 'Boissons') ||
      (activeTab === 3 && product.category === 'Produits Frais');
    
    // Gérer les produits saisonniers et promotions
    const isSeasonal = product.isSeasonal && 
      new Date(product.seasonStart) <= new Date() &&
      new Date(product.seasonEnd) >= new Date();
    
    const isOnPromotion = product.hasPromotion && 
      new Date(product.promotionStart) <= new Date() &&
      new Date(product.promotionEnd) >= new Date();
    
    return matchesSearch && matchesCategory && (!product.isSeasonal || isSeasonal) && (!product.hasPromotion || isOnPromotion);
  });

  // Calcul sécurisé du total
  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    setOrderTotal(subtotal + deliveryFee);
    return subtotal + deliveryFee;
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
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

          {/* Section Carte de Fidélité */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Carte de Fidélité
            </Typography>
            
            {loyaltyCardLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress />
              </Box>
            ) : loyaltyCard ? (
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

          {/* Dialogue de réduction des points */}
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
                  InputProps={{
                    endAdornment: <Typography>/{loyaltyCard?.points || 0}</Typography>
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowRedeemDialog(false)}>Annuler</Button>
              <Button onClick={handleRedeemPoints} variant="contained" color="primary">
                Réduire
              </Button>
            </DialogActions>
          </Dialog>

          {/* Notification */}
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

          {/* Section Paiement */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Total à payer: {totalCartAmount} GNF
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => navigate('/checkout')}
              sx={{ mt: 2 }}
            >
              Passer à la caisse
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
            2023 App Superette - Tous droits réservés
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;