import React, { useState, useEffect } from 'react';
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
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    MenuItem,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    LocalShipping as DeliveryIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Print as PrintIcon,
    Notifications as NotifyIcon,
    LocationOn as LocationIcon
} from '@mui/icons-material';
import { DeliveryService } from '../../../services/DeliveryService';

const DELIVERY_STATUS = {
    PENDING: { label: 'En attente', color: 'warning' },
    ASSIGNED: { label: 'Assignée', color: 'info' },
    IN_TRANSIT: { label: 'En cours', color: 'primary' },
    DELIVERED: { label: 'Livrée', color: 'success' },
    FAILED: { label: 'Échouée', color: 'error' }
};

const DeliveryManagement = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [loading, setLoading] = useState(false);
    const [zones, setZones] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        deliveryAddress: '',
        zoneId: '',
        scheduledDate: '',
        items: [],
        specialInstructions: ''
    });

    useEffect(() => {
        loadDeliveries();
        loadDeliveryZones();
    }, []);

    const loadDeliveries = async () => {
        try {
            setLoading(true);
            const response = await DeliveryService.getAllDeliveries();
            setDeliveries(response);
        } catch (error) {
            showSnackbar('Erreur lors du chargement des livraisons', 'error');
        } finally {
            setLoading(false);
        }
    };

    const loadDeliveryZones = async () => {
        try {
            const response = await DeliveryService.getDeliveryZones();
            setZones(response);
        } catch (error) {
            showSnackbar('Erreur lors du chargement des zones', 'error');
        }
    };

    const handleOpenDialog = (delivery = null) => {
        if (delivery) {
            setSelectedDelivery(delivery);
            setFormData({
                customerName: delivery.customerName,
                customerPhone: delivery.customerPhone,
                customerEmail: delivery.customerEmail,
                deliveryAddress: delivery.deliveryAddress,
                zoneId: delivery.zoneId,
                scheduledDate: delivery.scheduledDate.split('T')[0],
                items: delivery.items,
                specialInstructions: delivery.specialInstructions
            });
        } else {
            setSelectedDelivery(null);
            setFormData({
                customerName: '',
                customerPhone: '',
                customerEmail: '',
                deliveryAddress: '',
                zoneId: '',
                scheduledDate: '',
                items: [],
                specialInstructions: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedDelivery(null);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (selectedDelivery) {
                await DeliveryService.updateDeliveryStatus(selectedDelivery.id, formData);
                showSnackbar('Livraison mise à jour avec succès');
            } else {
                await DeliveryService.createDelivery(formData);
                showSnackbar('Livraison créée avec succès');
            }
            handleCloseDialog();
            loadDeliveries();
        } catch (error) {
            showSnackbar('Erreur lors de l\'enregistrement de la livraison', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (deliveryId, newStatus) => {
        try {
            await DeliveryService.updateDeliveryStatus(deliveryId, newStatus);
            showSnackbar('Statut mis à jour avec succès');
            loadDeliveries();
        } catch (error) {
            showSnackbar('Erreur lors de la mise à jour du statut', 'error');
        }
    };

    const handlePrintDeliverySlip = async (deliveryId) => {
        try {
            const blob = await DeliveryService.generateDeliverySlip(deliveryId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bordereau-livraison-${deliveryId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            showSnackbar('Erreur lors de la génération du bordereau', 'error');
        }
    };

    const handleSendNotification = async (deliveryId) => {
        try {
            await DeliveryService.sendDeliveryNotification(deliveryId, 'STATUS_UPDATE');
            showSnackbar('Notification envoyée avec succès');
        } catch (error) {
            showSnackbar('Erreur lors de l\'envoi de la notification', 'error');
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">
                    Gestion des Livraisons
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Nouvelle Livraison
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Client</TableCell>
                            <TableCell>Adresse</TableCell>
                            <TableCell>Date prévue</TableCell>
                            <TableCell>Zone</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {deliveries.map((delivery) => (
                            <TableRow key={delivery.id}>
                                <TableCell>
                                    <Typography variant="body2">
                                        {delivery.customerName}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {delivery.customerPhone}
                                    </Typography>
                                </TableCell>
                                <TableCell>{delivery.deliveryAddress}</TableCell>
                                <TableCell>{formatDate(delivery.scheduledDate)}</TableCell>
                                <TableCell>
                                    <Chip
                                        icon={<LocationIcon />}
                                        label={delivery.zoneName}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={DELIVERY_STATUS[delivery.status].label}
                                        color={DELIVERY_STATUS[delivery.status].color}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenDialog(delivery)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handlePrintDeliverySlip(delivery.id)}
                                    >
                                        <PrintIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleSendNotification(delivery.id)}
                                    >
                                        <NotifyIcon />
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
                <DialogTitle>
                    {selectedDelivery ? 'Modifier la Livraison' : 'Nouvelle Livraison'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Nom du client"
                                    value={formData.customerName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, customerName: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Téléphone"
                                    value={formData.customerPhone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, customerPhone: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
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
                                    label="Adresse de livraison"
                                    multiline
                                    rows={2}
                                    value={formData.deliveryAddress}
                                    onChange={(e) =>
                                        setFormData({ ...formData, deliveryAddress: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Zone de livraison"
                                    value={formData.zoneId}
                                    onChange={(e) =>
                                        setFormData({ ...formData, zoneId: e.target.value })
                                    }
                                >
                                    {zones.map((zone) => (
                                        <MenuItem key={zone.id} value={zone.id}>
                                            {zone.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Date de livraison"
                                    type="datetime-local"
                                    value={formData.scheduledDate}
                                    onChange={(e) =>
                                        setFormData({ ...formData, scheduledDate: e.target.value })
                                    }
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Instructions spéciales"
                                    multiline
                                    rows={3}
                                    value={formData.specialInstructions}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            specialInstructions: e.target.value
                                        })
                                    }
                                />
                            </Grid>
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
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
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

export default DeliveryManagement; 