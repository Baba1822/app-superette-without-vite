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
  Snackbar,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment
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
  Close as CloseIcon,
  FilterList as FilterListIcon,
  FavoriteBorder as FavoriteBorderIcon
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
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    sort: 'default'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleAddToWishlist = (product) => {
    setWishlist(prev => [...prev, product]);
    showNotification('Produit ajouté à la liste de souhaits', 'success');
  };

  const handleRemoveFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
    showNotification('Produit retiré de la liste de souhaits', 'info');
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };


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

  const handleOrangeMoneyPayment = async () => {
    try {
      // Simulation de la vérification du numéro Orange Money
      const phoneNumber = prompt('Entrez votre numéro Orange Money:');
      if (!phoneNumber) {
        showNotification('Veuillez entrer un numéro de téléphone valide', 'error');
        return;
      }

      // Simulation de la vérification du solde
      const simulatedBalance = Math.floor(Math.random() * 1000000) + 100000; // Simule un solde entre 100 000 et 1 000 000 GNF
      if (simulatedBalance < totalCartAmount) {
        showNotification(`Solde insuffisant. Votre solde est de ${formatPrice(simulatedBalance)} GNF`, 'error');
        return;
      }

      // Simulation du paiement
      showNotification('Paiement en cours...', 'info');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simule un délai de traitement

      // Création de la commande
      const orderData = {
        items: cartItems,
        total: totalCartAmount,
        paymentMethod: 'orange_money',
        deliveryAddress,
        deliveryFee,
        customer: {
          phoneNumber
        }
      };

      await createOrderMutation.mutateAsync(orderData);
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      showNotification('Erreur lors du paiement', 'error');
    }
  };

  const handleSplitPayment = () => {
    // Simulation du paiement fractionné
    const installments = Math.floor((totalCartAmount / 400000) + 1); // Calcule le nombre de mensualités (environ 400 000 GNF par mensualité)
    const monthlyAmount = Math.ceil(totalCartAmount / installments);

    // Affiche les détails du paiement fractionné
    const confirmation = window.confirm(`Votre commande sera payée en ${installments} mensualités de ${formatPrice(monthlyAmount)} GNF.
    Total: ${formatPrice(totalCartAmount)} GNF
    Voulez-vous continuer avec le paiement fractionné ?`);

    if (confirmation) {
      // Simulation du traitement du paiement fractionné
      showNotification('Paiement fractionné en cours...', 'info');
      setTimeout(() => {
        // Création de la commande avec le mode de paiement fractionné
        const orderData = {
          items: cartItems,
          total: totalCartAmount,
          paymentMethod: 'split_payment',
          deliveryAddress,
          deliveryFee,
          installments: installments,
          monthlyAmount: monthlyAmount
        };

        createOrderMutation.mutate(orderData);
      }, 2000); // Simule un délai de traitement
    }
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LoyaltyIcon sx={{ color: 'white' }} />
              Boutique
            </Box>
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton color="inherit" onClick={() => setShowFilters(!showFilters)}>
              <FilterListIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleCartToggle}>
              <Badge badgeContent={cartItems.length} color="secondary">
                <CartIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate('/wishlist')}>
              <Badge badgeContent={wishlist.length} color="secondary">
                <FavoriteBorderIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={showFilters} onClose={() => setShowFilters(false)}>
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filtrer les produits
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Catégorie
          </Typography>
          <Select
            fullWidth
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="all">Toutes les catégories</MenuItem>
            <MenuItem value="fruits">Fruits</MenuItem>
            <MenuItem value="legumes">Légumes</MenuItem>
            <MenuItem value="boissons">Boissons</MenuItem>
          </Select>

          <Typography variant="subtitle1" gutterBottom>
            Prix
          </Typography>
          <RadioGroup
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            sx={{ mb: 2 }}
          >
            <FormControlLabel value="all" control={<Radio />} label="Tous les prix" />
            <FormControlLabel value="low" control={<Radio />} label="Moins de 50000 GNF" />
            <FormControlLabel value="medium" control={<Radio />} label="50000-100000 GNF" />
            <FormControlLabel value="high" control={<Radio />} label="Plus de 100000 GNF" />
          </RadioGroup>

          <Typography variant="subtitle1" gutterBottom>
            Trier par
          </Typography>
          <Select
            fullWidth
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          >
            <MenuItem value="default">Par défaut</MenuItem>
            <MenuItem value="price-asc">Prix croissant</MenuItem>
            <MenuItem value="price-desc">Prix décroissant</MenuItem>
            <MenuItem value="name-asc">Nom (A-Z)</MenuItem>
          </Select>
        </Box>
      </Drawer>

      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Rechercher des produits..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<FilterListIcon />}
                onClick={() => setShowFilters(true)}
              >
                Filtrer
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                Produits populaires
              </Typography>
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={4}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={3000}
              >
                {promotions.map((product) => (
                  <Box key={product.id} sx={{ p: 1 }}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.image || '/default-product.jpg'}
                        alt={product.nom}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {product.nom}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Chip
                            label={`${formatPrice(product.prix)}`}
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label={`-${product.discount}%`}
                            color="success"
                            size="small"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Slider>
            </Paper>
          </Grid>

          <Tabs value={activeTab} onChange={handleTabChange} aria-label="product categories">
            <Tab label="Tous" />
            <Tab label="Boissons" />
            <Tab label="Produits Laitiers" />
            <Tab label="Fruits et Légumes" />
          </Tabs>
        </Grid>

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
                            <Typography variant="body2" color="text.secondary">
                              Prix normal: {formatPrice(product.prix)}
                            </Typography>
                            <Typography variant="h6" color="primary">
                              Prix promo: {formatPrice(promoPrice)}
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