import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Box,
  Chip,
  Rating,
  Tooltip,
  TextField
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter pour ajouter des produits au panier');
      navigate('/login');
      return;
    }

    // Logique d'ajout au panier à implémenter
    toast.success(`${quantity} ${product.name} ajouté(s) au panier`);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      {product.discount > 0 && (
        <Chip
          label={`-${product.discount}%`}
          color="secondary"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1
          }}
        />
      )}

      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {product.name}
        </Typography>
        
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            component="span"
          >
            {product.category}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating
            value={product.rating}
            precision={0.5}
            readOnly
            size="small"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.reviews} avis)
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
          {product.discount > 0 ? (
            <>
              <Typography
                variant="h6"
                color="error"
                sx={{ fontWeight: 'bold', mr: 1 }}
              >
                {((product.price * (100 - product.discount)) / 100).toFixed(2)}€
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                {product.price.toFixed(2)}€
              </Typography>
            </>
          ) : (
            <Typography variant="h6" color="primary" gutterBottom>
              {product.price.toLocaleString()} GNF
            </Typography>
          )}
        </Box>

        <Tooltip title={`${product.stock} en stock`}>
          <Typography variant="body2" color="text.secondary">
            {product.stock > 0 ? 'En stock' : 'Rupture de stock'}
          </Typography>
        </Tooltip>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <IconButton
              size="small"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
            >
              <RemoveIcon />
            </IconButton>
            <TextField
              size="small"
              value={quantity}
              onChange={handleQuantityChange}
              type="number"
              inputProps={{
                min: 1,
                max: product.stock,
                style: { textAlign: 'center', width: '40px' }
              }}
              sx={{ mx: 1 }}
            />
            <IconButton
              size="small"
              onClick={increaseQuantity}
              disabled={quantity >= product.stock}
            >
              <AddIcon />
            </IconButton>
          </Box>
          <Button
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            fullWidth
          >
            Ajouter
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default ProductCard;