import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Tab,
    Tabs,
    Typography,
    useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import SeasonalProductService from '../../services/SeasonalProductService';

const SeasonalStats = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);
    const [salesData, setSalesData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [forecastData, setForecastData] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [sales, products, forecast] = await Promise.all([
                SeasonalProductService.getSeasonalSalesData(),
                SeasonalProductService.getTopSeasonalProducts(),
                SeasonalProductService.getSeasonalForecast()
            ]);

            setSalesData(sales);
            setTopProducts(products);
            setForecastData(forecast);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (value) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0
        }).format(value);
    };

    const renderSalesChart = () => (
        <Box sx={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                        formatter={(value) => formatPrice(value)}
                        labelStyle={{ color: theme.palette.text.primary }}
                    />
                    <Legend />
                    <Bar
                        dataKey="sales"
                        name="Ventes"
                        fill={theme.palette.primary.main}
                    />
                    <Bar
                        dataKey="target"
                        name="Objectif"
                        fill={theme.palette.secondary.main}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );

    const renderTopProducts = () => (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Meilleurs Produits
            </Typography>
            {topProducts.map((product) => (
                <Card key={product.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6">{product.name}</Typography>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: 2,
                                mt: 1
                            }}
                        >
                            <Typography>
                                Quantité vendue: {product.quantity.toLocaleString()}
                            </Typography>
                            <Typography>
                                Chiffre d'affaires: {formatPrice(product.revenue)}
                            </Typography>
                            <Typography>Marge: {product.margin}%</Typography>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );

    const renderForecastChart = () => (
        <Box sx={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                        formatter={(value) => formatPrice(value)}
                        labelStyle={{ color: theme.palette.text.primary }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="predicted"
                        name="Prévisions"
                        stroke={theme.palette.info.main}
                        strokeWidth={2}
                    />
                    <Line
                        type="monotone"
                        dataKey="actual"
                        name="Réel"
                        stroke={theme.palette.success.main}
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '400px'
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs
                value={selectedTab}
                onChange={(_, newValue) => setSelectedTab(newValue)}
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
            >
                <Tab label="Vue d'ensemble" />
                <Tab label="Meilleurs produits" />
                <Tab label="Prévisions" />
            </Tabs>

            {selectedTab === 0 && (
                <Box>
                    <Typography variant="h5" gutterBottom>
                        Performance des ventes
                    </Typography>
                    {renderSalesChart()}
                </Box>
            )}

            {selectedTab === 1 && renderTopProducts()}

            {selectedTab === 2 && (
                <Box>
                    <Typography variant="h5" gutterBottom>
                        Prévisions de ventes
                    </Typography>
                    {renderForecastChart()}
                </Box>
            )}
        </Box>
    );
};

export default SeasonalStats; 