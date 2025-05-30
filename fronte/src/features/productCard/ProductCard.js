import {
  AddShoppingCart as AddShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  Tooltip,
  Box,
  Rating
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';

function ProductCard({ product, onClick }) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    toggleFavorite(product.id);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          transition: 'transform 0.2s ease-in-out'
        }
      }}
      onClick={onClick}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.image || 'https://via.placeholder.com/200'}
          alt={product.name}
        />
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }
          }}
          onClick={handleToggleFavorite}
        >
          {isFavorite(product.id) ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {product.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
          <Rating value={product.rating} precision={0.5} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.reviews?.length || 0})
          </Typography>
        </Box>
        <Typography variant="h6" color="primary">
          {product.price.toFixed(2)} €
        </Typography>
        {product.stock <= 5 && product.stock > 0 && (
          <Typography variant="body2" color="error">
            Plus que {product.stock} en stock !
          </Typography>
        )}
        {product.stock === 0 && (
          <Typography variant="body2" color="error">
            Rupture de stock
          </Typography>
        )}
      </CardContent>

      <CardActions>
        <Tooltip title={!isAuthenticated() ? "Connectez-vous pour ajouter au panier" : ""}>
          <span style={{ width: '100%' }}>
            <Button
              size="small"
              color="primary"
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              fullWidth
            >
              {isAuthenticated() ? 'Ajouter au panier' : 'Se connecter pour acheter'}
            </Button>
          </span>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

export default ProductCard;
