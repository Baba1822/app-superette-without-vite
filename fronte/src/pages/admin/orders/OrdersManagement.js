import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../../../services/orderService';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 10;

const OrdersManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  // Charger les commandes
  const { data: orders = [], isLoading } = useQuery(
    ['orders'],
    orderService.getAllOrders
  );

  // Mutation pour mettre à jour le statut
  const updateStatusMutation = useMutation(
    ({ orderId, status }) => orderService.updateOrderStatus(orderId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['orders']);
        setStatusDialogOpen(false);
        toast.success('Statut mis à jour avec succès');
      },
      onError: () => {
        toast.error('Erreur lors de la mise à jour du statut');
      }
    }
  );

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir la couleur du statut
  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  // Gérer le changement de statut
  const handleStatusChange = () => {
    if (!newStatus) {
      toast.error('Veuillez sélectionner un statut');
      return;
    }

    updateStatusMutation.mutate({
      orderId: selectedOrder.id,
      status: {
        status: newStatus,
        note: statusNote
      }
    });
  };

  // Voir les détails d'une commande
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  // Ouvrir le dialogue de changement de statut
  const handleOpenStatusDialog = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote('');
    setStatusDialogOpen(true);
  };

  if (isLoading) {
    return <Typography>Chargement...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des Commandes
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Commande</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              .slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)
              .map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{order.deliveryAddress}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.phoneNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>{order.total.toFixed(2)} GNF</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleViewOrder(order)}
                      title="Voir les détails"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenStatusDialog(order)}
                      title="Modifier le statut"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={orders.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={ITEMS_PER_PAGE}
          rowsPerPageOptions={[ITEMS_PER_PAGE]}
        />
      </TableContainer>

      {/* Dialog des détails de la commande */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Détails de la commande #{selectedOrder?.id}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Informations de livraison
                  </Typography>
                  <Typography>Adresse: {selectedOrder.deliveryAddress}</Typography>
                  <Typography>Téléphone: {selectedOrder.phoneNumber}</Typography>
                  {selectedOrder.note && (
                    <Typography>Note: {selectedOrder.note}</Typography>
                  )}
                </CardContent>
              </Card>

              <Typography variant="h6" gutterBottom>
                Articles commandés
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Produit</TableCell>
                      <TableCell align="right">Prix unitaire</TableCell>
                      <TableCell align="right">Quantité</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">
                          {item.price.toFixed(2)} GNF
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          {(item.price * item.quantity).toFixed(2)} GNF
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Typography variant="h6">
                  Total: {selectedOrder.total.toFixed(2)} GNF
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de changement de statut */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Modifier le statut de la commande</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Nouveau statut</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Nouveau statut"
            >
              <MenuItem value="pending">En attente</MenuItem>
              <MenuItem value="processing">En cours de traitement</MenuItem>
              <MenuItem value="shipped">Expédiée</MenuItem>
              <MenuItem value="delivered">Livrée</MenuItem>
              <MenuItem value="cancelled">Annulée</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Note (optionnel)"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            multiline
            rows={3}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleStatusChange}
            disabled={updateStatusMutation.isLoading}
          >
            {updateStatusMutation.isLoading ? 'En cours...' : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersManagement; 