import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
    BarChart as BarChartIcon,
    Download as DownloadIcon,
    PieChart as PieChartIcon,
    Print as PrintIcon,
    Timeline as TimelineIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Mock data for demonstration
const salesData = [
    { date: '2024-01', amount: 2500000 },
    { date: '2024-02', amount: 2800000 },
    { date: '2024-03', amount: 3200000 },
    { date: '2024-04', amount: 3000000 },
    { date: '2024-05', amount: 3500000 },
    { date: '2024-06', amount: 3800000 },
];

const categoryData = [
    { name: 'Alimentation', value: 40 },
    { name: 'Boissons', value: 25 },
    { name: 'Hygiène', value: 15 },
    { name: 'Divers', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const dailySales = [
    { day: 'Lundi', amount: 450000 },
    { day: 'Mardi', amount: 520000 },
    { day: 'Mercredi', amount: 480000 },
    { day: 'Jeudi', amount: 550000 },
    { day: 'Vendredi', amount: 600000 },
    { day: 'Samedi', amount: 700000 },
    { day: 'Dimanche', amount: 400000 },
];

// Mock data for profit margins
const profitData = [
    { date: '2024-01', revenue: 2500000, cost: 1750000, profit: 750000 },
    { date: '2024-02', revenue: 2800000, cost: 1960000, profit: 840000 },
    { date: '2024-03', revenue: 3200000, cost: 2240000, profit: 960000 },
    { date: '2024-04', revenue: 3000000, cost: 2100000, profit: 900000 },
    { date: '2024-05', revenue: 3500000, cost: 2450000, profit: 1050000 },
    { date: '2024-06', revenue: 3800000, cost: 2660000, profit: 1140000 },
];

// Mock data for seasonal analysis
const seasonalData = [
    { year: '2023', Q1: 7500000, Q2: 8500000, Q3: 9000000, Q4: 11000000 },
    { year: '2024', Q1: 8500000, Q2: 9500000, Q3: null, Q4: null },
];

// Mock data for sales forecast
const forecastData = [
    { date: '2024-07', actual: null, forecast: 4000000 },
    { date: '2024-08', actual: null, forecast: 4200000 },
    { date: '2024-09', actual: null, forecast: 4500000 },
    { date: '2024-10', actual: null, forecast: 4800000 },
    { date: '2024-11', actual: null, forecast: 5200000 },
    { date: '2024-12', actual: null, forecast: 6000000 },
];

// Mock data for product profitability
const productProfitability = [
    {
        id: 1,
        name: 'Riz local',
        category: 'Alimentation',
        revenue: 1200000,
        cost: 840000,
        profit: 360000,
        margin: 30,
        unitsSold: 2400,
        averagePrice: 500,
        averageCost: 350,
    },
    {
        id: 2,
        name: 'Huile végétale',
        category: 'Alimentation',
        revenue: 900000,
        cost: 630000,
        profit: 270000,
        margin: 30,
        unitsSold: 1800,
        averagePrice: 500,
        averageCost: 350,
    },
    {
        id: 3,
        name: 'Eau minérale',
        category: 'Boissons',
        revenue: 600000,
        cost: 360000,
        profit: 240000,
        margin: 40,
        unitsSold: 12000,
        averagePrice: 50,
        averageCost: 30,
    },
    {
        id: 4,
        name: 'Savon',
        category: 'Hygiène',
        revenue: 450000,
        cost: 270000,
        profit: 180000,
        margin: 40,
        unitsSold: 9000,
        averagePrice: 50,
        averageCost: 30,
    },
];

// Mock data for category profitability
const categoryProfitability = [
    {
        name: 'Alimentation',
        revenue: 2100000,
        cost: 1470000,
        profit: 630000,
        margin: 30,
        products: 15,
        topProduct: 'Riz local',
    },
    {
        name: 'Boissons',
        revenue: 1200000,
        cost: 720000,
        profit: 480000,
        margin: 40,
        products: 10,
        topProduct: 'Eau minérale',
    },
    {
        name: 'Hygiène',
        revenue: 900000,
        cost: 540000,
        profit: 360000,
        margin: 40,
        products: 8,
        topProduct: 'Savon',
    },
    {
        name: 'Divers',
        revenue: 600000,
        cost: 420000,
        profit: 180000,
        margin: 30,
        products: 12,
        topProduct: 'Produit A',
    },
];

function Reports() {
    const [tabValue, setTabValue] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reportType, setReportType] = useState('monthly');
    const [comparisonPeriod, setComparisonPeriod] = useState('previous_year');

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleReportTypeChange = (event) => {
        setReportType(event.target.value);
    };

    const handleComparisonChange = (event) => {
        setComparisonPeriod(event.target.value);
    };

    const handleExport = () => {
        // Implement export functionality
        console.log('Exporting report...');
    };

    const handlePrint = () => {
        // Implement print functionality
        window.print();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4">Rapports financiers</Typography>
                    <Box>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={handleExport}
                            sx={{ mr: 2 }}
                        >
                            Exporter
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<PrintIcon />}
                            onClick={handlePrint}
                        >
                            Imprimer
                        </Button>
                    </Box>
                </Box>

                {/* Filters */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Type de rapport</InputLabel>
                                <Select
                                    value={reportType}
                                    onChange={handleReportTypeChange}
                                    label="Type de rapport"
                                >
                                    <MenuItem value="daily">Journalier</MenuItem>
                                    <MenuItem value="weekly">Hebdomadaire</MenuItem>
                                    <MenuItem value="monthly">Mensuel</MenuItem>
                                    <MenuItem value="yearly">Annuel</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <DatePicker
                                label="Date de début"
                                value={startDate}
                                onChange={setStartDate}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <DatePicker
                                label="Date de fin"
                                value={endDate}
                                onChange={setEndDate}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* Additional Filters */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Comparaison</InputLabel>
                                <Select
                                    value={comparisonPeriod}
                                    onChange={handleComparisonChange}
                                    label="Comparaison"
                                >
                                    <MenuItem value="previous_month">Mois précédent</MenuItem>
                                    <MenuItem value="previous_year">Année précédente</MenuItem>
                                    <MenuItem value="same_period_last_year">Même période année dernière</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Chiffre d'affaires total
                                </Typography>
                                <Typography variant="h5">
                                    {salesData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()} GNF
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Ventes moyennes journalières
                                </Typography>
                                <Typography variant="h5">
                                    {(dailySales.reduce((sum, item) => sum + item.amount, 0) / 7).toLocaleString()} GNF
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Croissance mensuelle
                                </Typography>
                                <Typography variant="h5" color="success.main">
                                    +15%
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Marge bénéficiaire moyenne
                                </Typography>
                                <Typography variant="h5">
                                    {((profitData.reduce((sum, item) => sum + item.profit, 0) / 
                                    profitData.reduce((sum, item) => sum + item.revenue, 0)) * 100).toFixed(1)}%
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Variation saisonnière
                                </Typography>
                                <Typography variant="h5" color="success.main">
                                    +12%
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Prévision mensuelle
                                </Typography>
                                <Typography variant="h5">
                                    {forecastData[0].forecast.toLocaleString()} GNF
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Enhanced Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab icon={<TimelineIcon />} label="Évolution des ventes" />
                        <Tab icon={<BarChartIcon />} label="Ventes par catégorie" />
                        <Tab icon={<PieChartIcon />} label="Répartition des ventes" />
                        <Tab icon={<TimelineIcon />} label="Marge bénéficiaire" />
                        <Tab icon={<BarChartIcon />} label="Analyse saisonnière" />
                        <Tab icon={<TimelineIcon />} label="Prévisions" />
                        <Tab icon={<BarChartIcon />} label="Rentabilité produits" />
                    </Tabs>
                </Box>

                {/* Charts */}
                {tabValue === 0 && (
                    <Paper sx={{ p: 2, mb: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            Évolution des ventes
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value.toLocaleString()} GNF`, 'Montant']} />
                                <Legend />
                                <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Ventes" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                )}

                {tabValue === 1 && (
                    <Paper sx={{ p: 2, mb: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            Ventes par jour de la semaine
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailySales}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value.toLocaleString()} GNF`, 'Montant']} />
                                <Legend />
                                <Bar dataKey="amount" fill="#82ca9d" name="Ventes" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                )}

                {tabValue === 2 && (
                    <Paper sx={{ p: 2, mb: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            Répartition des ventes par catégorie
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                )}

                {tabValue === 3 && (
                    <Paper sx={{ p: 2, mb: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            Évolution des marges bénéficiaires
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={profitData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value.toLocaleString()} GNF`, 'Montant']} />
                                <Legend />
                                <Line type="monotone" dataKey="profit" stroke="#8884d8" name="Marge bénéficiaire" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                )}

                {tabValue === 4 && (
                    <Paper sx={{ p: 2, mb: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            Analyse saisonnière
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={seasonalData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value} GNF`, 'Montant']} />
                                <Legend />
                                <Bar dataKey="Q1" fill="#8884d8" name="Q1" />
                                <Bar dataKey="Q2" fill="#82ca9d" name="Q2" />
                                <Bar dataKey="Q3" fill="#ffd700" name="Q3" />
                                <Bar dataKey="Q4" fill="#ff8042" name="Q4" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                )}

                {tabValue === 5 && (
                    <Paper sx={{ p: 2, mb: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            Prévisions de ventes
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={forecastData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value.toLocaleString()} GNF`, 'Montant']} />
                                <Legend />
                                <Line type="monotone" dataKey="forecast" stroke="#8884d8" name="Prévision" />
                                <Line type="monotone" dataKey="actual" stroke="#82ca9d" name="Réel" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                )}

                {tabValue === 6 && (
                    <>
                        <Paper sx={{ p: 2, mb: 3, height: 400 }}>
                            <Typography variant="h6" gutterBottom>
                                Rentabilité par catégorie
                            </Typography>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryProfitability}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                                    <Tooltip formatter={(value, name) => {
                                        if (name === 'Marge') return [`${value}%`, name];
                                        return [`${value.toLocaleString()} GNF`, name];
                                    }} />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Chiffre d'affaires" />
                                    <Bar yAxisId="left" dataKey="cost" fill="#ff7300" name="Coûts" />
                                    <Bar yAxisId="left" dataKey="profit" fill="#82ca9d" name="Bénéfice" />
                                    <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#ff7300" name="Marge (%)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>

                        <Paper sx={{ p: 2, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Détail des catégories
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Catégorie</TableCell>
                                            <TableCell align="right">Chiffre d'affaires</TableCell>
                                            <TableCell align="right">Coûts</TableCell>
                                            <TableCell align="right">Bénéfice</TableCell>
                                            <TableCell align="right">Marge</TableCell>
                                            <TableCell align="right">Nombre de produits</TableCell>
                                            <TableCell>Produit le plus vendu</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {categoryProfitability.map((category) => (
                                            <TableRow key={category.name}>
                                                <TableCell>{category.name}</TableCell>
                                                <TableCell align="right">{category.revenue.toLocaleString()} GNF</TableCell>
                                                <TableCell align="right">{category.cost.toLocaleString()} GNF</TableCell>
                                                <TableCell align="right">{category.profit.toLocaleString()} GNF</TableCell>
                                                <TableCell align="right">{category.margin}%</TableCell>
                                                <TableCell align="right">{category.products}</TableCell>
                                                <TableCell>{category.topProduct}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                        <Paper sx={{ p: 2, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Rentabilité par produit
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Produit</TableCell>
                                            <TableCell>Catégorie</TableCell>
                                            <TableCell align="right">Quantité vendue</TableCell>
                                            <TableCell align="right">Prix moyen</TableCell>
                                            <TableCell align="right">Coût moyen</TableCell>
                                            <TableCell align="right">Chiffre d'affaires</TableCell>
                                            <TableCell align="right">Coûts totaux</TableCell>
                                            <TableCell align="right">Bénéfice</TableCell>
                                            <TableCell align="right">Marge</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {productProfitability.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell>{product.category}</TableCell>
                                                <TableCell align="right">{product.unitsSold}</TableCell>
                                                <TableCell align="right">{product.averagePrice.toLocaleString()} GNF</TableCell>
                                                <TableCell align="right">{product.averageCost.toLocaleString()} GNF</TableCell>
                                                <TableCell align="right">{product.revenue.toLocaleString()} GNF</TableCell>
                                                <TableCell align="right">{product.cost.toLocaleString()} GNF</TableCell>
                                                <TableCell align="right">{product.profit.toLocaleString()} GNF</TableCell>
                                                <TableCell align="right">{product.margin}%</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Top 5 des produits les plus rentables
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={[...productProfitability]
                                        .sort((a, b) => b.profit - a.profit)
                                        .slice(0, 5)}
                                    layout="vertical"
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" />
                                    <Tooltip formatter={(value) => [`${value.toLocaleString()} GNF`, 'Bénéfice']} />
                                    <Legend />
                                    <Bar dataKey="profit" fill="#82ca9d" name="Bénéfice" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </>
                )}

                {/* Detailed Table */}
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Détail des ventes
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Catégorie</TableCell>
                                    <TableCell>Produit</TableCell>
                                    <TableCell align="right">Quantité</TableCell>
                                    <TableCell align="right">Prix unitaire</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {salesData.map((row) => (
                                    <TableRow key={row.date}>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>Alimentation</TableCell>
                                        <TableCell>Produit A</TableCell>
                                        <TableCell align="right">100</TableCell>
                                        <TableCell align="right">5000 GNF</TableCell>
                                        <TableCell align="right">{row.amount.toLocaleString()} GNF</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </LocalizationProvider>
    );
}

export default Reports;