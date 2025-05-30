import {
    Info as InfoIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

const INSTALLMENT_STATUS = {
    PENDING: { label: 'En attente', color: 'warning' },
    PAID: { label: 'Payé', color: 'success' },
    LATE: { label: 'En retard', color: 'error' },
    UPCOMING: { label: 'À venir', color: 'info' }
};

const InstallmentPlanList = () => {
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            setLoading(true);
            // Simuler le chargement des plans (à remplacer par l'appel API réel)
            const mockPlans = [
                {
                    id: 1,
                    totalAmount: 120000,
                    numberOfInstallments: 3,
                    customerName: 'John Doe',
                    customerEmail: 'john@example.com',
                    startDate: '2024-03-01',
                    status: 'IN_PROGRESS',
                    installments: [
                        { id: 1, amount: 40000, dueDate: '2024-03-01', status: 'PAID' },
                        { id: 2, amount: 40000, dueDate: '2024-04-01', status: 'PENDING' },
                        { id: 3, amount: 40000, dueDate: '2024-05-01', status: 'UPCOMING' }
                    ]
                }
                // Autres plans...
            ];
            setPlans(mockPlans);
        } catch (error) {
            console.error('Erreur lors du chargement des plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetails = (plan) => {
        setSelectedPlan(plan);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedPlan(null);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const calculateProgress = (plan) => {
        const paidInstallments = plan.installments.filter(i => i.status === 'PAID').length;
        return Math.round((paidInstallments / plan.numberOfInstallments) * 100);
    };

    const getInstallmentStatusChip = (status) => {
        const statusConfig = INSTALLMENT_STATUS[status];
        return (
            <Chip
                size="small"
                label={statusConfig.label}
                color={statusConfig.color}
            />
        );
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Plans de Paiement Fractionnés
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Client</TableCell>
                            <TableCell>Montant Total</TableCell>
                            <TableCell>Versements</TableCell>
                            <TableCell>Date de début</TableCell>
                            <TableCell>Progression</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {plans.map((plan) => (
                            <TableRow key={plan.id}>
                                <TableCell>
                                    <Typography variant="body2">{plan.customerName}</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {plan.customerEmail}
                                    </Typography>
                                </TableCell>
                                <TableCell>{formatCurrency(plan.totalAmount)}</TableCell>
                                <TableCell>
                                    {`${plan.installments.filter(i => i.status === 'PAID').length} / ${plan.numberOfInstallments}`}
                                </TableCell>
                                <TableCell>{formatDate(plan.startDate)}</TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="body2">
                                            {calculateProgress(plan)}%
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenDetails(plan)}
                                    >
                                        <InfoIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                {selectedPlan && (
                    <>
                        <DialogTitle>
                            Détails du Plan de Paiement
                        </DialogTitle>
                        <DialogContent>
                            <Box mb={3}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Informations générales
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2">
                                            Client: {selectedPlan.customerName}
                                        </Typography>
                                        <Typography variant="body2">
                                            Email: {selectedPlan.customerEmail}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2">
                                            Montant total: {formatCurrency(selectedPlan.totalAmount)}
                                        </Typography>
                                        <Typography variant="body2">
                                            Nombre de versements: {selectedPlan.numberOfInstallments}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Typography variant="subtitle1" gutterBottom>
                                Échéancier des versements
                            </Typography>
                            <List>
                                {selectedPlan.installments.map((installment) => (
                                    <ListItem
                                        key={installment.id}
                                        divider
                                    >
                                        <ListItemText
                                            primary={`Versement ${installment.id}`}
                                            secondary={`Échéance: ${formatDate(installment.dueDate)}`}
                                        />
                                        <ListItemSecondaryAction>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Typography>
                                                    {formatCurrency(installment.amount)}
                                                </Typography>
                                                {getInstallmentStatusChip(installment.status)}
                                            </Box>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>
                                Fermer
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default InstallmentPlanList; 