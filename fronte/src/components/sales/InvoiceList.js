import {
    Cancel as CancelIcon,
    Email as EmailIcon,
    CheckCircle as PaidIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    Chip,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { fr } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import SalesService from '../../services/SalesService';
import InvoiceGenerator from './InvoiceGenerator';

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showInvoice, setShowInvoice] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        startDate: null,
        endDate: null,
        status: 'all',
        search: '',
    });
    const [stats, setStats] = useState({
        totalInvoices: 0,
        totalAmount: 0,
        paidAmount: 0,
        unpaidAmount: 0,
    });

    useEffect(() => {
        loadInvoices();
        loadStats();
    }, [page, rowsPerPage, filters]);

    const loadInvoices = async () => {
        try {
            const response = await SalesService.getInvoiceHistory({
                ...filters,
                page: page + 1,
                limit: rowsPerPage,
            });
            setInvoices(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des factures:', error);
        }
    };

    const loadStats = async () => {
        try {
            const response = await SalesService.getInvoiceStats(
                filters.startDate,
                filters.endDate
            );
            setStats(response);
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
        }
    };

    const handleViewInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setShowInvoice(true);
    };

    const handleSendInvoice = async (invoice) => {
        try {
            await SalesService.sendInvoiceByEmail(invoice.id, invoice.clientEmail);
            // Afficher une notification de succès
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la facture:', error);
            // Afficher une notification d'erreur
        }
    };

    const handleMarkAsPaid = async (invoice) => {
        try {
            await SalesService.markInvoiceAsPaid(invoice.id, {
                paymentDate: new Date(),
                paymentMethod: invoice.paymentMethod,
            });
            loadInvoices();
            loadStats();
        } catch (error) {
            console.error('Erreur lors du marquage de la facture comme payée:', error);
        }
    };

    const handleCancelInvoice = async (invoice) => {
        if (window.confirm('Êtes-vous sûr de vouloir annuler cette facture ?')) {
            try {
                await SalesService.cancelInvoice(invoice.id, 'Annulation manuelle');
                loadInvoices();
                loadStats();
            } catch (error) {
                console.error('Erreur lors de l\'annulation de la facture:', error);
            }
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'success';
            case 'unpaid':
                return 'warning';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const renderStats = () => (
        <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Total Factures</Typography>
                        <Typography variant="h4">{stats.totalInvoices}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Montant Total</Typography>
                        <Typography variant="h4">
                            {stats.totalAmount.toLocaleString()} FCFA
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Montant Payé</Typography>
                        <Typography variant="h4" color="success.main">
                            {stats.paidAmount.toLocaleString()} FCFA
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Montant Impayé</Typography>
                        <Typography variant="h4" color="error.main">
                            {stats.unpaidAmount.toLocaleString()} FCFA
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );

    const renderFilters = () => (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
                <TextField
                    fullWidth
                    label="Rechercher"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                    <InputLabel>Statut</InputLabel>
                    <Select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        label="Statut"
                    >
                        <MenuItem value="all">Tous</MenuItem>
                        <MenuItem value="paid">Payées</MenuItem>
                        <MenuItem value="unpaid">Impayées</MenuItem>
                        <MenuItem value="cancelled">Annulées</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <DatePicker
                                label="Date de début"
                                value={filters.startDate}
                                onChange={(date) =>
                                    setFilters({ ...filters, startDate: date })
                                }
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DatePicker
                                label="Date de fin"
                                value={filters.endDate}
                                onChange={(date) =>
                                    setFilters({ ...filters, endDate: date })
                                }
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </Grid>
                    </Grid>
                </LocalizationProvider>
            </Grid>
        </Grid>
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestion des Factures
            </Typography>

            {renderStats()}
            {renderFilters()}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>N° Facture</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Client</TableCell>
                            <TableCell>Montant</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell>{invoice.number}</TableCell>
                                <TableCell>
                                    {new Date(invoice.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{invoice.clientName}</TableCell>
                                <TableCell>
                                    {invoice.amount.toLocaleString()} FCFA
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={invoice.status}
                                        color={getStatusColor(invoice.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        onClick={() => handleViewInvoice(invoice)}
                                        title="Voir"
                                    >
                                        <ViewIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleSendInvoice(invoice)}
                                        title="Envoyer"
                                    >
                                        <EmailIcon />
                                    </IconButton>
                                    {invoice.status === 'unpaid' && (
                                        <IconButton
                                            onClick={() => handleMarkAsPaid(invoice)}
                                            title="Marquer comme payée"
                                            color="success"
                                        >
                                            <PaidIcon />
                                        </IconButton>
                                    )}
                                    {invoice.status !== 'cancelled' && (
                                        <IconButton
                                            onClick={() => handleCancelInvoice(invoice)}
                                            title="Annuler"
                                            color="error"
                                        >
                                            <CancelIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={-1}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </TableContainer>

            {selectedInvoice && (
                <InvoiceGenerator
                    sale={selectedInvoice}
                    open={showInvoice}
                    onClose={() => {
                        setShowInvoice(false);
                        setSelectedInvoice(null);
                    }}
                />
            )}
        </Box>
    );
};

export default InvoiceList; 