import React, { useState } from 'react';
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
import { clientService } from '../../../services/clientService';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 10;

function Customers() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [selectedClient, setSelectedClient] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'details', 'edit'
  const [clientStats, setClientStats] = useState(null);

  // Récupérer la liste des clients
  const { data: clients = [], isLoading, error } = useQuery(
    ['clients'],
    clientService.getAllClients,
    {
      staleTime: 5 * 60 * 1000
    }
  );

  // Mutation pour mettre à jour le statut d'un client
  const updateStatusMutation = useMutation(
    ({ id, status }) => clientService.updateClientStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['clients']);
        toast.success('Statut du client mis à jour avec succès');
      },
      onError: () => {
        toast.error('Erreur lors de la mise à jour du statut');
      }
    }
  );

  // Mutation pour supprimer un client
  const deleteMutation = useMutation(
    (id) => clientService.deleteClient(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['clients']);
        toast.success('Client supprimé avec succès');
      },
      onError: () => {
        toast.error('Erreur lors de la suppression du client');
      }
    }
  );

  // Charger les statistiques du client
  const loadClientStats = async (clientId) => {
    try {
      const stats = await clientService.getClientStats(clientId);
      setClientStats(stats);
    } catch (error) {
      console.error('Error loading client stats:', error);
      toast.error('Erreur lors du chargement des statistiques');
    }
  };

  const handleViewClient = async (client) => {
    setSelectedClient(client);
    setViewMode('details');
    await loadClientStats(client.id);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setViewMode('edit');
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    await updateStatusMutation.mutateAsync({ id, status: newStatus });
  };

  const handleCloseDialog = () => {
    setSelectedClient(null);
    setViewMode('list');
    setClientStats(null);
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
            {clients
              .slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)
              .map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.id}</TableCell>
                  <TableCell>{client.firstName} {client.lastName}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>
                    {new Date(client.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusChip(client.status)}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleViewClient(client)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditClient(client)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleUpdateStatus(
                        client.id,
                        client.status === 'active' ? 'inactive' : 'active'
                      )}
                      color={client.status === 'active' ? 'error' : 'success'}
                    >
                      {client.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClient(client.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={clients.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={ITEMS_PER_PAGE}
          rowsPerPageOptions={[ITEMS_PER_PAGE]}
        />
      </TableContainer>

      {/* Dialog pour voir/modifier les détails du client */}
      <Dialog
        open={!!selectedClient}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
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
                <Typography>
                  <strong>Nom:</strong> {selectedClient.firstName} {selectedClient.lastName}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {selectedClient.email}
                </Typography>
                <Typography>
                  <strong>Téléphone:</strong> {selectedClient.phone || 'Non renseigné'}
                </Typography>
                <Typography>
                  <strong>Adresse:</strong> {selectedClient.address || 'Non renseignée'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Statistiques
                </Typography>
                {clientStats ? (
                  <>
                    <Typography>
                      <strong>Nombre de commandes:</strong> {clientStats.totalOrders}
                    </Typography>
                    <Typography>
                      <strong>Montant total des achats:</strong> {clientStats.totalSpent.toFixed(2)} €
                    </Typography>
                    <Typography>
                      <strong>Dernière commande:</strong>{' '}
                      {clientStats.lastOrderDate
                        ? new Date(clientStats.lastOrderDate).toLocaleDateString()
                        : 'Aucune commande'}
                    </Typography>
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
                  label="Prénom"
                  value={selectedClient.firstName}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  value={selectedClient.lastName}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={selectedClient.email}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Statut"
                  value={selectedClient.status}
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
          <Button onClick={handleCloseDialog}>
            Fermer
          </Button>
          {viewMode === 'edit' && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // Logique de mise à jour
                handleCloseDialog();
              }}
            >
              Enregistrer
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Customers;
