import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  TablePagination,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import customerService from '../../../services/CustomerService';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 10;

function Customers() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [customerStats, setCustomerStats] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const { 
    data: customers = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customerService.getAllCustomers(),
    staleTime: 5 * 60 * 1000
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => customerService.updateCustomerStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      toast.success('Statut du client mis à jour avec succès');
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour du statut: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => customerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      toast.success('Client supprimé avec succès');
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression du client: ${error.message}`);
    }
  });

  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, data }) => customerService.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      toast.success('Client mis à jour avec succès');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour du client: ${error.message}`);
    }
  });

  const loadCustomerStats = async (customerId) => {
    try {
      const stats = await customerService.getCustomerStats(customerId);
      setCustomerStats(stats);
    } catch (error) {
      console.error('Error loading customer stats:', error);
      toast.error('Erreur lors du chargement des statistiques');
    }
  };

  const handleViewCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setViewMode('details');
    await loadCustomerStats(customer.id);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setEditFormData({
      prenom: customer.prenom || '',
      nom: customer.nom || '',
      email: customer.email,
      status: customer.status || 'pending'
    });
    setViewMode('edit');
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    await updateStatusMutation.mutateAsync({ id, status: newStatus });
  };

  const handleCloseDialog = () => {
    setSelectedCustomer(null);
    setViewMode('list');
    setCustomerStats(null);
    setEditFormData({});
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveCustomer = async () => {
    if (!selectedCustomer) return;
    await updateCustomerMutation.mutateAsync({
      id: selectedCustomer.id,
      data: editFormData
    });
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      active: { color: 'success', label: 'Actif' },
      inactive: { color: 'error', label: 'Inactif' },
      pending: { color: 'warning', label: 'En attente' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Chip size="small" color={config.color} label={config.label} />;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Erreur lors du chargement des clients: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des Clients
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Date d'inscription</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers
              .slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)
              .map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>{`${customer.prenom || ''} ${customer.nom || ''}`}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    {new Date(customer.date_inscription || customer.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusChip(customer.status)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewCustomer(customer)} color="primary">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditCustomer(customer)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleUpdateStatus(
                        customer.id,
                        customer.status === 'active' ? 'inactive' : 'active'
                      )}
                      color={customer.status === 'active' ? 'error' : 'success'}
                    >
                      {customer.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                    <IconButton onClick={() => handleDeleteCustomer(customer.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={customers.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={ITEMS_PER_PAGE}
          rowsPerPageOptions={[ITEMS_PER_PAGE]}
        />
      </TableContainer>

      <Dialog open={!!selectedCustomer} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {viewMode === 'details' ? 'Détails du Client' : 'Modifier le Client'}
        </DialogTitle>
        <DialogContent dividers>
          {viewMode === 'details' ? (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Informations personnelles
                </Typography>
                <Typography><strong>Nom:</strong> {selectedCustomer?.prenom || ''} {selectedCustomer?.nom || ''}</Typography>
                <Typography><strong>Email:</strong> {selectedCustomer?.email}</Typography>
                <Typography><strong>Téléphone:</strong> {selectedCustomer?.telephone || 'Non renseigné'}</Typography>
                <Typography><strong>Adresse:</strong> {selectedCustomer?.adresse || 'Non renseignée'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Statistiques
                </Typography>
                {customerStats ? (
                  <>
                    <Typography><strong>Nombre de commandes:</strong> {customerStats.totalOrders || 0}</Typography>
                    <Typography><strong>Montant total des achats:</strong> {customerStats.totalSpent?.toFixed(2) || '0.00'} €</Typography>
                    <Typography><strong>Dernière commande:</strong> {customerStats.lastOrderDate ? new Date(customerStats.lastOrderDate).toLocaleDateString() : 'Aucune commande'}</Typography>
                  </>
                ) : (
                  <CircularProgress size={20} />
                )}
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="prenom"
                  label="Prénom"
                  value={editFormData.prenom || ''}
                  onChange={handleEditFormChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="nom"
                  label="Nom"
                  value={editFormData.nom || ''}
                  onChange={handleEditFormChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  value={editFormData.email || ''}
                  onChange={handleEditFormChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  name="status"
                  label="Statut"
                  value={editFormData.status || 'pending'}
                  onChange={handleEditFormChange}
                  margin="normal"
                >
                  <MenuItem value="active">Actif</MenuItem>
                  <MenuItem value="inactive">Inactif</MenuItem>
                  <MenuItem value="pending">En attente</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fermer</Button>
          {viewMode === 'edit' && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveCustomer}
              disabled={updateCustomerMutation.isLoading}
            >
              {updateCustomerMutation.isLoading ? <CircularProgress size={24} /> : 'Enregistrer'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Customers;