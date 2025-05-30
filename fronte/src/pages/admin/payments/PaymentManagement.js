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

const PAYMENT_METHODS = {
    CARD: {
        id: 'CARD',
        label: 'Carte bancaire',
        icon: <CreditCardIcon />,
        color: 'primary'
    },
    MOBILE_MONEY: {
        id: 'MOBILE_MONEY',
        label: 'Mobile Money',
        icon: <PhoneIcon />,
        color: 'secondary'
    },
    BANK_TRANSFER: {
        id: 'BANK_TRANSFER',
        label: 'Virement bancaire',
        icon: <BankIcon />,
        color: 'info'
    },
    QR_CODE: {
        id: 'QR_CODE',
        label: 'Code QR',
        icon: <QrCodeIcon />,
        color: 'warning'
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
    const [loading, setLoading] = useState(false);
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

    const loadPayments = async () => {
        try {
            // Simuler le chargement des paiements (à remplacer par un appel API)
            const mockPayments = [
                {
                    id: 1,
                    amount: 25000,
                    method: 'CARD',
                    status: 'COMPLETED',
                    customerPhone: '771234567',
                    customerEmail: 'client@example.com',
                    description: 'Achat #12345',
                    date: new Date().toISOString(),
                    transactionId: 'TRX123456'
                },
                // Autres paiements...
            ];
            setPayments(mockPayments);
        } catch (error) {
            showSnackbar('Erreur lors du chargement des paiements', 'error');
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(amount);
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
        const amount = totalAmount / numberOfInstallments;
        setInstallmentData(prev => ({
            ...prev,
            installmentAmount: Math.ceil(amount)
        }));
    };

    useEffect(() => {
        if (formData.amount && installmentData.numberOfInstallments) {
            calculateInstallmentAmount(
                parseFloat(formData.amount),
                parseInt(installmentData.numberOfInstallments)
            );
        }
    }, [formData.amount, installmentData.numberOfInstallments]);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Gestion des Paiements</Typography>
                <Button
                    variant="contained"
                    startIcon={<ReceiptIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Nouveau Paiement
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Montant</TableCell>
                            <TableCell>Méthode</TableCell>
                            <TableCell>Client</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>
                                    {new Date(payment.date).toLocaleDateString('fr-FR')}
                                </TableCell>
                                <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                <TableCell>
                                    <Chip
                                        icon={PAYMENT_METHODS[payment.method].icon}
                                        label={PAYMENT_METHODS[payment.method].label}
                                        color={PAYMENT_METHODS[payment.method].color}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{payment.customerEmail}</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {payment.customerPhone}
                                    </Typography>
                                </TableCell>
                                <TableCell>{payment.description}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={PAYMENT_STATUS[payment.status].label}
                                        color={PAYMENT_STATUS[payment.status].color}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRefund(payment.id)}
                                        disabled={payment.status !== 'COMPLETED'}
                                    >
                                        <RefreshIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedPayment ? 'Modifier le Paiement' : 'Nouveau Paiement'}
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
                                        endAdornment: 'FCFA'
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

export default PaymentManagement; 