import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    TextField,
    CircularProgress,
    Alert
} from '@mui/material';
import { ShoppingCart as CartIcon } from '@mui/icons-material';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simuler un appel API
        const fetchProduct = async () => {
            try {
                // Simule un délai réseau
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Données mockées
                const mockProduct = {
                    id: id,
                    name: 'Riz local',
                    price: 50000,
                    description: 'Riz local de haute qualité',
                    stock: 100,
                    category: 'Alimentation',
                    image: 'https://example.com/rice.jpg'
                };

                setProduct(mockProduct);
            } catch (err) {
                setError('Erreur lors du chargement du produit');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value);
        if (value > 0 && value <= product?.stock) {
            setQuantity(value);
        }
    };

    const handleAddToCart = () => {
        // TODO: Implémenter l'ajout au panier
        console.log('Ajout au panier:', { product, quantity });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!product) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="info">Produit non trouvé</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <img
                                src={product.image}
                                alt={product.name}
                                style={{ width: '100%', height: 'auto' }}
                                onError={(e) => {
                                    e.target.src = '/placeholder.jpg';
                                }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                {product.name}
                            </Typography>
                            <Typography variant="h5" color="primary" gutterBottom>
                                {product.price.toLocaleString()} GNF
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {product.description}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Catégorie: {product.category}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Stock disponible: {product.stock}
                            </Typography>
                            <Box sx={{ mt: 3 }}>
                                <TextField
                                    type="number"
                                    label="Quantité"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    inputProps={{ min: 1, max: product.stock }}
                                    sx={{ width: 100, mr: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    startIcon={<CartIcon />}
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                >
                                    Ajouter au panier
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProductDetails; 