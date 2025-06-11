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

  const initialFormState = {
    nom: '',
    categorie_id: '',
    prix: '',
    stock: '',
    description: '',
    stock_min: '5',
    image: '',
    saison: false,
    date_debut_saison: null,
    date_fin_saison: null,
    promotion: false,
    type_promotion: 'percentage',
    valeur_promotion: '',
    date_debut_promo: null,
    date_fin_promo: null,
    date_peremption: null,
  };

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Load initial data
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAllProducts
  });

  // Mutations for CRUD operations
  const createMutation = useMutation({
    mutationFn: (productData) => productService.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      handleCloseDialog();
      toast.success('Produit ajouté avec succès');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout du produit');
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
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Produit supprimé avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    }
  });

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setForm({
        nom: item.nom || '',
        categorie_id: item.categorie_id || '',
        prix: item.prix?.toString() || '',
        stock: item.stock?.toString() || '',
        description: item.description || '',
        stock_min: item.stock_min?.toString() || '5',
        image: item.image || '',
        saison: item.saison || false,
        date_debut_saison: item.date_debut_saison ? new Date(item.date_debut_saison) : null,
        date_fin_saison: item.date_fin_saison ? new Date(item.date_fin_saison) : null,
        promotion: item.promotion || false,
        type_promotion: item.type_promotion || 'percentage',
        valeur_promotion: item.valeur_promotion?.toString() || '',
        date_debut_promo: item.date_debut_promo ? new Date(item.date_debut_promo) : null,
        date_fin_promo: item.date_fin_promo ? new Date(item.date_fin_promo) : null,
        date_peremption: item.date_peremption ? new Date(item.date_peremption) : null,
      });
      setSelectedProduct(item);
    } else {
      setForm(initialFormState);
      setSelectedProduct(null);
    }
    setDialog({ open: true, item });
    setErrors({});
    setImageFile(null);
  };

  const handleCloseDialog = () => {
    setDialog({ open: false, item: null });
    setForm(initialFormState);
    setSelectedProduct(null);
    setImageFile(null);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setForm(prev => ({ ...prev, image: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!form.categorie_id) newErrors.categorie_id = 'La catégorie est requise';
    if (!form.prix || isNaN(form.prix)) newErrors.prix = 'Prix invalide';
    if (!form.stock || isNaN(form.stock)) newErrors.stock = 'Stock invalide';
    if (!form.stock_min || isNaN(form.stock_min)) newErrors.stock_min = 'Seuil d\'alerte invalide';
    
    if (form.saison) {
      if (!form.date_debut_saison) newErrors.date_debut_saison = 'Date de début requise';
      if (!form.date_fin_saison) newErrors.date_fin_saison = 'Date de fin requise';
      if (form.date_debut_saison && form.date_fin_saison && form.date_debut_saison > form.date_fin_saison) {
        newErrors.date_fin_saison = 'La date de fin doit être après la date de début';
      }
    }

    if (form.promotion) {
      if (!form.valeur_promotion || isNaN(form.valeur_promotion)) {
        newErrors.valeur_promotion = 'Valeur de promotion invalide';
      }
      if (!form.date_debut_promo) newErrors.date_debut_promo = 'Date de début requise';
      if (!form.date_fin_promo) newErrors.date_fin_promo = 'Date de fin requise';
      if (form.date_debut_promo && form.date_fin_promo && form.date_debut_promo > form.date_fin_promo) {
        newErrors.date_fin_promo = 'La date de fin doit être après la date de début';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const productData = {
      ...form,
      prix: parseFloat(form.prix),
      stock: parseInt(form.stock),
      stock_min: parseInt(form.stock_min),
      valeur_promotion: form.promotion ? parseFloat(form.valeur_promotion) : null,
      date_debut_saison: form.saison ? form.date_debut_saison : null,
      date_fin_saison: form.saison ? form.date_fin_saison : null,
      date_debut_promo: form.promotion ? form.date_debut_promo : null,
      date_fin_promo: form.promotion ? form.date_fin_promo : null,
      date_peremption: form.date_peremption,
    };

    try {
      if (selectedProduct) {
        await updateMutation.mutateAsync(productData);
      } else {
        await createMutation.mutateAsync(productData);
      }

      if (imageFile) {
        await productService.uploadImage(selectedProduct ? selectedProduct.id : createMutation.data.id, imageFile);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const deleteProduct = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteMutation.mutate(id);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF'
    }).format(price);
  };

  const getStockStatus = (quantity, alertThreshold) => {
    if (quantity <= 0) return 'error';
    if (quantity <= alertThreshold) return 'warning';
    return 'success';
  };

  const getFilteredProducts = () => {
    if (!Array.isArray(products)) return [];
    return products.filter(product => {
      if (filters.seasonalOnly && !product.saison) return false;
      if (filters.promotionsOnly && !product.promotion) return false;
      return true;
    });
  };

  const renderFormContent = () => (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {/* Informations de base */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Informations de base</Typography>
          
          <TextField
            fullWidth
            label="Nom du produit"
            name="nom"
            value={form.nom}
            onChange={handleInputChange}
            error={!!errors.nom}
            helperText={errors.nom}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Catégorie"
            name="categorie_id"
            value={form.categorie_id}
            onChange={handleInputChange}
            error={!!errors.categorie_id}
            helperText={errors.categorie_id}
            margin="normal"
            required
            select
          >
            <MenuItem value="1">Fruits et Légumes</MenuItem>
            <MenuItem value="2">Produits Laitiers</MenuItem>
            <MenuItem value="3">Viandes</MenuItem>
            <MenuItem value="4">Boissons</MenuItem>
          </TextField>
          
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={form.description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={3}
          />
        </Grid>

        {/* Prix et Stock */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Prix et Stock</Typography>
          
          <TextField
            fullWidth
            label="Prix (€)"
            name="prix"
            type="number"
            value={form.prix}
            onChange={handleInputChange}
            error={!!errors.prix}
            helperText={errors.prix}
            margin="normal"
            required
            InputProps={{
              inputProps: { min: 0, step: 0.01 }
            }}
          />
          
          <TextField
            fullWidth
            label="Stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleInputChange}
            error={!!errors.stock}
            helperText={errors.stock}
            margin="normal"
            required
            InputProps={{
              inputProps: { min: 0 }
            }}
          />
          
          <TextField
            fullWidth
            label="Seuil d'alerte"
            name="stock_min"
            type="number"
            value={form.stock_min}
            onChange={handleInputChange}
            error={!!errors.stock_min}
            helperText={errors.stock_min}
            margin="normal"
            required
            InputProps={{
              inputProps: { min: 0 }
            }}
          />
          
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
            <DatePicker
              label="Date de péremption"
              value={form.date_peremption}
              onChange={(date) => setForm(prev => ({ ...prev, date_peremption: date }))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        {/* Image */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Image</Typography>
          <input
            accept="image/*"
            type="file"
            onChange={handleImageChange}
            id="product-image-upload"
            hidden
          />
          <label htmlFor="product-image-upload">
            <Button variant="contained" component="span" startIcon={<ImageIcon />}>
              Uploader une image
            </Button>
          </label>
          {form.image && (
            <Box mt={2}>
              <img 
                src={form.image} 
                alt="Preview" 
                style={{ maxWidth: '200px', maxHeight: '200px' }} 
              />
            </Box>
          )}
        </Grid>

        {/* Saisonnalité */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                name="saison"
                checked={form.saison}
                onChange={handleSwitchChange}
                color="primary"
              />
            }
            label="Produit saisonnier"
          />
          
          <Collapse in={form.saison}>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
                <DatePicker
                  label="Début de saison"
                  value={form.date_debut_saison}
                  onChange={(date) => setForm(prev => ({ ...prev, date_debut_saison: date }))}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.date_debut_saison}
                      helperText={errors.date_debut_saison}
                    />
                  )}
                />
                <DatePicker
                  label="Fin de saison"
                  value={form.date_fin_saison}
                  onChange={(date) => setForm(prev => ({ ...prev, date_fin_saison: date }))}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.date_fin_saison}
                      helperText={errors.date_fin_saison}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
          </Collapse>
        </Grid>

        {/* Promotion */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                name="promotion"
                checked={form.promotion}
                onChange={handleSwitchChange}
                color="primary"
              />
            }
            label="Promotion"
          />
          
          <Collapse in={form.promotion}>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Type de promotion"
                    name="type_promotion"
                    value={form.type_promotion}
                    onChange={handleInputChange}
                    error={!!errors.type_promotion}
                    helperText={errors.type_promotion}
                  >
                    <MenuItem value="percentage">Pourcentage</MenuItem>
                    <MenuItem value="fixed">Montant fixe</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`Valeur (${form.type_promotion === 'percentage' ? '%' : '€'})`}
                    name="valeur_promotion"
                    type="number"
                    value={form.valeur_promotion}
                    onChange={handleInputChange}
                    error={!!errors.valeur_promotion}
                    helperText={errors.valeur_promotion}
                    InputProps={{
                      inputProps: { 
                        min: 0,
                        max: form.type_promotion === 'percentage' ? 100 : undefined
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
                    <DatePicker
                      label="Début de promotion"
                      value={form.date_debut_promo}
                      onChange={(date) => setForm(prev => ({ ...prev, date_debut_promo: date }))}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!errors.date_debut_promo}
                          helperText={errors.date_debut_promo}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
                    <DatePicker
                      label="Fin de promotion"
                      value={form.date_fin_promo}
                      onChange={(date) => setForm(prev => ({ ...prev, date_fin_promo: date }))}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!errors.date_fin_promo}
                          helperText={errors.date_fin_promo}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Gestion des Produits</Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Ajouter un produit
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={filters.seasonalOnly}
                  onChange={(e) => handleFilterChange('seasonalOnly', e.target.checked)}
                />
              }
              label="Saisonniers seulement"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={filters.promotionsOnly}
                  onChange={(e) => handleFilterChange('promotionsOnly', e.target.checked)}
                />
              }
              label="Promotions seulement"
            />
          </Box>
        </Box>

        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="error">Erreur de chargement</Typography>
                    </TableCell>
                  </TableRow>
                ) : getFilteredProducts().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography>Aucun produit trouvé</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  getFilteredProducts()
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.nom}</TableCell>
                        <TableCell>{product.categorie_id}</TableCell>
                        <TableCell>{formatPrice(product.prix)}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${product.stock} unités`}
                            color={getStockStatus(product.stock, product.stock_min)}
                          />
                        </TableCell>
                        <TableCell>
                          <ButtonGroup>
                            <Button
                              startIcon={<EditIcon />}
                              onClick={() => handleOpenDialog(product)}
                            >
                              Modifier
                            </Button>
                            <Button
                              startIcon={<DeleteIcon />}
                              color="error"
                              onClick={() => deleteProduct(product.id)}
                            >
                              Supprimer
                            </Button>
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={getFilteredProducts().length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Paper>

        {/* Dialog pour ajouter/modifier un produit */}
        <Dialog
          open={dialog.open}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
          </DialogTitle>
          <DialogContent>
            {renderFormContent()}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {selectedProduct ? 'Mettre à jour' : 'Créer'}
              {(createMutation.isLoading || updateMutation.isLoading) && (
                <CircularProgress size={24} sx={{ ml: 1 }} />
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default ProductsManagement;