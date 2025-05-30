import {
    AccountBalance as BankIcon,
    CreditCard as CreditCardIcon,
    CardGiftcard as GiftIcon,
    History as HistoryIcon,
    IntegrationInstructions as IntegrationIcon,
    PhoneAndroid as MobileMoneyIcon,
    Notifications as NotificationsIcon,
    Payment as PaymentIcon,
    Person as PersonIcon,
    QrCode as QrCodeIcon,
    Receipt as ReceiptIcon,
    MoneyOff as RefundIcon,
    NotificationsActive as ReminderIcon,
    Assessment as ReportIcon,
    Smartphone as SmartphoneIcon,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Switch,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import InvoiceReminderService from '../../services/InvoiceReminderService';
import PaymentProcessorDialog from '../../components/dialogs/PaymentProcessorDialog';
import ReportDialog from '../../components/dialogs/ReportDialog';
import ReminderSettingsDialog from '../../components/dialogs/ReminderSettingsDialog';

// Mock data for mobile app users
const mobileUsers = [
    {
        id: 1,
        name: 'Client A',
        phone: '622123456',
        email: 'client.a@example.com',
        appVersion: '1.2.0',
        lastLogin: '2024-03-15 10:30',
        device: 'Android',
        notificationsEnabled: true,
        cardId: 1,
    },
    {
        id: 2,
        name: 'Client B',
        phone: '623456789',
        email: 'client.b@example.com',
        appVersion: '1.1.5',
        lastLogin: '2024-03-14 15:45',
        device: 'iOS',
        notificationsEnabled: true,
        cardId: 2,
    },
];

// Mock data for app features
const appFeatures = [
    {
        id: 1,
        name: 'Carte de fidélité numérique',
        description: 'Accès à la carte de fidélité et aux points',
        icon: <LoyaltyIcon />,
        enabled: true,
    },
    {
        id: 2,
        name: 'Notifications push',
        description: 'Alertes pour les offres et récompenses',
        icon: <NotificationsIcon />,
        enabled: true,
    },
    {
        id: 3,
        name: 'Historique des achats',
        description: 'Suivi des achats et points gagnés',
        icon: <HistoryIcon />,
        enabled: true,
    },
    {
        id: 4,
        name: 'Catalogue de récompenses',
        description: 'Visualisation et échange des récompenses',
        icon: <GiftIcon />,
        enabled: true,
    },
];

// Mock data for payment methods
const paymentMethods = [
    {
        id: 1,
        name: 'Carte bancaire',
        icon: <CreditCardIcon />,
        enabled: true,
        fee: 1.5,
        minAmount: 1000,
        maxAmount: 100000,
    },
    {
        id: 2,
        name: 'Mobile Money',
        icon: <MobileMoneyIcon />,
        enabled: true,
        fee: 0.5,
        minAmount: 500,
        maxAmount: 50000,
    },
    {
        id: 3,
        name: 'Virement bancaire',
        icon: <BankIcon />,
        enabled: true,
        fee: 0,
        minAmount: 1000,
        maxAmount: 1000000,
    },
];

// Mock data for transactions
const transactions = [
    {
        id: 1,
        userId: 1,
        amount: 15000,
        method: 'Carte bancaire',
        status: 'completed',
        date: '2024-03-15 10:30',
        reference: 'TRX-001',
    },
    {
        id: 2,
        userId: 2,
        amount: 5000,
        method: 'Mobile Money',
        status: 'pending',
        date: '2024-03-15 11:45',
        reference: 'TRX-002',
    },
];

// Mock data for payment processors
const paymentProcessors = [
    {
        id: 1,
        name: 'Stripe',
        status: 'connected',
        apiKey: 'sk_test_...',
        webhookSecret: 'whsec_...',
        supportedMethods: ['Carte bancaire'],
    },
    {
        id: 2,
        name: 'Orange Money',
        status: 'connected',
        apiKey: 'om_...',
        webhookSecret: 'om_wh_...',
        supportedMethods: ['Mobile Money'],
    },
];

// Mock data for refunds
const refunds = [
    {
        id: 1,
        transactionId: 1,
        amount: 15000,
        reason: 'Produit défectueux',
        status: 'completed',
        date: '2024-03-16 14:30',
        reference: 'REF-001',
    },
];

// Mock data for invoices
const invoices = [
    {
        id: 1,
        transactionId: 1,
        number: 'INV-2024-001',
        amount: 15000,
        date: '2024-03-15 10:30',
        dueDate: '2024-04-15',
        status: 'paid',
        pdfUrl: '/invoices/INV-2024-001.pdf',
    },
];

// Mock data for invoice reminders
const invoiceReminders = [
    {
        id: 1,
        invoiceId: 1,
        type: 'email',
        status: 'sent',
        date: '2024-03-20 10:00',
        content: 'Rappel de paiement pour la facture INV-2024-001',
    },
    {
        id: 2,
        invoiceId: 1,
        type: 'sms',
        status: 'pending',
        scheduledDate: '2024-03-25 10:00',
        content: 'Rappel de paiement pour la facture INV-2024-001',
    },
];

// Mock data for reminder settings
const reminderSettings = {
    firstReminder: {
        daysBefore: 3,
        methods: ['email'],
    },
    secondReminder: {
        daysBefore: 1,
        methods: ['email', 'sms'],
    },
    finalReminder: {
        daysBefore: 0,
        methods: ['email', 'sms', 'call'],
    },
    maxReminders: 3,
    gracePeriod: 7, // days
};

function MobileApp() {
    const [activeTab, setActiveTab] = useState(0);
    const [users, setUsers] = useState(mobileUsers);
    const [showUserDialog, setShowUserDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showFeatureDialog, setShowFeatureDialog] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showTransactionDialog, setShowTransactionDialog] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showRefundDialog, setShowRefundDialog] = useState(false);
    const [selectedRefund, setSelectedRefund] = useState(null);
    const [showProcessorDialog, setShowProcessorDialog] = useState(false);
    const [selectedProcessor, setSelectedProcessor] = useState(null);
    const [showReportDialog, setShowReportDialog] = useState(false);
    const [reportType, setReportType] = useState('daily');
    const [reportDate, setReportDate] = useState(new Date());
    const [showReminderDialog, setShowReminderDialog] = useState(false);
    const [selectedReminder, setSelectedReminder] = useState(null);
    const [showReminderSettingsDialog, setShowReminderSettingsDialog] = useState(false);
    const [reminderService] = useState(new InvoiceReminderService(reminderSettings));

    // Add new tabs
    const tabs = [
        { label: 'Utilisateurs' },
        { label: 'Fonctionnalités' },
        { label: 'Paiements' },
        { label: 'Remboursements' },
        { label: 'Factures' },
        { label: 'Rappels' },
        { label: 'Intégrations' },
        { label: 'Rapports' },
        { label: 'Statistiques' },
    ];

    // Function to check for overdue invoices
    const checkOverdueInvoices = () => {
        return reminderService.checkOverdueInvoices(invoices);
    };

    // Function to schedule reminders
    const scheduleReminders = (invoice) => {
        return reminderService.scheduleReminders(invoice);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Application Mobile</Typography>
                <Button
                    variant="contained"
                    startIcon={<SmartphoneIcon />}
                    onClick={() => setShowUserDialog(true)}
                >
                    Nouvel utilisateur
                </Button>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PersonIcon color="primary" sx={{ mr: 1 }} />
                                <Typography color="textSecondary">
                                    Utilisateurs actifs
                                </Typography>
                            </Box>
                            <Typography variant="h5">
                                {users.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <NotificationsIcon color="primary" sx={{ mr: 1 }} />
                                <Typography color="textSecondary">
                                    Notifications activées
                                </Typography>
                            </Box>
                            <Typography variant="h5">
                                {users.filter(user => user.notificationsEnabled).length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <SmartphoneIcon color="primary" sx={{ mr: 1 }} />
                                <Typography color="textSecondary">
                                    Versions d'app
                                </Typography>
                            </Box>
                            <Typography variant="h5">
                                2
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{ mt: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    variant="fullWidth"
                >
                    {tabs.map((tab, index) => (
                        <Tab key={index} label={tab.label} />
                    ))}
                </Tabs>

                {/* Users Tab */}
                {activeTab === 0 && (
                    <Box sx={{ p: 3 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nom</TableCell>
                                        <TableCell>Téléphone</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Appareil</TableCell>
                                        <TableCell>Version</TableCell>
                                        <TableCell>Dernière connexion</TableCell>
                                        <TableCell>Notifications</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.phone}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.device}</TableCell>
                                            <TableCell>{user.appVersion}</TableCell>
                                            <TableCell>{user.lastLogin}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={user.notificationsEnabled ? 'Activées' : 'Désactivées'}
                                                    color={user.notificationsEnabled ? 'success' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => {
                                                    setSelectedUser(user);
                                                    setShowUserDialog(true);
                                                }}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton>
                                                    <QrCodeIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* Features Tab */}
                {activeTab === 1 && (
                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            {appFeatures.map((feature) => (
                                <Grid item xs={12} sm={6} md={4} key={feature.id}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                {feature.icon}
                                                <Typography variant="h6" sx={{ ml: 1 }}>
                                                    {feature.name}
                                                </Typography>
                                            </Box>
                                            <Typography color="textSecondary" gutterBottom>
                                                {feature.description}
                                            </Typography>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={feature.enabled}
                                                        onChange={() => {
                                                            setAppFeatures(appFeatures.map(f => 
                                                                f.id === selectedFeature.id
                                                                    ? { ...f, enabled: e.target.checked }
                                                                    : f
                                                            ));
                                                            setShowFeatureDialog(false);
                                                        }}
                                                    />
                                                }
                                                label="Activé"
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Payments Tab */}
                {activeTab === 2 && (
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6">Méthodes de paiement</Typography>
                            <Button
                                variant="contained"
                                startIcon={<PaymentIcon />}
                                onClick={() => {
                                    setSelectedPayment(null);
                                    setShowPaymentDialog(true);
                                }}
                            >
                                Nouvelle méthode
                            </Button>
                        </Box>

                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            {paymentMethods.map((method) => (
                                <Grid item xs={12} sm={6} md={4} key={method.id}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                {method.icon}
                                                <Typography variant="h6" sx={{ ml: 1 }}>
                                                    {method.name}
                                                </Typography>
                                            </Box>
                                            <Typography color="textSecondary" gutterBottom>
                                                Frais: {method.fee}%
                                            </Typography>
                                            <Typography color="textSecondary" gutterBottom>
                                                Min: {method.minAmount} FCFA
                                            </Typography>
                                            <Typography color="textSecondary" gutterBottom>
                                                Max: {method.maxAmount} FCFA
                                            </Typography>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={method.enabled}
                                                        onChange={() => {
                                                            setSelectedPayment(method);
                                                            setShowPaymentDialog(true);
                                                        }}
                                                    />
                                                }
                                                label="Activé"
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Typography variant="h6" sx={{ mb: 3 }}>
                            Transactions récentes
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Référence</TableCell>
                                        <TableCell>Client</TableCell>
                                        <TableCell>Montant</TableCell>
                                        <TableCell>Méthode</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Statut</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>{transaction.reference}</TableCell>
                                            <TableCell>
                                                {users.find(u => u.id === transaction.userId)?.name}
                                            </TableCell>
                                            <TableCell>{transaction.amount} FCFA</TableCell>
                                            <TableCell>{transaction.method}</TableCell>
                                            <TableCell>{transaction.date}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={transaction.status}
                                                    color={
                                                        transaction.status === 'completed' ? 'success' :
                                                        transaction.status === 'pending' ? 'warning' : 'error'
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => {
                                                    setSelectedTransaction(transaction);
                                                    setShowTransactionDialog(true);
                                                }}>
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* Refunds Tab */}
                {activeTab === 3 && (
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6">Remboursements</Typography>
                            <Button
                                variant="contained"
                                startIcon={<RefundIcon />}
                                onClick={() => {
                                    setSelectedRefund(null);
                                    setShowRefundDialog(true);
                                }}
                            >
                                Nouveau remboursement
                            </Button>
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Référence</TableCell>
                                        <TableCell>Transaction</TableCell>
                                        <TableCell>Montant</TableCell>
                                        <TableCell>Raison</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Statut</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {refunds.map((refund) => (
                                        <TableRow key={refund.id}>
                                            <TableCell>{refund.reference}</TableCell>
                                            <TableCell>
                                                {transactions.find(t => t.id === refund.transactionId)?.reference}
                                            </TableCell>
                                            <TableCell>{refund.amount} FCFA</TableCell>
                                            <TableCell>{refund.reason}</TableCell>
                                            <TableCell>{refund.date}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={refund.status}
                                                    color={refund.status === 'completed' ? 'success' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => {
                                                    setSelectedRefund(refund);
                                                    setShowRefundDialog(true);
                                                }}>
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* Invoices Tab */}
                {activeTab === 4 && (
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6">Factures électroniques</Typography>
                            <Button
                                variant="contained"
                                startIcon={<ReceiptIcon />}
                                onClick={() => {
                                    // Generate new invoice
                                }}
                            >
                                Générer facture
                            </Button>
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Numéro</TableCell>
                                        <TableCell>Transaction</TableCell>
                                        <TableCell>Montant</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Échéance</TableCell>
                                        <TableCell>Statut</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoices.map((invoice) => (
                                        <TableRow key={invoice.id}>
                                            <TableCell>{invoice.number}</TableCell>
                                            <TableCell>
                                                {transactions.find(t => t.id === invoice.transactionId)?.reference}
                                            </TableCell>
                                            <TableCell>{invoice.amount} FCFA</TableCell>
                                            <TableCell>{invoice.date}</TableCell>
                                            <TableCell>{invoice.dueDate}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={invoice.status}
                                                    color={invoice.status === 'paid' ? 'success' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => window.open(invoice.pdfUrl, '_blank')}>
                                                    <ReceiptIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* Reminders Tab */}
                {activeTab === 5 && (
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6">Rappels de factures</Typography>
                            <Box>
                                <Button
                                    variant="outlined"
                                    startIcon={<ReminderIcon />}
                                    onClick={() => setShowReminderSettingsDialog(true)}
                                    sx={{ mr: 2 }}
                                >
                                    Paramètres
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<ReminderIcon />}
                                    onClick={() => {
                                        const overdueInvoices = checkOverdueInvoices();
                                        overdueInvoices.forEach(invoice => {
                                            const reminders = scheduleReminders(invoice);
                                            setInvoiceReminders([...invoiceReminders, ...reminders]);
                                        });
                                        setSnackbar({
                                            open: true,
                                            message: `${overdueInvoices.length} rappels programmés`,
                                            severity: 'success',
                                        });
                                    }}
                                >
                                    Programmer les rappels
                                </Button>
                            </Box>
                        </Box>

                        <Grid container spacing={3} sx={{ mb: 3 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Factures en retard
                                        </Typography>
                                        <Typography variant="h4">
                                            {checkOverdueInvoices().length}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Rappels envoyés
                                        </Typography>
                                        <Typography variant="h4">
                                            {invoiceReminders.filter(r => r.status === 'sent').length}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Rappels programmés
                                        </Typography>
                                        <Typography variant="h4">
                                            {invoiceReminders.filter(r => r.status === 'pending').length}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Taux de réponse
                                        </Typography>
                                        <Typography variant="h4">
                                            75%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Facture</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Statut</TableCell>
                                        <TableCell>Contenu</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoiceReminders.map((reminder) => (
                                        <TableRow key={reminder.id}>
                                            <TableCell>
                                                {invoices.find(i => i.id === reminder.invoiceId)?.number}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={reminder.type}
                                                    color={
                                                        reminder.type === 'email' ? 'primary' :
                                                        reminder.type === 'sms' ? 'secondary' : 'default'
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {reminder.date || reminder.scheduledDate}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={reminder.status}
                                                    color={reminder.status === 'sent' ? 'success' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{reminder.content}</TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => {
                                                    setSelectedReminder(reminder);
                                                    setShowReminderDialog(true);
                                                }}>
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* Integrations Tab */}
                {activeTab === 6 && (
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6">Intégrations de paiement</Typography>
                            <Button
                                variant="contained"
                                startIcon={<IntegrationIcon />}
                                onClick={() => {
                                    setSelectedProcessor(null);
                                    setShowProcessorDialog(true);
                                }}
                            >
                                Nouvelle intégration
                            </Button>
                        </Box>

                        <Grid container spacing={3}>
                            {paymentProcessors.map((processor) => (
                                <Grid item xs={12} sm={6} md={4} key={processor.id}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="h6" sx={{ ml: 1 }}>
                                                    {processor.name}
                                                </Typography>
                                            </Box>
                                            <Typography color="textSecondary" gutterBottom>
                                                Statut: {processor.status}
                                            </Typography>
                                            <Typography color="textSecondary" gutterBottom>
                                                Méthodes supportées: {processor.supportedMethods.join(', ')}
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                onClick={() => {
                                                    setSelectedProcessor(processor);
                                                    setShowProcessorDialog(true);
                                                }}
                                            >
                                                Configurer
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Reports Tab */}
                {activeTab === 7 && (
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6">Rapports de paiement</Typography>
                            <Button
                                variant="contained"
                                startIcon={<ReportIcon />}
                                onClick={() => setShowReportDialog(true)}
                            >
                                Générer rapport
                            </Button>
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Volume total
                                        </Typography>
                                        <Typography variant="h4">
                                            {transactions.reduce((sum, t) => sum + t.amount, 0)} FCFA
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Transactions réussies
                                        </Typography>
                                        <Typography variant="h4">
                                            {transactions.filter(t => t.status === 'completed').length}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Taux de réussite
                                        </Typography>
                                        <Typography variant="h4">
                                            {Math.round((transactions.filter(t => t.status === 'completed').length / transactions.length) * 100)}%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Frais totaux
                                        </Typography>
                                        <Typography variant="h4">
                                            {transactions.reduce((sum, t) => {
                                                const method = paymentMethods.find(p => p.name === t.method);
                                                return sum + (t.amount * (method?.fee || 0) / 100);
                                            }, 0)} FCFA
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* Statistics Tab */}
                {activeTab === 8 && (
                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Taux d'engagement
                                        </Typography>
                                        <Typography variant="h4">
                                            75%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Temps moyen d'utilisation
                                        </Typography>
                                        <Typography variant="h4">
                                            15 min
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Taux de rétention
                                        </Typography>
                                        <Typography variant="h4">
                                            85%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Satisfaction
                                        </Typography>
                                        <Typography variant="h4">
                                            4.5/5
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Paper>

            {/* User Dialog */}
            <Dialog
                open={showUserDialog}
                onClose={() => {
                    setShowUserDialog(false);
                    setSelectedUser(null);
                }}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {selectedUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nom"
                                value={selectedUser?.name || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Téléphone"
                                value={selectedUser?.phone || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                value={selectedUser?.email || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Appareil</InputLabel>
                                <Select
                                    value={selectedUser?.device || ''}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, device: e.target.value })}
                                    label="Appareil"
                                >
                                    <MenuItem value="Android">Android</MenuItem>
                                    <MenuItem value="iOS">iOS</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Version de l'app"
                                value={selectedUser?.appVersion || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, appVersion: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={selectedUser?.notificationsEnabled || false}
                                        onChange={(e) => setSelectedUser({
                                            ...selectedUser,
                                            notificationsEnabled: e.target.checked
                                        })}
                                    />
                                }
                                label="Notifications activées"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowUserDialog(false);
                        setSelectedUser(null);
                    }}>
                        Annuler
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (selectedUser) {
                                // Update existing user
                                setUsers(users.map(u => 
                                    u.id === selectedUser.id ? selectedUser : u
                                ));
                            } else {
                                // Add new user
                                setUsers([...users, {
                                    ...selectedUser,
                                    id: users.length + 1,
                                }]);
                            }
                            setShowUserDialog(false);
                            setSelectedUser(null);
                        }}
                    >
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Feature Dialog */}
            <Dialog
                open={showFeatureDialog}
                onClose={() => {
                    setShowFeatureDialog(false);
                    setSelectedFeature(null);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Gérer la fonctionnalité</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <Typography variant="h6">
                                {selectedFeature?.name}
                            </Typography>
                            <Typography color="textSecondary">
                                {selectedFeature?.description}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={selectedFeature?.enabled || false}
                                        onChange={(e) => {
                                            setAppFeatures(appFeatures.map(f => 
                                                f.id === selectedFeature.id
                                                    ? { ...f, enabled: e.target.checked }
                                                    : f
                                            ));
                                            setShowFeatureDialog(false);
                                        }}
                                    />
                                }
                                label="Activer cette fonctionnalité"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowFeatureDialog(false);
                        setSelectedFeature(null);
                    }}>
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Payment Method Dialog */}
            <Dialog
                open={showPaymentDialog}
                onClose={() => {
                    setShowPaymentDialog(false);
                    setSelectedPayment(null);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {selectedPayment ? 'Modifier la méthode de paiement' : 'Nouvelle méthode de paiement'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nom"
                                value={selectedPayment?.name || ''}
                                onChange={(e) => setSelectedPayment({ ...selectedPayment, name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Frais (%)"
                                value={selectedPayment?.fee || 0}
                                onChange={(e) => setSelectedPayment({ ...selectedPayment, fee: parseFloat(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Montant minimum"
                                value={selectedPayment?.minAmount || 0}
                                onChange={(e) => setSelectedPayment({ ...selectedPayment, minAmount: parseInt(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Montant maximum"
                                value={selectedPayment?.maxAmount || 0}
                                onChange={(e) => setSelectedPayment({ ...selectedPayment, maxAmount: parseInt(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={selectedPayment?.enabled || false}
                                        onChange={(e) => setSelectedPayment({
                                            ...selectedPayment,
                                            enabled: e.target.checked
                                        })}
                                    />
                                }
                                label="Activé"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowPaymentDialog(false);
                        setSelectedPayment(null);
                    }}>
                        Annuler
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (selectedPayment) {
                                // Update existing payment method
                                setPaymentMethods(paymentMethods.map(p => 
                                    p.id === selectedPayment.id ? selectedPayment : p
                                ));
                            } else {
                                // Add new payment method
                                setPaymentMethods([...paymentMethods, {
                                    ...selectedPayment,
                                    id: paymentMethods.length + 1,
                                }]);
                            }
                            setShowPaymentDialog(false);
                            setSelectedPayment(null);
                        }}
                    >
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Transaction Dialog */}
            <Dialog
                open={showTransactionDialog}
                onClose={() => {
                    setShowTransactionDialog(false);
                    setSelectedTransaction(null);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Détails de la transaction</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">
                                Référence: {selectedTransaction?.reference}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">
                                Client: {users.find(u => u.id === selectedTransaction?.userId)?.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">
                                Montant: {selectedTransaction?.amount} FCFA
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">
                                Méthode: {selectedTransaction?.method}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">
                                Date: {selectedTransaction?.date}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Statut</InputLabel>
                                <Select
                                    value={selectedTransaction?.status || ''}
                                    onChange={(e) => setSelectedTransaction({
                                        ...selectedTransaction,
                                        status: e.target.value
                                    })}
                                    label="Statut"
                                >
                                    <MenuItem value="pending">En attente</MenuItem>
                                    <MenuItem value="completed">Complété</MenuItem>
                                    <MenuItem value="failed">Échoué</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowTransactionDialog(false);
                        setSelectedTransaction(null);
                    }}>
                        Fermer
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            // Update transaction status
                            setTransactions(transactions.map(t => 
                                t.id === selectedTransaction.id ? selectedTransaction : t
                            ));
                            setShowTransactionDialog(false);
                            setSelectedTransaction(null);
                        }}
                    >
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Refund Dialog */}
            <Dialog
                open={showRefundDialog}
                onClose={() => {
                    setShowRefundDialog(false);
                    setSelectedRefund(null);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {selectedRefund ? 'Modifier le remboursement' : 'Nouveau remboursement'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Transaction</InputLabel>
                                <Select
                                    value={selectedRefund?.transactionId || ''}
                                    onChange={(e) => setSelectedRefund({
                                        ...selectedRefund,
                                        transactionId: e.target.value
                                    })}
                                    label="Transaction"
                                >
                                    {transactions.map(t => (
                                        <MenuItem key={t.id} value={t.id}>
                                            {t.reference} - {t.amount} FCFA
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Montant"
                                value={selectedRefund?.amount || ''}
                                onChange={(e) => setSelectedRefund({
                                    ...selectedRefund,
                                    amount: parseInt(e.target.value)
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Raison"
                                value={selectedRefund?.reason || ''}
                                onChange={(e) => setSelectedRefund({
                                    ...selectedRefund,
                                    reason: e.target.value
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Statut</InputLabel>
                                <Select
                                    value={selectedRefund?.status || ''}
                                    onChange={(e) => setSelectedRefund({
                                        ...selectedRefund,
                                        status: e.target.value
                                    })}
                                    label="Statut"
                                >
                                    <MenuItem value="pending">En attente</MenuItem>
                                    <MenuItem value="completed">Complété</MenuItem>
                                    <MenuItem value="failed">Échoué</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowRefundDialog(false);
                        setSelectedRefund(null);
                    }}>
                        Annuler
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (selectedRefund) {
                                // Update existing refund
                                setRefunds(refunds.map(r => 
                                    r.id === selectedRefund.id ? selectedRefund : r
                                ));
                            } else {
                                // Add new refund
                                setRefunds([...refunds, {
                                    ...selectedRefund,
                                    id: refunds.length + 1,
                                    date: new Date().toISOString(),
                                    reference: `REF-${String(refunds.length + 1).padStart(3, '0')}`,
                                }]);
                            }
                            setShowRefundDialog(false);
                            setSelectedRefund(null);
                        }}
                    >
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Processor Dialog */}
            <PaymentProcessorDialog
                open={showProcessorDialog}
                onClose={() => {
                    setShowProcessorDialog(false);
                    setSelectedProcessor(null);
                }}
                selectedProcessor={selectedProcessor}
                onSave={setPaymentProcessors}
                paymentProcessors={paymentProcessors}
            />

            {/* Report Dialog */}
            <ReportDialog
                open={showReportDialog}
                onClose={() => setShowReportDialog(false)}
                onGenerate={(config) => {
                    // Implémenter la génération du rapport
                    console.log('Generating report with config:', config);
                    setShowReportDialog(false);
                }}
            />

            {/* Reminder Settings Dialog */}
            <ReminderSettingsDialog
                open={showReminderSettingsDialog}
                onClose={() => setShowReminderSettingsDialog(false)}
                settings={reminderSettings}
                onSave={(newSettings) => {
                    setReminderSettings(newSettings);
                    // Mettre à jour le service avec les nouveaux paramètres
                    reminderService.reminderSettings = newSettings;
                }}
            />

            {/* Reminder Dialog */}
            <Dialog
                open={showReminderDialog}
                onClose={() => {
                    setShowReminderDialog(false);
                    setSelectedReminder(null);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Détails du rappel</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">
                                Facture: {invoices.find(i => i.id === selectedReminder?.invoiceId)?.number}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={selectedReminder?.type || ''}
                                    onChange={(e) => setSelectedReminder({
                                        ...selectedReminder,
                                        type: e.target.value
                                    })}
                                    label="Type"
                                >
                                    <MenuItem value="email">Email</MenuItem>
                                    <MenuItem value="sms">SMS</MenuItem>
                                    <MenuItem value="call">Appel</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Date"
                                type="datetime-local"
                                value={selectedReminder?.date || selectedReminder?.scheduledDate || ''}
                                onChange={(e) => setSelectedReminder({
                                    ...selectedReminder,
                                    date: e.target.value
                                })}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Statut</InputLabel>
                                <Select
                                    value={selectedReminder?.status || ''}
                                    onChange={(e) => setSelectedReminder({
                                        ...selectedReminder,
                                        status: e.target.value
                                    })}
                                    label="Statut"
                                >
                                    <MenuItem value="pending">Programmé</MenuItem>
                                    <MenuItem value="sent">Envoyé</MenuItem>
                                    <MenuItem value="failed">Échoué</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Contenu"
                                multiline
                                rows={4}
                                value={selectedReminder?.content || ''}
                                onChange={(e) => setSelectedReminder({
                                    ...selectedReminder,
                                    content: e.target.value
                                })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowReminderDialog(false);
                        setSelectedReminder(null);
                    }}>
                        Annuler
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            // Update reminder
                            setInvoiceReminders(invoiceReminders.map(r => 
                                r.id === selectedReminder.id ? selectedReminder : r
                            ));
                            setShowReminderDialog(false);
                            setSelectedReminder(null);
                        }}
                    >
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
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
}

export default MobileApp; 