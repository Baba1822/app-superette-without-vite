import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Badge, Button } from '@mui/material';
import { ShoppingCart, Search, AccountCircle, Menu } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';

const ShopNavigation = () => {
  const navigate = useNavigate();
  const { cartItems = [] } = useCart();
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <Menu />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Superette Express
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton color="inherit" onClick={() => navigate('/search')}>
            <Search />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('/cart')}>
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('/profile')}>
            <AccountCircle />
          </IconButton>
          <Button color="inherit" onClick={() => navigate('/checkout')}>
            Checkout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ShopNavigation;
