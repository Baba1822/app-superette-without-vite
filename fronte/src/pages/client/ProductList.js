import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  AppBar
} from '@mui/material';
import { Search as SearchIcon, Storefront as StorefrontIcon, ShoppingCart as CartIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import api from '../../config/api.config';
import ProductCard from '../../components/ProductCard';

const ProductList = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const itemsPerPage = 12;

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', page, category, sortBy, search],
    queryFn: async () => {
      const response = await api.get('/products', {
        params: {
          page,
          limit: itemsPerPage,
          category: category === 'all' ? undefined : category,
          sort: sortBy,
          search: search || undefined
        }
      });
      return response.data;
    }
  });

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', p: 1 }}>
          <StorefrontIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>App Superette</Typography>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography color="error" align="center" sx={{ mt: 4 }}>
            Une erreur est survenue lors du chargement des produits.
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', p: 1 }}>
        <StorefrontIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>App Superette</Typography>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Filtres et recherche */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Rechercher un produit..."
                value={search}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={category}
                  label="Catégorie"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="all">Toutes les catégories</MenuItem>
                  <MenuItem value="fruits">Fruits & Légumes</MenuItem>
                  <MenuItem value="dairy">Produits Laitiers</MenuItem>
                  <MenuItem value="meat">Viandes</MenuItem>
                  <MenuItem value="bakery">Boulangerie</MenuItem>
                  <MenuItem value="beverages">Boissons</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Trier par</InputLabel>
                <Select
                  value={sortBy}
                  label="Trier par"
                  onChange={handleSortChange}
                >
                  <MenuItem value="name">Nom</MenuItem>
                  <MenuItem value="price_asc">Prix croissant</MenuItem>
                  <MenuItem value="price_desc">Prix décroissant</MenuItem>
                  <MenuItem value="popularity">Popularité</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Affichage des filtres actifs */}
        {(search || category !== 'all') && (
          <Box sx={{ mb: 2 }}>
            {search && (
              <Chip
                label={`Recherche: ${search}`}
                onDelete={() => setSearch('')}
                sx={{ mr: 1, mb: 1 }}
              />
            )}
            {category !== 'all' && (
              <Chip
                label={`Catégorie: ${category}`}
                onDelete={() => setCategory('all')}
                sx={{ mr: 1, mb: 1 }}
              />
            )}
          </Box>
        )}

        {/* Liste des produits */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {data?.products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {data?.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={data.totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}

            {/* Message si aucun produit */}
            {data?.products.length === 0 && (
              <Typography align="center" sx={{ mt: 4 }}>
                Aucun produit ne correspond à votre recherche.
              </Typography>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default ProductList; 