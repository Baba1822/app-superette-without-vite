import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../../services/orderService';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    CircularProgress,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

const ClientOrders = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const { data: orders, isLoading, isError, error } = useQuery({
        queryKey: ['clientOrders'],
        queryFn: orderService.getOrders,
        onError: (err) => {
            console.error('Erreur lors du chargement des commandes:', err);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setOpenDialog(true);
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            completed: { label: 'Terminée', color: 'success' },
            pending: { label: 'En attente', color: 'warning' },
            cancelled: { label: 'Annulée', color: 'error' }
        };

        const config = statusConfig[status] || { label: status, color: 'default' };
        return <Chip label={config.label} color={config.color} size="small" />;
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{'Erreur lors du chargement des commandes: ' + error.message}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Mes Commandes
            </Typography>

            <Card>
                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>N° Commande</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    <TableCell>Statut</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(orders || []).map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>
                                            {new Date(order.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell align="right">
                                            {order.total.toLocaleString()} GNF
                                        </TableCell>
                                        <TableCell>
                                            {getStatusChip(order.status)}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                onClick={() => handleViewDetails(order)}
                                                size="small"
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(orders || []).length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography color="textSecondary">
                                                Aucune commande trouvée
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Détails de la commande #{selectedOrder?.id}
                </DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Date: {new Date(selectedOrder.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Statut: {getStatusChip(selectedOrder.status)}
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Produit</TableCell>
                                            <TableCell align="right">Quantité</TableCell>
                                            <TableCell align="right">Prix unitaire</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedOrder.items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell align="right">{item.quantity}</TableCell>
                                                <TableCell align="right">
                                                    {item.price.toLocaleString()} GNF
                                                </TableCell>
                                                <TableCell align="right">
                                                    {(item.price * item.quantity).toLocaleString()} GNF
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Fermer</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ClientOrders; 