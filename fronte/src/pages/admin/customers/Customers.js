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
  Alert,
  Fab
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
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
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: ''
  });

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

  const createCustomerMutation = useMutation({
    mutationFn: (data) => customerService.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      toast.success('Client ajouté avec succès');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error(`Erreur lors de l'ajout du client: ${error.message}`);
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

  const deleteCustomerMutation = useMutation({
    mutationFn: (id) => customerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      toast.success('Client supprimé avec succès');
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression du client: ${error.message}`);
    }
  });

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setFormData({
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      adresse: '',
      status: 'pending'
    });
    setViewMode('edit');
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      prenom: customer.prenom || '',
      nom: customer.nom || '',
      email: customer.email,
      telephone: customer.telephone || '',
      adresse: customer.adresse || '',
      status: customer.status || 'pending'
    });
    setViewMode('edit');
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      await deleteCustomerMutation.mutateAsync(id);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveCustomer = async () => {
    if (!validateForm()) return;

    if (selectedCustomer) {
      await updateCustomerMutation.mutateAsync({
        id: selectedCustomer.id,
        data: formData
      });
    } else {
      await createCustomerMutation.mutateAsync(formData);
    }
  };

  const validateForm = () => {
    if (!formData.prenom.trim() || !formData.nom.trim() || !formData.email.trim()) {
      toast.error('Veuillez remplir les champs obligatoires (Prénom, Nom et Email)');
      return false;
    }
    return true;
  };

  const handleCloseDialog = () => {
    setSelectedCustomer(null);
    setViewMode('list');
    setFormData({
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      adresse: '',
      status: 'pending'
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

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Fab color="primary" onClick={handleAddCustomer}>
          <AddIcon />
        </Fab>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
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
                  <TableCell>{customer.telephone || 'Non renseigné'}</TableCell>
                  <TableCell>{getStatusChip(customer.status)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditCustomer(customer)} color="primary">
                      <EditIcon />
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

      <Dialog open={viewMode === 'edit'} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedCustomer ? 'Modifier le Client' : 'Ajouter un Client'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="prenom"
                label="Prénom *"
                value={formData.prenom}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="nom"
                label="Nom *"
                value={formData.nom}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="email"
                label="Email *"
                value={formData.email}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="telephone"
                label="Téléphone"
                value={formData.telephone}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="adresse"
                label="Adresse"
                value={formData.adresse}
                onChange={handleFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                name="status"
                label="Statut"
                value={formData.status}
                onChange={handleFormChange}
                margin="normal"
              >
                <MenuItem value="active">Actif</MenuItem>
                <MenuItem value="inactive">Inactif</MenuItem>
                <MenuItem value="pending">En attente</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveCustomer}
            disabled={
              !formData.prenom.trim() ||
              !formData.nom.trim() ||
              !formData.email.trim()
            }
          >
            {selectedCustomer ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Customers;