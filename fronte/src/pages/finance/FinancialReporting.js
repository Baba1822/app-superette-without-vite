import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    IconButton,
    TextField,
    MenuItem,
    Snackbar,
    Alert,
    Chip,
    Stack,
    Divider
} from '@mui/material';
import {
    Download as DownloadIcon,
    Print as PrintIcon,
    Email as EmailIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    AccountBalance as AccountBalanceIcon,
    Assessment as AssessmentIcon,
    DateRange as DateRangeIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import fr from 'date-fns/locale/fr';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const REPORT_TYPES = {
    DAILY: 'Journalier',
    WEEKLY: 'Hebdomadaire',
    MONTHLY: 'Mensuel',
    QUARTERLY: 'Trimestriel',
    ANNUAL: 'Annuel',
    CUSTOM: 'Personnalisé'
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const FinancialReporting = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [reportType, setReportType] = useState('MONTHLY');
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date()
    });
    const [financialData, setFinancialData] = useState({
        revenue: 0,
        expenses: 0,
        profit: 0,
        salesData: [],
        expensesByCategory: [],
        topProducts: [],
        cashFlow: []
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        loadFinancialData();
    }, [reportType, dateRange]);

    const loadFinancialData = async () => {
        try {
            // Simuler le chargement des données financières (à remplacer par un appel API)
            const mockData = {
                revenue: 15000000,
                expenses: 9000000,
                profit: 6000000,
                salesData: [
                    { month: 'Jan', revenue: 1200000, expenses: 800000, profit: 400000 },
                    { month: 'Fév', revenue: 1500000, expenses: 900000, profit: 600000 },
                    { month: 'Mar', revenue: 1800000, expenses: 1100000, profit: 700000 }
                ],
                expensesByCategory: [
                    { name: 'Achats', value: 5000000 },
                    { name: 'Salaires', value: 2000000 },
                    { name: 'Loyer', value: 1000000 },
                    { name: 'Utilities', value: 500000 },
                    { name: 'Autres', value: 500000 }
                ],
                topProducts: [
                    { name: 'Produit A', revenue: 800000, quantity: 1200 },
                    { name: 'Produit B', revenue: 600000, quantity: 800 },
                    { name: 'Produit C', revenue: 400000, quantity: 600 }
                ],
                cashFlow: [
                    { date: '2024-01-01', inflow: 500000, outflow: 300000 },
                    { date: '2024-01-02', inflow: 600000, outflow: 400000 },
                    { date: '2024-01-03', inflow: 700000, outflow: 500000 }
                ]
            };
            setFinancialData(mockData);
        } catch (error) {
            showSnackbar('Erreur lors du chargement des données financières', 'error');
        }
    };

    const handleExportReport = async (format) => {
        try {
            // Logique d'export à implémenter
            showSnackbar('Rapport exporté avec succès');
        } catch (error) {
            showSnackbar('Erreur lors de l\'export du rapport', 'error');
        }
    };

    const handleEmailReport = async () => {
        try {
            // Logique d'envoi par email à implémenter
            showSnackbar('Rapport envoyé par email avec succès');
        } catch (error) {
            showSnackbar('Erreur lors de l\'envoi du rapport', 'error');
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const renderDashboard = () => (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Chiffre d'affaires
                        </Typography>
                        <Typography variant="h4" color="primary">
                            {formatCurrency(financialData.revenue)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <TrendingUpIcon color="success" /> +15% par rapport au mois dernier
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Dépenses
                        </Typography>
                        <Typography variant="h4" color="error">
                            {formatCurrency(financialData.expenses)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <TrendingDownIcon color="error" /> +5% par rapport au mois dernier
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Bénéfice net
                        </Typography>
                        <Typography variant="h4" color="success">
                            {formatCurrency(financialData.profit)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <TrendingUpIcon color="success" /> +20% par rapport au mois dernier
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Évolution des ventes et dépenses
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={financialData.salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" name="Revenus" stroke="#0088FE" />
                            <Line type="monotone" dataKey="expenses" name="Dépenses" stroke="#FF8042" />
                            <Line type="monotone" dataKey="profit" name="Bénéfice" stroke="#00C49F" />
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Répartition des dépenses
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={financialData.expensesByCategory}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {financialData.expensesByCategory.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>
        </Grid>
    );

    const renderSalesAnalysis = () => (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Meilleures ventes
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Produit</TableCell>
                                    <TableCell align="right">Quantité vendue</TableCell>
                                    <TableCell align="right">Chiffre d'affaires</TableCell>
                                    <TableCell align="right">% du total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {financialData.topProducts.map((product) => (
                                    <TableRow key={product.name}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell align="right">{product.quantity}</TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(product.revenue)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {((product.revenue / financialData.revenue) * 100).toFixed(1)}%
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Flux de trésorerie
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={financialData.cashFlow}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Bar dataKey="inflow" name="Entrées" fill="#00C49F" />
                            <Bar dataKey="outflow" name="Sorties" fill="#FF8042" />
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>
        </Grid>
    );

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Rapports Financiers</Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleExportReport('pdf')}
                    >
                        Exporter PDF
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<EmailIcon />}
                        onClick={handleEmailReport}
                    >
                        Envoyer par email
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<PrintIcon />}
                        onClick={() => window.print()}
                    >
                        Imprimer
                    </Button>
                </Stack>
            </Box>

            <Paper sx={{ mb: 3 }}>
                <Box sx={{ p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                select
                                label="Type de rapport"
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                            >
                                {Object.entries(REPORT_TYPES).map(([key, value]) => (
                                    <MenuItem key={key} value={key}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                                <Stack direction="row" spacing={2}>
                                    <DatePicker
                                        label="Date de début"
                                        value={dateRange.startDate}
                                        onChange={(date) =>
                                            setDateRange({ ...dateRange, startDate: date })
                                        }
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                    <DatePicker
                                        label="Date de fin"
                                        value={dateRange.endDate}
                                        onChange={(date) =>
                                            setDateRange({ ...dateRange, endDate: date })
                                        }
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Stack>
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            <Box sx={{ mb: 3 }}>
                <Tabs
                    value={currentTab}
                    onChange={(e, newValue) => setCurrentTab(newValue)}
                >
                    <Tab icon={<AssessmentIcon />} label="Tableau de bord" />
                    <Tab icon={<TrendingUpIcon />} label="Analyse des ventes" />
                </Tabs>
            </Box>

            {currentTab === 0 && renderDashboard()}
            {currentTab === 1 && renderSalesAnalysis()}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default FinancialReporting; 