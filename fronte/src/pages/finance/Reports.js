import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    CircularProgress,
    Alert,
    TextField,
    MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    FileDownload as ExportIcon,
    Print as PrintIcon
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
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const Reports = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reportType, setReportType] = useState('sales');
    const [period, setPeriod] = useState('month');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [data, setData] = useState({
        summary: {},
        charts: {}
    });

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                // Simuler un appel API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Données mockées
                const mockData = {
                    summary: {
                        totalSales: 15000000,
                        totalExpenses: 5000000,
                        netProfit: 10000000,
                        averageTicket: 75000
                    },
                    charts: {
                        salesTrend: [
                            { name: 'Jan', value: 1200000 },
                            { name: 'Fév', value: 1500000 },
                            { name: 'Mar', value: 1800000 }
                        ],
                        expensesByCategory: [
                            { name: 'Utilities', value: 1000000 },
                            { name: 'Rent', value: 2000000 },
                            { name: 'Salaries', value: 1500000 },
                            { name: 'Supplies', value: 500000 }
                        ],
                        salesByProduct: [
                            { name: 'Riz', value: 5000000 },
                            { name: 'Huile', value: 3000000 },
                            { name: 'Sucre', value: 2000000 },
                            { name: 'Autres', value: 5000000 }
                        ]
                    }
                };

                setData(mockData);
            } catch (err) {
                setError('Erreur lors du chargement des données');
            } finally {
                setLoading(false);
            }
        };

        fetchReportData();
    }, [reportType, period, startDate, endDate]);

    const handleExport = () => {
        // TODO: Implémenter l'export
        console.log('Export du rapport');
    };

    const handlePrint = () => {
        // TODO: Implémenter l'impression
        console.log('Impression du rapport');
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

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Rapports Financiers
            </Typography>

            {/* Filtres */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={2}>
                            <TextField
                                select
                                fullWidth
                                label="Type de rapport"
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                            >
                                <MenuItem value="sales">Ventes</MenuItem>
                                <MenuItem value="expenses">Dépenses</MenuItem>
                                <MenuItem value="profit">Bénéfices</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField
                                select
                                fullWidth
                                label="Période"
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                            >
                                <MenuItem value="day">Jour</MenuItem>
                                <MenuItem value="week">Semaine</MenuItem>
                                <MenuItem value="month">Mois</MenuItem>
                                <MenuItem value="year">Année</MenuItem>
                                <MenuItem value="custom">Personnalisé</MenuItem>
                            </TextField>
                        </Grid>
                        {period === 'custom' && (
                            <>
                                <Grid item xs={12} md={2}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Date début"
                                            value={startDate}
                                            onChange={setStartDate}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Date fin"
                                            value={endDate}
                                            onChange={setEndDate}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </>
                        )}
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

            {/* Résumé */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                                Ventes Totales
                            </Typography>
                            <Typography variant="h4">
                                {data.summary.totalSales.toLocaleString()} GNF
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                                Dépenses Totales
                            </Typography>
                            <Typography variant="h4">
                                {data.summary.totalExpenses.toLocaleString()} GNF
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                                Bénéfice Net
                            </Typography>
                            <Typography variant="h4">
                                {data.summary.netProfit.toLocaleString()} GNF
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                                Panier Moyen
                            </Typography>
                            <Typography variant="h4">
                                {data.summary.averageTicket.toLocaleString()} GNF
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Graphiques */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Évolution des Ventes
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.charts.salesTrend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="value" name="Ventes" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Répartition des Dépenses
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.charts.expensesByCategory}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            label
                                        >
                                            {data.charts.expensesByCategory.map((entry, index) => (
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
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Ventes par Produit
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.charts.salesByProduct}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" name="Ventes" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Reports; 