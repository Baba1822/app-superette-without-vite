import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    TextField,
    MenuItem,
    CircularProgress,
    Alert,
    Button,
    CardActions,
    IconButton,
    Chip,
    Container
} from '@mui/material';
import {
    Search as SearchIcon,
    ShoppingCart as CartIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Shop = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { value: 'all', label: 'Toutes les catégories' },
        { value: 'food', label: 'Alimentation' },
        { value: 'beverages', label: 'Boissons' },
        { value: 'household', label: 'Maison' },
        { value: 'hygiene', label: 'Hygiène' }
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Simuler un appel API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Données mockées
                const mockProducts = [
                    {
                        id: '1',
                        name: 'Riz local',
                        description: 'Riz local de haute qualité',
                        price: 50000,
                        category: 'food',
                        image: 'https://example.com/rice.jpg',
                        stock: 100,
                        discount: 10
                    },
                    {
                        id: '2',
                        name: 'Huile végétale',
                        description: 'Huile végétale pure',
                        price: 75000,
                        category: 'food',
                        image: 'https://example.com/oil.jpg',
                        stock: 50,
                        discount: 0
                    },
                    {
                        id: '3',
                        name: 'Savon',
                        description: 'Savon naturel',
                        price: 15000,
                        category: 'hygiene',
                        image: 'https://example.com/soap.jpg',
                        stock: 200,
                        discount: 5
                    }
                ];

                setProducts(mockProducts);
            } catch (err) {
                setError('Erreur lors du chargement des produits');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleViewDetails = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const filteredProducts = products
        .filter(product => {
            const matchesCategory = category === 'all' || product.category === category;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                product.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Notre Boutique
                </Typography>
                <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
                    Découvrez notre sélection de produits de qualité
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Filtres */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Rechercher un produit..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                fullWidth
                                label="Catégorie"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleLogin}
                            >
                                Se connecter
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Liste des produits */}
            <Grid container spacing={3}>
                {filteredProducts.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={product.image}
                                alt={product.name}
                                onError={(e) => {
                                    e.target.src = '/placeholder.jpg';
                                }}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {product.description}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="h6" color="primary">
                                        {product.price.toLocaleString()} GNF
                                    </Typography>
                                    {product.discount > 0 && (
                                        <Chip
                                            label={`-${product.discount}%`}
                                            color="error"
                                            size="small"
                                            sx={{ ml: 1 }}
                                        />
                                    )}
                                </Box>
                                <Chip
                                    label={categories.find(cat => cat.value === product.category)?.label}
                                    size="small"
                                />
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    startIcon={<VisibilityIcon />}
                                    onClick={() => handleViewDetails(product.id)}
                                >
                                    Détails
                                </Button>
                                <Button
                                    size="small"
                                    startIcon={<CartIcon />}
                                    onClick={handleLogin}
                                >
                                    Ajouter au panier
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Shop; 