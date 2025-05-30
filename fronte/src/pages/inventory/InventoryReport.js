import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Grid,
    TextField,
    MenuItem,
    CircularProgress,
    Alert,
    Chip
} from '@mui/material';
import {
    FileDownload as ExportIcon,
    Print as PrintIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const InventoryReport = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [data, setData] = useState({
        summary: {},
        products: [],
        charts: {}
    });

    const categories = [
        { value: 'all', label: 'Toutes les catégories' },
        { value: 'food', label: 'Alimentation' },
        { value: 'beverages', label: 'Boissons' },
        { value: 'household', label: 'Maison' },
        { value: 'hygiene', label: 'Hygiène' }
    ];

    const sortOptions = [
        { value: 'name', label: 'Nom' },
        { value: 'stock', label: 'Stock' },
        { value: 'value', label: 'Valeur' }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                // Simuler un appel API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Données mockées
                const mockData = {
                    summary: {
                        totalProducts: 150,
                        totalValue: 25000000,
                        lowStock: 15,
                        outOfStock: 5
                    },
                    products: [
                        {
                            id: '1',
                            name: 'Riz local',
                            category: 'food',
                            stock: 100,
                            minStock: 20,
                            value: 5000000,
                            lastUpdated: '2024-03-10'
                        },
                        {
                            id: '2',
                            name: 'Huile végétale',
                            category: 'food',
                            stock: 50,
                            minStock: 30,
                            value: 2500000,
                            lastUpdated: '2024-03-09'
                        },
                        {
                            id: '3',
                            name: 'Savon',
                            category: 'hygiene',
                            stock: 10,
                            minStock: 15,
                            value: 500000,
                            lastUpdated: '2024-03-08'
                        }
                    ],
                    charts: {
                        stockByCategory: [
                            { name: 'Alimentation', value: 150 },
                            { name: 'Boissons', value: 80 },
                            { name: 'Maison', value: 45 },
                            { name: 'Hygiène', value: 35 }
                        ],
                        valueByCategory: [
                            { name: 'Alimentation', value: 15000000 },
                            { name: 'Boissons', value: 5000000 },
                            { name: 'Maison', value: 3000000 },
                            { name: 'Hygiène', value: 2000000 }
                        ]
                    }
                };

                setData(mockData);
            } catch (err) {
                setError('Erreur lors du chargement des données d\'inventaire');
            } finally {
                setLoading(false);
            }
        };

        fetchInventoryData();
    }, []);

    const handleExport = () => {
        // TODO: Implémenter l'export
        console.log('Export du rapport d\'inventaire');
    };

    const handlePrint = () => {
        // TODO: Implémenter l'impression
        console.log('Impression du rapport d\'inventaire');
    };

    const getStockStatus = (product) => {
        if (product.stock === 0) {
            return { label: 'Rupture', color: 'error' };
        }
        if (product.stock <= product.minStock) {
            return { label: 'Stock bas', color: 'warning' };
        }
        return { label: 'En stock', color: 'success' };
    };

    const filteredProducts = data.products
        .filter(product => category === 'all' || product.category === category)
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'stock':
                    return b.stock - a.stock;
                case 'value':
                    return b.value - a.value;
                default:
                    return 0;
            }
        });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Rapport d'Inventaire
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Résumé */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                                Total Produits
                            </Typography>
                            <Typography variant="h4">
                                {data.summary.totalProducts}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                                Valeur Totale
                            </Typography>
                            <Typography variant="h4">
                                {data.summary.totalValue.toLocaleString()} GNF
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                                Stock Bas
                            </Typography>
                            <Typography variant="h4" color="warning.main">
                                {data.summary.lowStock}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                                Rupture de Stock
                            </Typography>
                            <Typography variant="h4" color="error.main">
                                {data.summary.outOfStock}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filtres et actions */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
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
                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                fullWidth
                                label="Trier par"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                {sortOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                variant="contained"
                                startIcon={<ExportIcon />}
                                onClick={handleExport}
                                fullWidth
                            >
                                Exporter
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                variant="outlined"
                                startIcon={<PrintIcon />}
                                onClick={handlePrint}
                                fullWidth
                            >
                                Imprimer
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Graphiques */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Stock par Catégorie
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.charts.stockByCategory}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" name="Quantité" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Valeur par Catégorie
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.charts.valueByCategory}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            label
                                        >
                                            {data.charts.valueByCategory.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Liste des produits */}
            <Card>
                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Produit</TableCell>
                                    <TableCell>Catégorie</TableCell>
                                    <TableCell align="right">Stock</TableCell>
                                    <TableCell align="right">Stock Min</TableCell>
                                    <TableCell align="right">Valeur</TableCell>
                                    <TableCell>Statut</TableCell>
                                    <TableCell>Dernière MAJ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredProducts.map((product) => {
                                    const status = getStockStatus(product);
                                    return (
                                        <TableRow key={product.id}>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>
                                                {categories.find(cat => cat.value === product.category)?.label}
                                            </TableCell>
                                            <TableCell align="right">{product.stock}</TableCell>
                                            <TableCell align="right">{product.minStock}</TableCell>
                                            <TableCell align="right">
                                                {product.value.toLocaleString()} GNF
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={status.label}
                                                    color={status.color}
                                                    size="small"
                                                    icon={status.color !== 'success' ? <WarningIcon /> : undefined}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {new Date(product.lastUpdated).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
};

export default InventoryReport; 