import React, { useEffect, useState } from 'react';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Event as EventIcon,
  LocalOffer as LocalOfferIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  MenuItem,
  Pagination
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import frLocale from 'date-fns/locale/fr';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../../services/productService';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const endpoints = {
  products: {
    list: `${API_BASE_URL}/products`,
    create: `${API_BASE_URL}/products`,
    update: (id) => `${API_BASE_URL}/products/${id}`,
    delete: (id) => `${API_BASE_URL}/products/${id}`,
  }
};

const ITEMS_PER_PAGE = 10;

const ProductsManagement = () => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    seasonalOnly: false,
    promotionsOnly: false
  });

  const [dialog, setDialog] = useState({
    open: false,
    item: null,
  });

  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
    alertThreshold: '5',
    image: '',
    isSeasonal: false,
    seasonStart: null,
    seasonEnd: null,
    hasPromotion: false,
    promotionType: 'percentage',
    promotionValue: '',
    promotionStart: null,
    promotionEnd: null,
    datePeremption: null,
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [page, setPage] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Load initial data
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAllProducts
  });

  // Logs pour déboguer
  useEffect(() => {
    console.log('Products data:', products);
    console.log('Loading state:', isLoading);
    console.log('Error:', error);
  }, [products, isLoading, error]);

  // Mutations for CRUD operations
  const createMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      handleCloseDialog();
      toast.success('Produit ajouté avec succès');
    },
    onError: (error) => {
      setErrors(prev => ({ ...prev, error: error.response?.data?.message || 'Erreur lors de l\'ajout du produit' }));
      toast.error('Erreur lors de l\'ajout du produit');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => productService.updateProduct(selectedProduct.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      handleCloseDialog();
      toast.success('Produit mis à jour avec succès');
    },
    onError: (error) => {
      setErrors(prev => ({ ...prev, error: error.response?.data?.message || 'Erreur lors de la mise à jour' }));
      toast.error('Erreur lors de la mise à jour');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Produit supprimé avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    }
  });

  const uploadImageMutation = useMutation({
    mutationFn: ({ id, file }) => productService.uploadImage(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Image téléchargée avec succès');
    },
    onError: () => {
      toast.error('Erreur lors du téléchargement de l\'image');
    }
  });

  // Handle filters
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle dialog
  const handleOpenDialog = (item = null) => {
    setForm({
      name: item?.name || '',
      category: item?.category || '',
      price: item?.price?.toString() || '',
      quantity: item?.quantity?.toString() || '',
      description: item?.description || '',
      alertThreshold: item?.alertThreshold?.toString() || '5',
      image: item?.image || '',
      isSeasonal: item?.isSeasonal || false,
      seasonStart: item?.seasonStart ? new Date(item.seasonStart) : null,
      seasonEnd: item?.seasonEnd ? new Date(item.seasonEnd) : null,
      hasPromotion: item?.hasPromotion || false,
      promotionType: item?.promotionType || 'percentage',
      promotionValue: item?.promotionValue?.toString() || '',
      promotionStart: item?.promotionStart ? new Date(item.promotionStart) : null,
      promotionEnd: item?.promotionEnd ? new Date(item.promotionEnd) : null,
      datePeremption: item?.datePeremption ? new Date(item.datePeremption) : null,
    });
    
    setDialog({ open: true, item });
    setErrors({});
    setSelectedProduct(item);
    setImageFile(null);
  };

  const handleCloseDialog = () => {
    setForm({
      name: '',
      category: '',
      price: '',
      quantity: '',
      description: '',
      alertThreshold: '5',
      image: '',
      isSeasonal: false,
      seasonStart: null,
      seasonEnd: null,
      hasPromotion: false,
      promotionType: 'percentage',
      promotionValue: '',
      promotionStart: null,
      promotionEnd: null,
      datePeremption: null,
    });
    setDialog({ open: false, item: null });
    setSelectedProduct(null);
    setImageFile(null);
    setErrors({});
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    const { name } = e.target;
    setForm(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setForm(prev => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = 'Le nom est requis';
    if (!form.category) newErrors.category = 'La catégorie est requise';
    if (!form.price) newErrors.price = 'Le prix est requis';
    if (!form.quantity) newErrors.quantity = 'Le stock est requis';
    if (!form.alertThreshold) newErrors.alertThreshold = 'Le seuil d\'alerte est requis';
    
    if (form.isSeasonal) {
      if (!form.seasonStart) newErrors.seasonStart = 'La date de début est requise';
      if (!form.seasonEnd) newErrors.seasonEnd = 'La date de fin est requise';
    }

    if (form.hasPromotion) {
      if (!form.promotionType) newErrors.promotionType = 'Le type de promotion est requis';
      if (!form.promotionValue) newErrors.promotionValue = 'La valeur de promotion est requise';
      if (!form.promotionStart) newErrors.promotionStart = 'La date de début est requise';
      if (!form.promotionEnd) newErrors.promotionEnd = 'La date de fin est requise';
      
      if (form.promotionType === 'percentage' && form.promotionValue) {
        const value = parseFloat(form.promotionValue);
        if (value <= 0 || value > 100) {
          newErrors.promotionValue = 'Le pourcentage doit être entre 1 et 100';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = {
      ...form,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity),
      alertThreshold: parseInt(form.alertThreshold),
      promotionValue: form.promotionValue ? parseFloat(form.promotionValue) : null,
      seasonStart: form.seasonStart?.toISOString(),
      seasonEnd: form.seasonEnd?.toISOString(),
      promotionStart: form.promotionStart?.toISOString(),
      promotionEnd: form.promotionEnd?.toISOString(),
      datePeremption: form.datePeremption?.toISOString(),
    };

    if (selectedProduct) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  // Delete product
  const deleteProduct = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteMutation.mutate(id);
    }
  };

  // Notifications
  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const closeNotification = () => {
    setNotification({ open: false, message: '', severity: 'success' });
  };

  // Utility functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF'
    }).format(price);
  };

  const getStockStatus = (quantity, alertThreshold) => {
    if (!quantity) return 'error';
    if (quantity <= alertThreshold) return 'warning';
    return 'success';
  };

  // Filtrer les produits
  const getFilteredProducts = () => {
    if (!Array.isArray(products)) return [];
    const { seasonalOnly, promotionsOnly } = filters;
    return products.filter(product => {
      if (seasonalOnly && !product.isSeasonal) return false;
      if (promotionsOnly && !product.hasPromotion) return false;
      return true;
    });
  };

  // Render form content
  const renderFormContent = () => {
    return (
      <Box sx={{ display: 'grid', gap: 1, mt: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
        {/* Informations de base */}
        <Box sx={{ display: 'grid', gap: 0.5, mb: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="body2" color="primary" sx={{ fontSize: '0.9rem' }}>Informations de base</Typography>
          <Grid container spacing={0.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                size="small"
                sx={{ '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Catégorie"
                name="category"
                value={form.category}
                onChange={handleInputChange}
                error={!!errors.category}
                helperText={errors.category}
                required
                select
                size="small"
                sx={{ '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
              >
                <MenuItem value="">Sélectionner une catégorie</MenuItem>
                <MenuItem value="1">Produits frais</MenuItem>
                <MenuItem value="2">Produits secs</MenuItem>
                <MenuItem value="3">Boissons</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={2}
                size="small"
                sx={{ '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Prix et Stock */}
        <Box sx={{ display: 'grid', gap: 0.5, mb: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="body2" color="primary" sx={{ fontSize: '0.9rem' }}>Prix et Stock</Typography>
          <Grid container spacing={0.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prix"
                name="price"
                type="number"
                value={form.price}
                onChange={handleInputChange}
                error={!!errors.price}
                helperText={errors.price}
                required
                size="small"
                sx={{ '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">GNF</InputAdornment>,
                  sx: { fontSize: '0.8rem' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock"
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleInputChange}
                error={!!errors.quantity}
                helperText={errors.quantity}
                required
                size="small"
                sx={{ '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Seuil d'alerte"
                name="alertThreshold"
                type="number"
                value={form.alertThreshold}
                onChange={handleInputChange}
                error={!!errors.alertThreshold}
                helperText={errors.alertThreshold}
                required
                size="small"
                sx={{ '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Date et Image */}
        <Box sx={{ display: 'grid', gap: 0.5, mb: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="body2" color="primary" sx={{ fontSize: '0.9rem' }}>Date et Image</Typography>
          <Grid container spacing={0.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date de péremption"
                name="datePeremption"
                type="date"
                value={form.datePeremption ? form.datePeremption.toISOString().split('T')[0] : ''}
                onChange={(e) => setForm(prev => ({ ...prev, datePeremption: e.target.value ? new Date(e.target.value) : null }))}
                error={!!errors.datePeremption}
                helperText={errors.datePeremption}
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{ '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={form.image}
                onChange={handleInputChange}
                error={!!errors.image}
                helperText={errors.image}
                size="small"
                sx={{ '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                size="small"
                sx={{ fontSize: '0.8rem', height: '2.5rem' }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Saisonnalité */}
        <Box sx={{ mt: 2, border: '1px solid #eee', borderRadius: 1, p: 2 }}>
          <FormControlLabel
            control={
              <Switch
                name="isSeasonal"
                checked={form.isSeasonal}
                onChange={handleSwitchChange}
                color="primary"
              />
            }
            label="Produit saisonnier"
          />

          <Collapse in={form.isSeasonal}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <DatePicker
                label="Début de saison"
                value={form.seasonStart}
                onChange={(date) => setForm(prev => ({ ...prev, seasonStart: date }))}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.seasonStart,
                    helperText: errors.seasonStart,
                    sx: { '& .MuiInputLabel-root': { fontSize: '0.8rem' } }
                  }
                }}
              />
              <DatePicker
                label="Fin de saison"
                value={form.seasonEnd}
                onChange={(date) => setForm(prev => ({ ...prev, seasonEnd: date }))}
                minDate={form.seasonStart}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.seasonEnd,
                    helperText: errors.seasonEnd
                  }
                }}
              />
            </Box>
          </Collapse>
        </Box>

        {/* Promotion */}
        <Box sx={{ mt: 2, border: '1px solid #eee', borderRadius: 1, p: 2 }}>
          <FormControlLabel
            control={
              <Switch
                name="hasPromotion"
                checked={form.hasPromotion}
                onChange={handleSwitchChange}
                color="primary"
              />
            }
            label="Promotion"
          />

          <Collapse in={form.hasPromotion}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                select
                fullWidth
                label="Type de promotion"
                name="promotionType"
                value={form.promotionType}
                onChange={handleInputChange}
                size="small"
                sx={{ '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
              >
                <MenuItem value="percentage">Pourcentage (%)</MenuItem>
                <MenuItem value="fixed">Montant fixe (GNF)</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label={form.promotionType === 'percentage' ? 'Pourcentage' : 'Montant'}
                name="promotionValue"
                type="number"
                value={form.promotionValue}
                onChange={handleInputChange}
                error={!!errors.promotionValue}
                helperText={errors.promotionValue}
                size="small"
                sx={{ '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
                InputProps={form.promotionType === 'fixed' ? {
                  startAdornment: <InputAdornment position="start">GNF</InputAdornment>
                } : undefined}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <DatePicker
                label="Début de promotion"
                value={form.promotionStart}
                onChange={(date) => setForm(prev => ({ ...prev, promotionStart: date }))}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.promotionStart,
                    helperText: errors.promotionStart,
                    size: "small",
                    sx: { '& .MuiInputLabel-root': { fontSize: '0.8rem' } }
                  }
                }}
              />
              <DatePicker
                label="Fin de promotion"
                value={form.promotionEnd}
                onChange={(date) => setForm(prev => ({ ...prev, promotionEnd: date }))}
                minDate={form.promotionStart}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.promotionEnd,
                    helperText: errors.promotionEnd,
                    size: "small",
                    sx: { '& .MuiInputLabel-root': { fontSize: '0.8rem' } }
                  }
                }}
              />
            </Box>
          </Collapse>
        </Box>
      </Box>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Produits</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            variant="contained"
            onClick={() => handleOpenDialog()}
            startIcon={<AddIcon />}
          >
            Nouveau produit
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={filters.seasonalOnly}
                  onChange={(e) => handleFilterChange('seasonalOnly', e.target.checked)}
                />
              }
              label="Produits saisonniers"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={filters.promotionsOnly}
                  onChange={(e) => handleFilterChange('promotionsOnly', e.target.checked)}
                />
              }
              label="Produits en promotion"
            />
          </Box>
        </Box>

        {/* Table des produits */}
        <Paper sx={{ width: '100%', overflow: 'hidden', mt: 3 }}>
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Catégorie</TableCell>
                  <TableCell>Prix</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFilteredProducts().map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography>{product.quantity}</Typography>
                        <Chip
                          size="small"
                          color={getStockStatus(product.quantity, product.alertThreshold)}
                          label={product.quantity <= product.alertThreshold ? 'Alerte' : 'OK'}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <ButtonGroup>
                        <Button startIcon={<EditIcon />} onClick={() => handleOpenDialog(product)}>Modifier</Button>
                        <Button startIcon={<DeleteIcon />} color="error" onClick={() => deleteProduct(product._id)}>Supprimer</Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={getFilteredProducts().length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={ITEMS_PER_PAGE}
          rowsPerPageOptions={[ITEMS_PER_PAGE]}
        />

        {/* Dialog de modification */}
        <Dialog
          open={dialog.open}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{selectedProduct ? 'Modifier produit' : 'Nouveau produit'}</DialogTitle>
          <DialogContent>
            {renderFormContent()}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {selectedProduct ? 'Modifier' : 'Créer'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={closeNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={closeNotification}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default ProductsManagement;