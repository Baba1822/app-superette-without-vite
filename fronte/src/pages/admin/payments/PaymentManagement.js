import {
    AccountBalance as BankIcon,
    Check as CheckIcon,
    CreditCard as CreditCardIcon,
    Phone as PhoneIcon,
    QrCode as QrCodeIcon,
    Receipt as ReceiptIcon,
    Refresh as RefreshIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import PaymentService from '../../../services/PaymentService'; // Importer le service

const PAYMENT_METHODS = {
    ORANGE_MONEY: {
        id: 'ORANGE_MONEY',
        label: 'Orange Money',
        icon: <PhoneIcon />,
        color: 'secondary'
    },
    INSTALLMENT: {
        id: 'INSTALLMENT',
        label: 'Paiement fractionné',
        icon: <ScheduleIcon />,
        color: 'success'
    }
};

const PAYMENT_STATUS = {
    PENDING: { label: 'En attente', color: 'warning' },
    COMPLETED: { label: 'Complété', color: 'success' },
    FAILED: { label: 'Échoué', color: 'error' },
    REFUNDED: { label: 'Remboursé', color: 'info' }
};

const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [loading, setLoading] = useState(true); // Mettre à true initialement
    const [error, setError] = useState(null); // Ajouter un état pour les erreurs
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [formData, setFormData] = useState({
        amount: '',
        method: '',
        customerPhone: '',
        customerEmail: '',
        description: ''
    });
    const [isInstallment, setIsInstallment] = useState(false);
    const [installmentData, setInstallmentData] = useState({
        numberOfInstallments: 2,
        firstPaymentDate: new Date().toISOString().split('T')[0],
        installmentAmount: 0
    });

    useEffect(() => {
        loadPayments();
    }, []);

    useEffect(() => {
        if (formData.amount && installmentData.numberOfInstallments) {
            const newAmount = calculateInstallmentAmount(
                parseFloat(formData.amount),
                parseInt(installmentData.numberOfInstallments)
            );
            setInstallmentData(prev => ({ ...prev, installmentAmount: newAmount }));
        }
    }, [formData.amount, installmentData.numberOfInstallments]);

    const loadPayments = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await PaymentService.getPaymentHistory();
            setPayments(data.payments || []); // S'assurer que 'data' a une propriété 'payments'
        } catch (err) {
            setError(err.message || 'Une erreur est survenue lors du chargement des paiements.');
            showSnackbar(err.message || 'Erreur lors du chargement des paiements', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (payment = null) => {
        if (payment) {
            setSelectedPayment(payment);
            setFormData({
                amount: payment.amount,
                method: payment.method,
                customerPhone: payment.customerPhone,
                customerEmail: payment.customerEmail,
                description: payment.description
            });
        } else {
            setSelectedPayment(null);
            setFormData({
                amount: '',
                method: '',
                customerPhone: '',
                customerEmail: '',
                description: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedPayment(null);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (formData.method === 'INSTALLMENT') {
                // Logique de traitement du paiement fractionné
                const installmentPlan = {
                    totalAmount: formData.amount,
                    numberOfInstallments: installmentData.numberOfInstallments,
                    customerId: formData.customerEmail,
                    firstPaymentDate: installmentData.firstPaymentDate,
                    description: formData.description
                };
                // Appel au service de paiement fractionné à implémenter
                await new Promise(resolve => setTimeout(resolve, 2000)); // Simulation
                showSnackbar('Plan de paiement fractionné créé avec succès');
            } else {
                // Logique de traitement du paiement standard existante
                await new Promise(resolve => setTimeout(resolve, 2000));
                showSnackbar('Paiement initié avec succès');
            }
            handleCloseDialog();
            loadPayments();
        } catch (error) {
            showSnackbar('Erreur lors du traitement du paiement', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRefund = async (paymentId) => {
        try {
            setLoading(true);
            // Logique de remboursement à implémenter
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulation
            showSnackbar('Remboursement effectué avec succès');
            loadPayments();
        } catch (error) {
            showSnackbar('Erreur lors du remboursement', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    // Affichage conditionnel
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    {error}
                    <Button onClick={loadPayments} sx={{ ml: 2 }}>Réessayer</Button>
                </Alert>
            </Box>
        );
    }
    
    const formatCurrency = (amount) => {
        if (!amount || isNaN(amount)) return '0 GNF';
        return new Intl.NumberFormat('fr-GN', {
            style: 'decimal',
            minimumFractionDigits: 0
        }).format(amount) + ' GNF';
    };

    const renderPaymentMethodCard = (method) => (
        <Card
            sx={{
                cursor: 'pointer',
                '&:hover': { boxShadow: 6 },
                height: '100%'
            }}
            onClick={() => setFormData({ ...formData, method: method.id })}
        >
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    {React.cloneElement(method.icon, {
                        sx: { fontSize: 40, color: `${method.color}.main` }
                    })}
                    <Typography variant="subtitle1">{method.label}</Typography>
                    {formData.method === method.id && (
                        <CheckIcon color="success" sx={{ position: 'absolute', right: 8, top: 8 }} />
                    )}
                </Box>
            </CardContent>
        </Card>
    );

    const calculateInstallmentAmount = (totalAmount, numberOfInstallments) => {
        if (!totalAmount || !numberOfInstallments || numberOfInstallments === 0) return 0;
        return (totalAmount / numberOfInstallments).toFixed(2);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Gestion des Paiements
                    </Typography>
                    <Box>
                        <IconButton onClick={loadPayments} color="primary">
                            <RefreshIcon />
                        </IconButton>
                        <Button
                            variant="contained"
                            onClick={() => handleOpenDialog()}
                        >
                            Enregistrer un Paiement Manuel
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                {Object.values(PAYMENT_METHODS).map(renderPaymentMethodCard)}
            </Grid>

            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Transaction</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Client</TableCell>
                            <TableCell>Méthode</TableCell>
                            <TableCell align="right">Montant</TableCell>
                            <TableCell align="center">Statut</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.length > 0 ? (
                            payments.map((payment) => {
                                const method = PAYMENT_METHODS[payment.method];
                                const status = PAYMENT_STATUS[payment.status];
                                return (
                                    <TableRow key={payment.id}>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold">
                                                {payment.transactionId || payment.id}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(payment.date).toLocaleDateString('fr-FR')}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{payment.customerEmail}</Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {payment.customerPhone}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={method?.icon}
                                                label={method?.label || payment.method}
                                                color={method?.color || 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(payment.amount)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={status?.label || payment.status}
                                                color={status?.color || 'default'}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<ReceiptIcon />}
                                                onClick={() => handleOpenDialog(payment)}
                                                sx={{ mr: 1 }}
                                            >
                                                Détails
                                            </Button>
                                            {payment.status === 'COMPLETED' && (
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    size="small"
                                                    onClick={() => handleRefund(payment.id)}
                                                    disabled={loading}
                                                >
                                                    Rembourser
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography>Aucun paiement trouvé.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog de paiement */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedPayment ? 'Détails du Paiement' : 'Nouveau Paiement Manuel'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Montant"
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) =>
                                        setFormData({ ...formData, amount: e.target.value })
                                    }
                                    InputProps={{
                                        endAdornment: 'GNF'
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Méthode de paiement
                                </Typography>
                                <Grid container spacing={2}>
                                    {Object.values(PAYMENT_METHODS).map((method) => (
                                        <Grid item xs={6} sm={3} key={method.id}>
                                            {renderPaymentMethodCard(method)}
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Téléphone du client"
                                    value={formData.customerPhone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, customerPhone: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email du client"
                                    type="email"
                                    value={formData.customerEmail}
                                    onChange={(e) =>
                                        setFormData({ ...formData, customerEmail: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                />
                            </Grid>
                            {formData.method === 'INSTALLMENT' && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Nombre de versements"
                                            type="number"
                                            InputProps={{ inputProps: { min: 2, max: 12 } }}
                                            value={installmentData.numberOfInstallments}
                                            onChange={(e) => {
                                                const value = Math.max(2, Math.min(12, parseInt(e.target.value) || 2));
                                                setInstallmentData({
                                                    ...installmentData,
                                                    numberOfInstallments: value
                                                });
                                            }}
                                            helperText="Entre 2 et 12 versements"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Date du premier versement"
                                            type="date"
                                            value={installmentData.firstPaymentDate}
                                            onChange={(e) =>
                                                setInstallmentData({
                                                    ...installmentData,
                                                    firstPaymentDate: e.target.value
                                                })
                                            }
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Alert severity="info">
                                            Montant par versement : {formatCurrency(installmentData.installmentAmount)}
                                            <br />
                                            Total à payer : {formatCurrency(formData.amount)}
                                        </Alert>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Annuler</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {loading
                            ? 'Traitement...'
                            : formData.method === 'INSTALLMENT'
                            ? 'Créer le plan de paiement'
                            : 'Valider le paiement'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PaymentManagement;