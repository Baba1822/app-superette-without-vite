import {
  AddShoppingCart as AddShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Rating,
  Typography,
  useTheme
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import ProductCard from '../productCard/ProductCard';

function ProductDetail({ product, similarProducts = [], onClose }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleAddToCart = () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    toggleFavorite(product.id);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={4}>
          {/* Image du produit */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="400"
                image={product.image || 'https://via.placeholder.com/400'}
                alt={product.name}
                sx={{ objectFit: 'contain' }}
              />
            </Card>
          </Grid>

          {/* Détails du produit */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>
              <IconButton onClick={handleToggleFavorite} color="primary">
                {isFavorite(product.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>

            <Typography variant="h5" color="primary" gutterBottom>
              {product.price.toFixed(2)} €
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({product.reviews?.length || 0} avis)
              </Typography>
            </Box>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error.main'}>
                {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              fullWidth
            >
              Ajouter au panier
            </Button>
          </Grid>
        </Grid>

        {/* Section des avis */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Avis clients
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {product.reviews?.length > 0 ? (
            product.reviews.map((review) => (
              <Paper key={review.id} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={review.rating} size="small" readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    par {review.userName}
                  </Typography>
                </Box>
                <Typography variant="body1">{review.comment}</Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Aucun avis pour ce produit
            </Typography>
          )}
        </Box>

        {/* Produits similaires */}
        {similarProducts.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Produits similaires
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
              {similarProducts.slice(0, 4).map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default ProductDetail; 