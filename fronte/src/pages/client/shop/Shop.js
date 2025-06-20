import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useProductContext } from '../../../context/ProductContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../../services/productService';
import { orderService } from '../../../services/orderService';
import { loyaltyService } from '../../../services/loyaltyService';
import { DeliveryService } from '../../../services/DeliveryService';
import { useAuth } from '../../../context/AuthContext';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Material-UI Components
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemText,
  List,
  Paper,
  Select,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  Chip,
  TableCell
} from '@mui/material';

// Material-UI Icons
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  AccountCircle as ProfileIcon,
  Loyalty as LoyaltyIcon,
  Payment as PaymentIcon,
  QrCode as QrIcon,
  Close as CloseIcon,
  FilterList as FilterListIcon,
  FavoriteBorder as FavoriteBorderIcon,
  PhoneAndroid as MobilePaymentIcon,
  LocationOn as LocationIcon,
  Notifications as NotificationsIcon,
  AddShoppingCart as AddShoppingCartIcon
} from '@mui/icons-material';

// Slider component
import Slider from 'react-slick';

// Configuration des quartiers de Conakry
const CONAKRY_QUARTERS = {
  'Kaloum': { baseFee: 5000 },
  'Dixinn': { baseFee: 7000 },
  'Ratoma': { baseFee: 8000 },
  'Matam': { baseFee: 7500 },
  'Matoto': { baseFee: 9000 }
};

// Utilité pour la simulation de scan
const scanLoyaltyCard = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('CARD123456');
    }, 1000);
  });
};

