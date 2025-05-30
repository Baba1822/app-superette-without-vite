import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Divider,
  AppBar
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Storefront as StorefrontIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', p: 1 }}>
        <StorefrontIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>App Superette</Typography>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <CartIcon sx={{ mr: 1 }} />
          Mon Panier
        </Typography>

        {cart.length === 0 ? (
          <Card sx={{ mt: 2 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Votre panier est vide
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/shop')}
                startIcon={<CartIcon />}
                sx={{ mt: 2 }}
              >
                Continuer mes achats
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {cart.map((item) => (
                <Card key={item.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <img
                          src={item.image || '/placeholder-product.jpg'}
                          alt={item.name}
                          style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography color="text.secondary">
                          {item.price.toLocaleString()} GNF
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <AddIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => removeFromCart(item.id)}
                            sx={{ ml: 2 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Résumé de la commande
                  </Typography>
                  <Box sx={{ my: 2 }}>
                    <Grid container justifyContent="space-between">
                      <Grid item>
                        <Typography>Sous-total</Typography>
                      </Grid>
                      <Grid item>
                        <Typography>{calculateTotal().toLocaleString()} GNF</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ my: 2 }}>
                    <Grid container justifyContent="space-between">
                      <Grid item>
                        <Typography variant="h6">Total</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" color="primary">
                          {calculateTotal().toLocaleString()} GNF
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleCheckout}
                    sx={{ mt: 2 }}
                  >
                    Passer la commande
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    onClick={clearCart}
                    sx={{ mt: 2 }}
                    color="error"
                  >
                    Vider le panier
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Cart; 