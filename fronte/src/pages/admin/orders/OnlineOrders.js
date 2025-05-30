import {
  Add as AddIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  Search as SearchIcon,
  LocalShipping as ShippingIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Badge,
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
  Snackbar,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import React, { useEffect, useState } from 'react';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Mock API Service
const orderService = {
  getOrders: async () => {
    // En production, remplacer par un appel API réel
    return [
      {
        id: 1,
        orderNumber: 'CMD-2023-001',
        customer: {
          name: 'Moussa Diop',
          email: 'moussa@example.com',
          phone: '622123456'
        },
        items: [
          { product: 'Riz 5kg', quantity: 2, price: 25000 },
          { product: 'Huile 1L', quantity: 3, price: 12000 }
        ],
        total: 86000,
        status: 'processing',
        paymentMethod: 'Mobile Money',
        deliveryAddress: '123 Rue Principale, Conakry',
        createdAt: '2023-05-15T14:30:00Z',
        deliveryDate: '2023-05-17'
      },
      {
        id: 2,
        orderNumber: 'CMD-2023-002',
        customer: {
          name: 'Fatou Diallo',
          email: 'fatou@example.com',
          phone: '633987654'
        },
        items: [
          { product: 'Sucre 1kg', quantity: 5, price: 5000 },
          { product: 'Lait en poudre', quantity: 2, price: 15000 }
        ],
        total: 55000,
        status: 'shipped',
        paymentMethod: 'Carte Bancaire',
        deliveryAddress: '456 Avenue Secondaire, Kindia',
        createdAt: '2023-05-16T09:15:00Z',
        deliveryDate: '2023-05-18'
      }
    ];
  },
  updateOrderStatus: async (id, status) => {
    // En production, remplacer par un appel API réel
    return true;
  }
};

const STATUSES = {
  pending: { label: 'En attente', color: 'warning' },
  processing: { label: 'En traitement', color: 'info' },
  shipped: { label: 'Expédiée', color: 'secondary' },
  delivered: { label: 'Livrée', color: 'success' },
  cancelled: { label: 'Annulée', color: 'error' }
};

function OnlineOrders() {
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Dialog states
  const [orderDialog, setOrderDialog] = useState({
    open: false,
    order: null
  });
  
  // UI feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrders();
        setOrders(data);
      } catch (error) {
        showSnackbar('Erreur lors du chargement des commandes', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    loadOrders();
  }, []);

  // Helper functions
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    return format(new Date(dateString), 'PP', { locale: fr });
  };

  // Order operations
  const handleOpenOrderDialog = (order) => {
    setOrderDialog({ open: true, order });
  };

  const handleCloseOrderDialog = () => {
    setOrderDialog({ open: false, order: null });
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await orderService.updateOrderStatus(id, status);
      setOrders(prev => prev.map(order => 
        order.id === id ? { ...order, status } : order
      ));
      showSnackbar(`Statut de la commande mis à jour: ${STATUSES[status].label}`);
    } catch (error) {
      showSnackbar('Erreur lors de la mise à jour du statut', 'error');
    }
  };

  // Filter and pagination
  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      order.orderNumber.toLowerCase().includes(searchLower) ||
      order.customer.name.toLowerCase().includes(searchLower) ||
      order.customer.email.toLowerCase().includes(searchLower) ||
      order.customer.phone.toLowerCase().includes(searchLower)
    );
    
    const matchesDate = selectedDate ? 
      format(new Date(order.createdAt), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') : 
      true;
    
    return matchesSearch && matchesDate;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Commandes en ligne
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ mr: 2 }}
              onClick={() => window.print()}
            >
              Imprimer
            </Button>
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Commandes totales
                </Typography>
                <Typography variant="h4">
                  {orders.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  En traitement
                </Typography>
                <Typography variant="h4">
                  {orders.filter(o => o.status === 'processing').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Expédiées
                </Typography>
                <Typography variant="h4">
                  {orders.filter(o => o.status === 'shipped').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Revenu total
                </Typography>
                <Typography variant="h4">
                  {orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()} GNF
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Toutes les commandes" />
            <Tab label="Statistiques" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {tabValue === 0 ? (
          <>
            {/* Search and Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Rechercher une commande..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <DatePicker
                    label="Filtrer par date"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setSelectedDate(null)}
                  >
                    Effacer le filtre
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Orders Table */}
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>N° Commande</TableCell>
                      <TableCell>Client</TableCell>
                      <TableCell>Montant</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Chargement...
                        </TableCell>
                      </TableRow>
                    ) : filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Aucune commande trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((order) => (
                          <TableRow key={order.id} hover>
                            <TableCell>
                              <Typography fontWeight="medium">
                                {order.orderNumber}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {order.paymentMethod}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>{order.customer.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {order.customer.phone}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {order.total.toLocaleString()} GNF
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={STATUSES[order.status]?.label || order.status} 
                                color={STATUSES[order.status]?.color || 'default'} 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell>
                              {formatDate(order.createdAt)}
                            </TableCell>
                            <TableCell align="center">
                              <Stack direction="row" spacing={1} justifyContent="center">
                                <Tooltip title="Voir détails">
                                  <IconButton onClick={() => handleOpenOrderDialog(order)}>
                                    <ViewIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Marquer comme expédiée">
                                  <IconButton 
                                    onClick={() => handleUpdateStatus(order.id, 'shipped')}
                                    disabled={order.status === 'shipped' || order.status === 'delivered'}
                                  >
                                    <ShippingIcon fontSize="small" color={order.status === 'shipped' ? 'primary' : 'inherit'} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Marquer comme livrée">
                                  <IconButton 
                                    onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                    disabled={order.status === 'delivered'}
                                  >
                                    <CheckCircleIcon fontSize="small" color={order.status === 'delivered' ? 'success' : 'inherit'} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Annuler">
                                  <IconButton 
                                    onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                    disabled={order.status === 'cancelled' || order.status === 'delivered'}
                                  >
                                    <CancelIcon fontSize="small" color={order.status === 'cancelled' ? 'error' : 'inherit'} />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredOrders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Lignes par page"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
              />
            </Paper>
          </>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              Statistiques des commandes
            </Typography>
            <Typography color="textSecondary">
              Graphiques et analyses à venir...
            </Typography>
          </Box>
        )}

        {/* Order Details Dialog */}
        <Dialog 
          open={orderDialog.open} 
          onClose={handleCloseOrderDialog} 
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Détails de la commande {orderDialog.order?.orderNumber}
          </DialogTitle>
          <DialogContent dividers>
            {orderDialog.order && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Informations client
                  </Typography>
                  <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography><strong>Nom:</strong> {orderDialog.order.customer.name}</Typography>
                    <Typography><strong>Email:</strong> {orderDialog.order.customer.email}</Typography>
                    <Typography><strong>Téléphone:</strong> {orderDialog.order.customer.phone}</Typography>
                    <Typography><strong>Adresse:</strong> {orderDialog.order.deliveryAddress}</Typography>
                  </Card>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Paiement
                  </Typography>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography><strong>Méthode:</strong> {orderDialog.order.paymentMethod}</Typography>
                    <Typography><strong>Total:</strong> {orderDialog.order.total.toLocaleString()} GNF</Typography>
                    <Typography><strong>Statut:</strong> 
                      <Chip 
                        label={STATUSES[orderDialog.order.status]?.label || orderDialog.order.status} 
                        color={STATUSES[orderDialog.order.status]?.color || 'default'} 
                        size="small" 
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Articles commandés
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Produit</TableCell>
                          <TableCell align="right">Qté</TableCell>
                          <TableCell align="right">Prix</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderDialog.order.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.product}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">{item.price.toLocaleString()} GNF</TableCell>
                            <TableCell align="right">{(item.quantity * item.price).toLocaleString()} GNF</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} align="right"><strong>Total:</strong></TableCell>
                          <TableCell align="right"><strong>{orderDialog.order.total.toLocaleString()} GNF</strong></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Livraison
                    </Typography>
                    <Typography>
                      <strong>Date prévue:</strong> {formatDate(orderDialog.order.deliveryDate)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseOrderDialog}>Fermer</Button>
            <Button 
              variant="contained" 
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
            >
              Imprimer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}

export default OnlineOrders;