const Shop = () => {
  // Contextes et hooks
  const { cart = [], addToCart: addToCartAction, clearCart: clearCartAction } = useCart();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const productContext = useProductContext() || {};
  const { newProductAdded, stockUpdated, clearNewProduct, clearStockUpdate } = productContext;
  const { user } = useAuth();

  // États du composant
  const [cartOpen, setCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDistance, setDeliveryDistance] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderNote, setOrderNote] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  const [loyaltyCard, setLoyaltyCard] = useState(null);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [showCancelOrderDialog, setShowCancelOrderDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [deliveryName, setDeliveryName] = useState('');
  const [deliveryPhoneNumber, setDeliveryPhoneNumber] = useState('');

  // États des dialogues
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showClientOrdersDialog, setShowClientOrdersDialog] = useState(false);

  // Étapes Orange Money
  const [orangeMoneyPhone, setOrangeMoneyPhone] = useState('');

  // Fonction utilitaire pour le formatage des prix
  const formatPrice = (amount) => {
    return `${amount?.toLocaleString()} GNF`;
  };

  // Récupération des produits avec React Query
  const { 
    data: products = [], 
    isLoading, 
    error: productsError 
  } = useQuery({
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

  // Récupération des commandes du client
  const { 
    data: clientOrders = [], 
    isLoading: clientOrdersLoading, 
    refetch: refetchClientOrders 
  } = useQuery({
    queryKey: ['clientOrders'],
    queryFn: orderService.getOrders,
    onError: (error) => {
      console.error('Erreur lors de la récupération des commandes du client:', error);
      showNotification('Erreur lors du chargement de vos commandes', 'error');
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation pour annuler une commande
  const cancelOrderMutation = useMutation({
    mutationFn: (orderId) => orderService.updateOrderStatus(orderId, 'cancelled'),
    onSuccess: () => {
      showNotification('Commande annulée avec succès !', 'success');
      refetchClientOrders(); // Recharger les commandes après annulation
      setOrderToCancel(null);
      setShowCancelOrderDialog(false);
    },
    onError: (error) => {
      console.error('Erreur lors de l\'annulation de la commande:', error);
      showNotification('Erreur lors de l\'annulation de la commande', 'error');
    },
  });

  // Gestion des promotions
  const { 
    data: promotions = [], 
    isLoading: promotionsLoading, 
    error: promotionsError 
  } = useQuery({
    queryKey: ['promotions'],
    queryFn: productService.getPromotionalProducts,
    retry: 2,
    staleTime: 1000 * 60 * 10,
    onError: (error) => {
      console.error('Erreur lors de la récupération des promotions:', error);
    }
  });

  // Gestion des catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Filtrage des produits
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    let filtered = [...products];
    
    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product?.categorie === selectedCategory);
    }
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product?.nom?.toLowerCase().includes(term) ||
        product?.description?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [products, selectedCategory, searchTerm]);

  // Items du panier avec vérification de sécurité
  const cartItems = useMemo(() => {
    if (!Array.isArray(cart)) return [];
    
    return cart.map(item => ({
      id: item?.id || 0,
      name: item?.name || item?.nom || 'Produit sans nom',
      price: item?.price || item?.prix || 0,
      quantity: item?.quantity || 1,
      stock: item?.stock || 0
    }));
  }, [cart]);

  // Fonctions de gestion du panier
  const addToCart = (product) => {
    if (!product || !addToCartAction) return;
    
    if (product.stock <= 0) {
      showNotification('Ce produit est en rupture de stock', 'error');
      return;
    }
    
    addToCartAction({
      id: product.id,
      name: product.nom,
      price: product.prix,
      quantity: 1,
      stock: product.stock
    });
    showNotification('Produit ajouté au panier', 'success');
  };

  const clearCart = () => {
    if (clearCartAction) {
      clearCartAction();
      showNotification('Panier vidé', 'info');
    }
  };

  // Fonctions de gestion des livraisons
  const calculateDeliveryFee = (quarter, distance = 0) => {
    const baseFee = CONAKRY_QUARTERS[quarter]?.baseFee || 5000;
    return baseFee + (distance * 1000);
  };

  const handleDeliveryRequest = async () => {
    try {
      const deliveryData = {
        orderId: selectedOrder?.id,
        deliveryAddress,
        quarter: selectedQuarter,
        deliveryFee,
        status: 'pending'
      };

      await DeliveryService.createDelivery(deliveryData);
      showNotification('Demande de livraison envoyée avec succès !', 'success');
      setShowDeliveryDialog(false);
    } catch (error) {
      showNotification('Erreur lors de la demande de livraison', 'error');
    }
  };

  // Fonctions de gestion des commandes
  const calculateTotalAmount = () => {
    if (!Array.isArray(cart)) return 0; // Return 0 if cart is not an array
    
    const cartTotal = cart.reduce((sum, item) => {
      const price = item?.price || item?.prix || 0;
      const quantity = item?.quantity || 1;
      return sum + (price * quantity);
    }, 0);
    return cartTotal; // Only return cart total, delivery fee will be added at order creation
  };

  const createOrderMutation = useMutation({
    mutationFn: (orderData) => orderService.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['products']);
      showNotification('Commande créée avec succès', 'success');
    },
    onError: (error) => {
      showNotification('Erreur lors de la création de la commande', 'error');
    }
  });

  const createOrder = async () => {
    if (!user || !user.id) {
      showNotification('Veuillez vous connecter pour passer une commande.', 'error');
      return;
    }

    if (cart.length === 0) {
      showNotification('Votre panier est vide.', 'warning');
      return;
    }

    if (paymentMethod === 'delivery' && !selectedQuarter) {
      showNotification('Veuillez sélectionner un quartier pour la livraison.', 'warning');
      return;
    }

    setCreatingOrder(true);
    try {
      const orderData = {
        clientId: user.id,
        products: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: orderTotal,
        paymentMethod: paymentMethod,
        status: 'pending',
        deliveryAddress: deliveryAddress,
        deliveryFee: deliveryFee,
        note: orderNote,
        deliveryQuarter: selectedQuarter,
        phoneNumber: user.phone || '',
        deliveryName,
        deliveryPhoneNumber,
      };

      if (paymentMethod === 'delivery') {
        orderData.deliveryName = deliveryName;
        orderData.deliveryPhoneNumber = deliveryPhoneNumber;
      }

      const newOrder = await orderService.createOrder(orderData);
      queryClient.invalidateQueries(['orders', 'clientOrders']);
      await queryClient.invalidateQueries(['products']);
      showNotification('Commande passée avec succès !', 'success');

      refetchClientOrders().then(async ({ data: updatedOrders }) => {
        const totalOrders = updatedOrders.length;
        if (totalOrders >= 30) {
          try {
            const existingCard = await loyaltyService.getLoyaltyCard(user.id);
            if (!existingCard || Object.keys(existingCard).length === 0) {
              await loyaltyService.createLoyaltyCard(user.id);
              showNotification('Félicitations ! Votre carte de fidélité a été créée.', 'success');
            }
          } catch (loyaltyError) {
            console.error('Erreur lors de la gestion de la carte de fidélité:', loyaltyError);
            showNotification('Erreur lors de la création de la carte de fidélité.', 'error');
          }
        }
      });

      clearCartAction();
      handleCloseOrderDialog();
      await queryClient.invalidateQueries(['products']);
      showNotification('Stock mis à jour après la commande.', 'info');
      navigate('/client/orders');
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      showNotification(error.message || 'Erreur lors de la création de la commande', 'error');
    } finally {
      setCreatingOrder(false);
    }
  };

  // Fonctions de gestion des notifications
  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Fonctions de gestion des événements
  const handleCartClose = () => {
    setCartOpen(false);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const setSearchQuery = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOrangeMoneyPayment = async () => {
    try {
      const phoneNumber = prompt('Entrez votre numéro Orange Money:');
      if (!phoneNumber) {
        showNotification('Veuillez entrer un numéro de téléphone valide', 'error');
        return false;
      }

      const simulatedBalance = Math.floor(Math.random() * 1000000) + 100000;
      const amount = calculateTotalAmount();
      if (simulatedBalance < amount) {
        showNotification(`Solde insuffisant. Votre solde est de ${formatPrice(simulatedBalance)} GNF`, 'error');
        return false;
      }

      showNotification('Paiement en cours...', 'info');
      await new Promise(resolve => setTimeout(resolve, 2000));
      showNotification('Paiement effectué avec succès', 'success');
      return true;
    } catch (error) {
      showNotification('Erreur lors du paiement', 'error');
      return false;
    }
  };

  // Gestion des produits filtrés avec vérification de données
  const productsData = Array.isArray(products) ? products : [];
  const promotionsData = Array.isArray(promotions) ? promotions : [];

  // Gestion de la pagination
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  // Gestion des promotions
  const promotionalProducts = promotionsData.filter(promo => promo?.promotion > 0);

  // Calculs
  const totalCartAmount = Array.isArray(cart) ? cart.reduce((total, item) => {
    const itemPrice = item?.price || item?.prix || 0;
    const itemQuantity = item?.quantity || 0;
    return total + (itemPrice * itemQuantity);
  }, 0) : 0;

  // Gestion des fonctions de commande
  const handleAddToCart = async (product) => {
    if (!product || !product.id || !product.nom || product.prix === undefined) {
      showNotification('Erreur: Produit invalide', 'error');
      return;
    }
    
    if (product.stock <= 0) {
      showNotification('Ce produit est en rupture de stock', 'error');
      return;
    }

    // Vérifier si le produit est déjà dans le panier
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      // Vérifier si on peut augmenter la quantité
      if (existingItem.quantity >= product.stock) {
        showNotification(`Stock maximum atteint pour ${product.nom}`, 'warning');
        return;
      }
    }

    addToCartAction({ 
      id: product.id,
      name: product.nom,
      price: product.prix,
      quantity: existingItem ? existingItem.quantity + 1 : 1,
      stock: product.stock
    });
    
    showNotification(`${product.nom} ajouté au panier`, 'success');
  };

  const handleConfirmDelivery = () => {
    if (!selectedQuarter || !deliveryAddress) {
      showNotification('Veuillez remplir tous les champs de livraison', 'error');
      return;
    }
    
    const calculatedFee = calculateDeliveryFee(selectedQuarter, deliveryDistance);
    setDeliveryFee(calculatedFee);
    setOrderTotal(calculateTotalAmount() + calculatedFee);
    setShowDeliveryDialog(false);
    setShowPaymentDialog(true);
  };

  const handleConfirmPayment = async () => {
    try {
      if (!paymentMethod) {
        showNotification('Veuillez sélectionner une méthode de paiement', 'error');
        return;
      }

      if (!Array.isArray(cart) || cart.length === 0) {
        showNotification('Le panier est vide', 'error');
        return;
      }

      const orderItems = cart.map(item => ({
        productId: item?.id || 0,
        quantity: item?.quantity || 1,
        price: item?.price || item?.prix || 0
      }));

      const orderData = {
        deliveryAddress,
        deliveryDistance,
        deliveryFee,
        paymentMethod,
        totalAmount: orderTotal,
        status: 'pending',
        items: orderItems,
        deliveryQuarter: selectedQuarter,
        phoneNumber: localStorage.getItem('userPhone'),
        deliveryName,
        deliveryPhoneNumber,
      };

      createOrderMutation.mutate(orderData);
      setShowPaymentDialog(false);
      setShowOrderDialog(true);
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      showNotification('Erreur lors de la confirmation du paiement', 'error');
    }
  };

  // Effets
  useEffect(() => {
    const loadLoyaltyCard = async () => {
      try {
        const customerId = localStorage.getItem('userId');
        if (customerId) {
          const card = await loyaltyService.getLoyaltyCard(customerId);
          setLoyaltyCard(card);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la carte de fidélité:', error);
      }
    };
    loadLoyaltyCard();
  }, []);

  useEffect(() => {
    if (newProductAdded && clearNewProduct) {
      showNotification(`Nouveau produit disponible: ${newProductAdded.nom}`, 'success');
      clearNewProduct();
    }
  }, [newProductAdded, clearNewProduct]);

  useEffect(() => {
    if (stockUpdated && clearStockUpdate && Array.isArray(cart)) {
      const cartItem = cart.find(item => item?.id === stockUpdated.id);
      if (cartItem && cartItem.quantity > stockUpdated.stock) {
        showNotification(`Stock mis à jour pour ${stockUpdated.nom}. Nouveau stock: ${stockUpdated.stock}`, 'warning');
      }
      clearStockUpdate();
    }
  }, [stockUpdated, clearStockUpdate, cart]);

  const handleCloseOrderDialog = () => {
    setShowOrderDialog(false);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Barre de recherche */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Rechercher des produits..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={setSearchQuery}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Catégories */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Catégories</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Catégories"
          >
            <MenuItem value="all">Toutes les catégories</MenuItem>
            {Array.isArray(categories) && categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Button
        variant="outlined"
        color="info"
        startIcon={<NotificationsIcon />}
        onClick={() => setShowClientOrdersDialog(true)}
        sx={{ mb: 3 }}
      >
        Mes Commandes
      </Button>

      {/* Liste des produits */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : productsError ? (
        <Alert severity="error">Erreur lors du chargement des produits</Alert>
      ) : !Array.isArray(filteredProducts) || filteredProducts.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Aucun produit trouvé
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item key={product?.id || Math.random()} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  sx={{
                    height: 180,
                    width: '100%',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                  image={
                    product?.image_url 
                      ? product.image_url.startsWith('http') 
                        ? product.image_url 
                        : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${product.image_url}`
                      : '/placeholder-image.jpg'
                  }
                  alt={product?.nom || 'Produit'}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {product?.nom || 'Produit sans nom'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {product?.description || 'Aucune description disponible'}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {formatPrice(product?.prix)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Stock: {product?.stock || 0}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddToCart(product)}
                    startIcon={<AddShoppingCartIcon />}
                    disabled={!product?.id || !product?.nom || product?.prix === undefined || product?.stock <= 0}
                    fullWidth
                  >
                    Ajouter au panier
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Panier */}
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      >
        <Box sx={{ width: 400, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Panier ({Array.isArray(cart) ? cart.length : 0})
          </Typography>
          <Divider sx={{ my: 2 }} />
          {Array.isArray(cart) && cart.length > 0 ? (
            cart.map((item, index) => (
              <ListItem key={item?.id || index}>
                <ListItemText
                  primary={item?.name || item?.nom || 'Produit'}
                  secondary={`${item?.quantity || 1} x ${formatPrice(item?.price || item?.prix)}`}
                />
                <Typography variant="body1" color="primary">
                  {formatPrice((item?.price || item?.prix || 0) * (item?.quantity || 1))}
                </Typography>
              </ListItem>
            ))
          ) : (
            <Typography variant="body1" align="center" sx={{ my: 4 }}>
              Votre panier est vide
            </Typography>
          )}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Total
            </Typography>
            <Typography variant="h6" color="primary">
              {formatPrice(totalCartAmount)}
            </Typography>
          </Box>
          {Array.isArray(cart) && cart.length > 0 && (
            <>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => setShowDeliveryDialog(true)}
                sx={{ mt: 2 }}
              >
                Passer la commande
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={clearCart}
                sx={{ mt: 1 }}
              >
                Vider le panier
              </Button>
            </>
          )}
        </Box>
      </Drawer>

      {/* Dialog de livraison */}
      <Dialog open={showDeliveryDialog} onClose={() => setShowDeliveryDialog(false)}>
        <DialogTitle>Informations de livraison</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adresse de livraison"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Quartier"
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Distance (km)"
                  type="number"
                  value={deliveryDistance}
                  onChange={(e) => setDeliveryDistance(Number(e.target.value) || 0)}
                  margin="normal"
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom"
                  value={deliveryName}
                  onChange={(e) => setDeliveryName(e.target.value)}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  value={deliveryPhoneNumber}
                  onChange={(e) => setDeliveryPhoneNumber(e.target.value)}
                  margin="normal"
                  required
                />
              </Grid>
              {selectedQuarter && (
                <Grid item xs={12}>
                  <Typography color="primary" sx={{ mt: 2 }}>
                    Frais de livraison: {formatPrice(calculateDeliveryFee(selectedQuarter, deliveryDistance))}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeliveryDialog(false)}>Annuler</Button>
          <Button onClick={handleConfirmDelivery} color="primary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de paiement */}
      <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)}>
        <DialogTitle>Méthode de paiement</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel
                value="cash"
                control={<Radio />}
                label="Paiement à la livraison"
              />
              <FormControlLabel
                value="orange_money"
                control={<Radio />}
                label="Orange Money"
              />
            </RadioGroup>
          </FormControl>
          {/* Étapes Orange Money */}
          {paymentMethod === 'orange_money' && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Numéro Orange Money"
                value={orangeMoneyPhone}
                onChange={e => setOrangeMoneyPhone(e.target.value)}
                margin="normal"
                required
              />
              <Button
                variant="contained"
                color="warning"
                fullWidth
                sx={{ mt: 2 }}
                onClick={async () => {
                  if (!orangeMoneyPhone) {
                    showNotification('Veuillez saisir le numéro Orange Money', 'error');
                    return;
                  }
                  showNotification('Paiement en cours...', 'info');
                  // Simulation du paiement
                  await new Promise(res => setTimeout(res, 2000));
                  showNotification('Paiement Orange Money réussi !', 'success');
                  setShowPaymentDialog(false);
                  setShowOrderDialog(true);
                }}
              >
                Payer avec Orange Money
              </Button>
            </Box>
          )}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              Sous-total: {formatPrice(totalCartAmount)}
            </Typography>
            <Typography variant="body1">
              Frais de livraison: {formatPrice(deliveryFee)}
            </Typography>
            <Typography variant="h6" color="primary">
              Total: {formatPrice(totalCartAmount + deliveryFee)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPaymentDialog(false)}>Annuler</Button>
          <Button onClick={handleConfirmPayment} color="primary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation de commande */}
      <Dialog open={showOrderDialog} onClose={() => setShowOrderDialog(false)}>
        <DialogTitle>Commande Passée !</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Votre commande a été passée avec succès. Nous vous notifierons de son statut.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowOrderDialog(false);
            navigate('/mes-commandes'); // Correction de la route de navigation
          }} variant="contained">Voir mes commandes</Button>
          <Button onClick={() => setShowOrderDialog(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation d'annulation de commande */}
      <Dialog
        open={showCancelOrderDialog}
        onClose={() => setShowCancelOrderDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Annuler la commande ?"}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Êtes-vous sûr de vouloir annuler la commande #{orderToCancel?.id} ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelOrderDialog(false)}>Non</Button>
          <Button onClick={() => {
            if (orderToCancel) {
              cancelOrderMutation.mutate(orderToCancel.id);
            }
          }} autoFocus>Oui, Annuler</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog des commandes du client */}
      <Dialog
        open={showClientOrdersDialog}
        onClose={() => setShowClientOrdersDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Mes Commandes</DialogTitle>
        <DialogContent dividers>
          {clientOrdersLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : Array.isArray(clientOrders) && clientOrders.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>N° Commande</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clientOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell align="right">{formatPrice(order.total)}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={order.status === 'pending' ? 'warning' : order.status === 'cancelled' ? 'error' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {order.status === 'pending' && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => {
                              setOrderToCancel(order);
                              setShowCancelOrderDialog(true);
                            }}
                          >
                            Annuler
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center" sx={{ py: 4 }}>
              Vous n'avez pas encore de commandes.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClientOrdersDialog(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({...notification, open: false})}
      >
        <Alert
          severity={notification.severity}
          onClose={() => setNotification({...notification, open: false})}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Bouton panier */}
      <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CartIcon />}
          onClick={() => setCartOpen(true)}
        >
          Panier ({Array.isArray(cart) ? cart.length : 0})
        </Button>
      </Box>
    </Box>
  );
};

export default Shop;