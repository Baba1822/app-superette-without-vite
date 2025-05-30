import React, { useState, useEffect } from 'react';
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
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Simuler un appel API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Données mockées
                const mockOrders = [
                    {
                        id: '1',
                        date: '2024-03-10',
                        total: 150000,
                        status: 'completed',
                        items: [
                            { id: 1, name: 'Riz local', quantity: 2, price: 50000 },
                            { id: 2, name: 'Huile végétale', quantity: 1, price: 50000 }
                        ]
                    },
                    {
                        id: '2',
                        date: '2024-03-09',
                        total: 75000,
                        status: 'pending',
                        items: [
                            { id: 1, name: 'Sucre', quantity: 3, price: 25000 }
                        ]
                    }
                ];

                setOrders(mockOrders);
            } catch (err) {
                setError('Erreur lors du chargement des commandes');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

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
                                {orders.map((order) => (
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
                                {orders.length === 0 && (
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
                                        <TableRow>
                                            <TableCell colSpan={3} align="right">
                                                <strong>Total</strong>
                                            </TableCell>
                                            <TableCell align="right">
                                                <strong>{selectedOrder.total.toLocaleString()} GNF</strong>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ClientOrders; 