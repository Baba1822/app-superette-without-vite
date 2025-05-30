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
  IconButton,
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
  MenuItem
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
  const [data, setData] = useState({
    products: [],
    loading: true,
    error: null,
  });

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
    location: '',
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
  const { data: products = [], isLoading } = useQuery(
    ['products'],
    productService.getAllProducts
  );

  // Mutations for CRUD operations
  const createMutation = useMutation(productService.createProduct, {
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

  const updateMutation = useMutation(
    (data) => productService.updateProduct(selectedProduct.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products']);
        handleCloseDialog();
        toast.success('Produit mis à jour avec succès');
      },
      onError: (error) => {
        setErrors(prev => ({ ...prev, error: error.response?.data?.message || 'Erreur lors de la mise à jour' }));
        toast.error('Erreur lors de la mise à jour');
      }
    }
  );

  const deleteMutation = useMutation(productService.deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Produit supprimé avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    }
  });

  const uploadImageMutation = useMutation(
    ({ id, file }) => productService.uploadImage(id, file),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products']);
        toast.success('Image téléchargée avec succès');
      },
      onError: () => {
        toast.error('Erreur lors du téléchargement de l\'image');
      }
    }
  );

  // Handle filters
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle dialog
  const handleOpenDialog = (item = null) => {
    setForm({
      name: item?.name || '',
      category: item?.category || '',
      location: item?.location || '',
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
    });
    
    setDialog({ open: true, item });
    setErrors({});
    setSelectedProduct(item);
    setImageFile(null);
  };

  const handleCloseDialog = () => {
    setDialog({ open: false, item: null });
    setSelectedProduct(null);
    setForm({
      name: '',
      category: '',
      location: '',
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
    });
    setErrors({});
    setImageFile(null);
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name required';
    if (!form.category) newErrors.category = 'Category required';
    if (!form.location) newErrors.location = 'Location required';
    if (!form.price) newErrors.price = 'Price required';
    if (!form.quantity) newErrors.quantity = 'Quantity required';
    if (!form.alertThreshold) newErrors.alertThreshold = 'Threshold required';

    if (form.isSeasonal) {
      if (!form.seasonStart) newErrors.seasonStart = 'Start date required';
      if (!form.seasonEnd) newErrors.seasonEnd = 'End date required';
      if (form.seasonStart && form.seasonEnd && form.seasonStart > form.seasonEnd) {
        newErrors.seasonEnd = 'End date must be after start date';
      }
    }

    if (form.hasPromotion) {
      if (!form.promotionValue) newErrors.promotionValue = 'Promotion value required';
      if (!form.promotionStart) newErrors.promotionStart = 'Start date required';
      if (!form.promotionEnd) newErrors.promotionEnd = 'End date required';
      if (form.promotionStart && form.promotionEnd && form.promotionStart > form.promotionEnd) {
        newErrors.promotionEnd = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const productData = {
        ...form,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
        alertThreshold: parseInt(form.alertThreshold)
      };

      if (selectedProduct) {
        await updateMutation.mutateAsync(productData);
      } else {
        const newProduct = await createMutation.mutateAsync(productData);
        if (imageFile) {
          await uploadImageMutation.mutateAsync({
            id: newProduct.id,
            file: imageFile
          });
        }
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error('Error deleting:', err);
      showNotification('Error deleting product', 'error');
    }
  };

  // Notifications
  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Utility functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF'
    }).format(parseFloat(price));
  };

  const getStockStatus = (quantity, alertThreshold) => {
    const qty = parseInt(quantity);
    const threshold = parseInt(alertThreshold);
    
    if (qty === 0) return { text: 'Out of stock', color: 'error' };
    if (qty <= threshold) return { text: 'Low stock', color: 'warning' };
    return { text: 'In stock', color: 'success' };
  };

  // Filter products
  const filteredProducts = Array.isArray(data.products) 
    ? data.products.filter(product => {
        const { seasonalOnly, promotionsOnly } = filters;
        
        if (seasonalOnly && !product.isSeasonal) return false;
        if (promotionsOnly && !product.hasPromotion) return false;
        
        return true;
      })
    : [];

  // Render content
  const renderContent = () => {
    if (data.loading && filteredProducts.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      );
    }

    if (data.error) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Loading error
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
            {data.error}
          </Typography>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Box>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No products found
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            disabled={data.loading}
          >
            Add product
          </Button>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '80px' }}>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Seasonal</TableCell>
              <TableCell>Promo</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>
                  <Avatar 
                    src={product.image} 
                    alt={product.name}
                    sx={{ width: 50, height: 50 }}
                    variant="rounded"
                  >
                    {!product.image && product.name.charAt(0)}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="medium">{product.name}</Typography>
                  {product.description && (
                    <Typography variant="body2" color="text.secondary">
                      {product.description.substring(0, 30)}...
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip label={product.category} size="small" />
                </TableCell>
                <TableCell>{product.location}</TableCell>
                <TableCell>
                  {product.hasPromotion ? (
                    <>
                      <Typography sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                        {formatPrice(product.price)}
                      </Typography>
                      <Typography color="secondary">
                        {formatPrice(product.price * (1 - (product.promotionType === 'percentage' ? product.promotionValue/100 : product.promotionValue)))}
                      </Typography>
                    </>
                  ) : (
                    formatPrice(product.price)
                  )}
                </TableCell>
                <TableCell align="right">
                  <Chip 
                    label={getStockStatus(product.quantity, product.alertThreshold).text}
                    color={getStockStatus(product.quantity, product.alertThreshold).color}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {product.isSeasonal ? (
                    <Tooltip title={`Seasonal: ${new Date(product.seasonStart).toLocaleDateString()} - ${new Date(product.seasonEnd).toLocaleDateString()}`}>
                      <EventIcon color="primary" />
                    </Tooltip>
                  ) : null}
                </TableCell>
                <TableCell>
                  {product.hasPromotion ? (
                    <Tooltip title={`Promotion: ${product.promotionValue}${product.promotionType === 'percentage' ? '%' : 'GNF'} (${new Date(product.promotionStart).toLocaleDateString()} - ${new Date(product.promotionEnd).toLocaleDateString()})`}>
                      <LocalOfferIcon color="secondary" />
                    </Tooltip>
                  ) : null}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit">
                      <IconButton 
                        onClick={() => handleOpenDialog(product)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        onClick={() => deleteProduct(product.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  if (isLoading) {
    return <Typography>Chargement...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Products Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ height: 'fit-content' }}
        >
          Add product
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={filters.seasonalOnly}
              onChange={(e) => handleFilterChange('seasonalOnly', e.target.checked)}
              color="primary"
            />
          }
          label="Seasonal"
        />

        <FormControlLabel
          control={
            <Switch
              checked={filters.promotionsOnly}
              onChange={(e) => handleFilterChange('promotionsOnly', e.target.checked)}
              color="secondary"
            />
          }
          label="Promotions"
        />
      </Box>

      {/* Content */}
      {renderContent()}

      {/* Edit/Add dialog */}
      <Dialog 
        open={dialog.open} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="md"
        PaperProps={{ component: 'form', onSubmit: handleSubmit }}
      >
        <DialogTitle>
          {selectedProduct ? 'Edit' : 'Add'} product
        </DialogTitle>
        <DialogContent dividers>
          {data.loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              {errors.error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.error}
                </Alert>
              )}
              <TextField
                fullWidth
                margin="normal"
                name="name"
                label="Name"
                value={form.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
              
              <TextField
                fullWidth
                margin="normal"
                name="category"
                label="Category"
                value={form.category}
                onChange={handleInputChange}
                error={!!errors.category}
                helperText={errors.category}
                required
              />

              <TextField
                fullWidth
                margin="normal"
                name="location"
                label="Location"
                value={form.location}
                onChange={handleInputChange}
                error={!!errors.location}
                helperText={errors.location}
                required
              />

              <TextField
                fullWidth
                margin="normal"
                name="price"
                label="Price (GNF)"
                type="number"
                value={form.price}
                onChange={handleInputChange}
                error={!!errors.price}
                helperText={errors.price}
                required
                inputProps={{ step: "0.01", min: "0.01" }}
              />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  margin="normal"
                  name="quantity"
                  label="Quantity"
                  type="number"
                  value={form.quantity}
                  onChange={handleInputChange}
                  error={!!errors.quantity}
                  helperText={errors.quantity}
                  required
                  inputProps={{ min: "0" }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  name="alertThreshold"
                  label="Alert threshold"
                  type="number"
                  value={form.alertThreshold}
                  onChange={handleInputChange}
                  error={!!errors.alertThreshold}
                  helperText={errors.alertThreshold}
                  required
                  inputProps={{ min: "0" }}
                />
              </Box>
              
              <TextField
                fullWidth
                margin="normal"
                name="description"
                label="Description"
                multiline
                rows={3}
                value={form.description}
                onChange={handleInputChange}
              />

              <Box sx={{ mt: 2 }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button variant="outlined" component="span" fullWidth>
                    Select image
                  </Button>
                </label>
                {form.image && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <img 
                      src={form.image} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }} 
                    />
                  </Box>
                )}
              </Box>

              {/* Seasonality section */}
              <Box sx={{ mt: 3, border: '1px solid #eee', borderRadius: 1, p: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isSeasonal"
                      checked={form.isSeasonal}
                      onChange={handleSwitchChange}
                      color="primary"
                    />
                  }
                  label="Seasonal product"
                />

                <Collapse in={form.isSeasonal}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <DatePicker
                        label="Season start"
                        value={form.seasonStart}
                        onChange={(date) => setForm(prev => ({ ...prev, seasonStart: date }))}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.seasonStart,
                            helperText: errors.seasonStart
                          }
                        }}
                      />
                      <DatePicker
                        label="Season end"
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
                  </LocalizationProvider>
                </Collapse>
              </Box>

              {/* Promotion section */}
              <Box sx={{ mt: 3, border: '1px solid #eee', borderRadius: 1, p: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="hasPromotion"
                      checked={form.hasPromotion}
                      onChange={handleSwitchChange}
                      color="secondary"
                    />
                  }
                  label="Promotion"
                />

                <Collapse in={form.hasPromotion}>
                  <Box sx={{ mt: 2 }}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Promotion type</FormLabel>
                      <RadioGroup
                        row
                        name="promotionType"
                        value={form.promotionType}
                        onChange={handleInputChange}
                      >
                        <FormControlLabel value="percentage" control={<Radio />} label="Percentage" />
                        <FormControlLabel value="fixed" control={<Radio />} label="Fixed amount" />
                      </RadioGroup>
                    </FormControl>

                    <TextField
                      fullWidth
                      margin="normal"
                      name="promotionValue"
                      label={`Promotion value (${form.promotionType === 'percentage' ? '%' : 'GNF'})`}
                      type="number"
                      value={form.promotionValue}
                      onChange={handleInputChange}
                      error={!!errors.promotionValue}
                      helperText={errors.promotionValue}
                      inputProps={{ 
                        min: "0",
                        max: form.promotionType === 'percentage' ? "100" : undefined
                      }}
                    />

                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <DatePicker
                          label="Promotion start"
                          value={form.promotionStart}
                          onChange={(date) => setForm(prev => ({ ...prev, promotionStart: date }))}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.promotionStart,
                              helperText: errors.promotionStart
                            }
                          }}
                        />
                        <DatePicker
                          label="Promotion end"
                          value={form.promotionEnd}
                          onChange={(date) => setForm(prev => ({ ...prev, promotionEnd: date }))}
                          minDate={form.promotionStart}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.promotionEnd,
                              helperText: errors.promotionEnd
                            }
                          }}
                        />
                      </Box>
                    </LocalizationProvider>
                  </Box>
                </Collapse>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={data.loading}>
            {data.loading ? <CircularProgress size={24} color="inherit" /> : selectedProduct ? 'Update' : 'Add'}
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
        <Alert onClose={closeNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductsManagement;