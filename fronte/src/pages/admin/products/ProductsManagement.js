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
  InputLabel,
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { productService } from '../../../services/productService';
import frLocale from 'date-fns/locale/fr';

const CATEGORIES = [
  { id: 1, nom: 'Boissons' },
  { id: 2, nom: 'Produits Laitiers' },
  { id: 3, nom: 'Fruits et Légumes' },
  { id: 4, nom: 'Viandes et Poissons' },
  { id: 5, nom: 'Pains et Pâtisseries' },
  { id: 6, nom: 'Produits de Base' },
  { id: 7, nom: 'Conserves' },
  { id: 8, nom: 'Surgelés' },
  { id: 9, nom: 'Produits d\'Entretien' },
  { id: 10, nom: 'Hygiène et Beauté' },
  { id: 11, nom: 'Biscuits et Confiseries' },
  { id: 12, nom: 'Café et Thé' },
  { id: 13, nom: 'Epicerie Sucrée' },
  { id: 14, nom: 'Epicerie Salée' },
  { id: 15, nom: 'Produits Importés' },
  { id: 16, nom: 'Produits Locaux' },
  { id: 17, nom: 'Aliments pour Bébés' },
  { id: 18, nom: 'Articles de Cuisine' },
  { id: 19, nom: 'Aliments pour Animaux' },
  { id: 20, nom: 'Autres' }
];

const ProductsManagement = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    seasonalOnly: false,
    promotionsOnly: false,
    categoryFilter: ''
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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Récupération des produits
  const { 
    data: products = [], 
    isLoading, 
    error: queryError 
  } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getAllProducts({
      seasonalOnly: filters.seasonalOnly,
      promotionsOnly: filters.promotionsOnly,
      categoryId: filters.categoryFilter
    }),
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      toast.error(`Erreur de chargement: ${error.message}`);
    }
  });


  // Mutation pour la création
  const createMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: (data) => {
      if (imageFile) {
        productService.uploadImage(data.id, imageFile)
          .then(() => {
            queryClient.invalidateQueries(['products']);
            toast.success('Produit créé avec image');
          })
          .catch(uploadError => {
            console.error('Erreur upload:', uploadError);
            toast.warning('Produit créé mais erreur lors de l\'upload de l\'image');
          });
      } else {
        queryClient.invalidateQueries(['products']);
      }
      handleCloseDialog();
      toast.success('Produit créé avec succès');
    },
    onError: (error) => {
      toast.error(error.message || 'Erreur lors de la création');
    }
  });
  // Mutation pour la mise à jour
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => productService.updateProduct(id, data),
    onSuccess: (data, variables) => {
      if (imageFile) {
        productService.uploadImage(variables.id, imageFile)
          .then(() => {
            queryClient.invalidateQueries(['products']);
            toast.success('Produit et image mis à jour');
          })
          .catch(uploadError => {
            console.error('Erreur upload:', uploadError);
            toast.warning('Produit mis à jour mais erreur lors de l\'upload de l\'image');
          });
      } else {
        queryClient.invalidateQueries(['products']);
      }
      handleCloseDialog();
      toast.success('Produit mis à jour avec succès');
    },
    onError: (error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    }
  });

  // Mutation pour la suppression
  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(['products']);
      toast.success(`Produit #${id} supprimé`);
    },
    onError: (error, id) => {
      console.error('Delete error:', error);
      const message = error.status === 404 
        ? 'Produit déjà supprimé' 
        : error.message || 'Erreur lors de la suppression';
      toast.error(message);
      
      if (error.status === 404) {
        queryClient.invalidateQueries(['products']);
      }
    }
  });

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(0);
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
    let productId;
    
    if (!selectedProduct) {
      // Create new product
      const createdProduct = await createMutation.mutateAsync(productData);
      productId = createdProduct.id;
    } else {
      // Update existing product
      await updateMutation.mutateAsync({ id: selectedProduct.id, ...productData });
      productId = selectedProduct.id;
    }

    // Upload image if there is one
    if (imageFile) {
      try {
        await productService.uploadImage(productId, imageFile);
        queryClient.invalidateQueries(['products']);
        toast.success('Image téléchargée avec succès');
      } catch (uploadError) {
        console.error('Erreur upload:', uploadError);
        toast.warning('Produit sauvegardé mais erreur lors de l\'upload de l\'image');
      }
    }

    handleCloseDialog();
    toast.success(`Produit ${selectedProduct ? 'mis à jour' : 'créé'} avec succès`);
  } catch (error) {
    console.error('Error submitting form:', error);
    toast.error(error.message || 'Une erreur est survenue');
  }
};
 const deleteProduct = async (id) => {
  if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit #${id} ?`)) {
    try {
      await productService.deleteProduct(id);
      toast.success(`Produit #${id} supprimé avec succès`);
      queryClient.invalidateQueries(['products']);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      
      let errorMessage = error.message || 'Erreur lors de la suppression';
      
      if (error.status === 500) {
        errorMessage = 'Erreur serveur - veuillez réessayer plus tard';
      } else if (error.status === 404) {
        errorMessage = 'Produit non trouvé';
      } else if (error.message.includes('contrainte') || error.message.includes('référencé')) {
        errorMessage = 'Impossible de supprimer - produit utilisé dans des commandes';
      }

      toast.error(errorMessage);
      
      // Si le produit n'existe plus, on actualise la liste
      if (error.status === 404) {
        queryClient.invalidateQueries(['products']);
      }
    }
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
      if (filters.categoryFilter && product.categorie_id !== parseInt(filters.categoryFilter)) return false;
      return true;
    });
  };

  const filteredProducts = getFilteredProducts();

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Gestion des Produits</Typography>
            <Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Nouveau Produit
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.seasonalOnly}
                      onChange={(e) => handleFilterChange('seasonalOnly', e.target.checked)}
                    />
                  }
                  label="Saisonniers seulement"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.promotionsOnly}
                      onChange={(e) => handleFilterChange('promotionsOnly', e.target.checked)}
                    />
                  }
                  label="Promotions seulement"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Filtrer par catégorie</InputLabel>
                  <Select
                    value={filters.categoryFilter}
                    onChange={(e) => handleFilterChange('categoryFilter', e.target.value)}
                    label="Filtrer par catégorie"
                  >
                    <MenuItem value="">Toutes les catégories</MenuItem>
                    {CATEGORIES.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
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
                      <TableCell colSpan={6} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : queryError ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="error">Erreur de chargement</Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography>Aucun produit trouvé</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts
                      .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                      .map((product) => {
                        const category = CATEGORIES.find(c => c.id === product.categorie_id);
                        return (
                          <TableRow key={product.id}>
                            <TableCell>
                              {product.image ? (
                                <Avatar 
                                  src={product.image} 
                                  alt={product.nom} 
                                  sx={{ width: 56, height: 56 }}
                                  variant="rounded"
                                />
                              ) : (
                                <Avatar 
                                  sx={{ width: 56, height: 56 }}
                                  variant="rounded"
                                >
                                  <ImageIcon />
                                </Avatar>
                              )}
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight="bold">{product.nom}</Typography>
                              {product.promotion && (
                                <Chip 
                                  label="PROMO" 
                                  color="error" 
                                  size="small" 
                                  sx={{ ml: 1 }}
                                />
                              )}
                              {product.saison && (
                                <Chip 
                                  label="SAISON" 
                                  color="success" 
                                  size="small" 
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </TableCell>
                            <TableCell>{category?.nom || 'Non catégorisé'}</TableCell>
                            <TableCell>
                              {product.promotion ? (
                                <>
                                  <Typography 
                                    sx={{ textDecoration: 'line-through', color: 'text.disabled' }}
                                  >
                                    {formatPrice(product.prix)}
                                  </Typography>
                                  <Typography color="error" fontWeight="bold">
                                    {formatPrice(
                                      product.type_promotion === 'percentage'
                                        ? product.prix * (1 - product.valeur_promotion / 100)
                                        : product.prix - product.valeur_promotion
                                    )}
                                  </Typography>
                                </>
                              ) : (
                                formatPrice(product.prix)
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={`${product.stock} unités`}
                                color={getStockStatus(product.stock, product.stock_min)}
                              />
                              {product.stock <= product.stock_min && (
                                <Typography variant="caption" color="error" display="block">
                                  Stock faible!
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <ButtonGroup size="small">
                                <Tooltip title="Modifier">
                                  <IconButton
                                    color="primary"
                                    onClick={() => handleOpenDialog(product)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Supprimer">
                                  <IconButton
                                    color="error"
                                    onClick={() => deleteProduct(product.id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </ButtonGroup>
                            </TableCell>
                          </TableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredProducts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </Paper>
        </Grid>

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
          <Dialog
            open={dialog.open}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
            scroll="paper"
          >
            <form onSubmit={handleSubmit}>
              <DialogTitle>
                {dialog.item ? 'Modifier Produit' : 'Nouveau Produit'}
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={3} sx={{ pt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nom du produit"
                      name="nom"
                      value={form.nom}
                      onChange={handleInputChange}
                      error={!!errors.nom}
                      helperText={errors.nom}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.categorie_id}>
                      <InputLabel>Catégorie *</InputLabel>
                      <Select
                        label="Catégorie *"
                        name="categorie_id"
                        value={form.categorie_id}
                        onChange={handleInputChange}
                        required
                      >
                        {CATEGORIES.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.nom}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.categorie_id && (
                        <Typography variant="caption" color="error">
                          {errors.categorie_id}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Prix (GNF)"
                      name="prix"
                      value={form.prix}
                      onChange={handleInputChange}
                      type="number"
                      error={!!errors.prix}
                      helperText={errors.prix}
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start">GNF</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Quantité en stock"
                      name="stock"
                      value={form.stock}
                      onChange={handleInputChange}
                      type="number"
                      error={!!errors.stock}
                      helperText={errors.stock}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Stock minimum d'alerte"
                      name="stock_min"
                      value={form.stock_min}
                      onChange={handleInputChange}
                      type="number"
                      error={!!errors.stock_min}
                      helperText={errors.stock_min}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      multiline
                      rows={3}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.saison}
                          onChange={handleSwitchChange}
                          name="saison"
                          color="primary"
                        />
                      }
                      label="Produit saisonnier"
                    />
                  </Grid>

                  {form.saison && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="Date début saison"
                          value={form.date_debut_saison}
                          onChange={(date) =>
                            setForm(prev => ({ ...prev, date_debut_saison: date }))
                          }
                          format="dd/MM/yyyy"
                          slotProps={{
                            textField: {
                              error: !!errors.date_debut_saison,
                              helperText: errors.date_debut_saison,
                              fullWidth: true,
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="Date fin saison"
                          value={form.date_fin_saison}
                          onChange={(date) =>
                            setForm(prev => ({ ...prev, date_fin_saison: date }))
                          }
                          format="dd/MM/yyyy"
                          slotProps={{
                            textField: {
                              error: !!errors.date_fin_saison,
                              helperText: errors.date_fin_saison,
                              fullWidth: true,
                            },
                          }}
                        />
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.promotion}
                          onChange={handleSwitchChange}
                          name="promotion"
                          color="primary"
                        />
                      }
                      label="Promotion"
                    />
                  </Grid>

                  {form.promotion && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Type de promotion</FormLabel>
                          <RadioGroup
                            row
                            name="type_promotion"
                            value={form.type_promotion}
                            onChange={handleInputChange}
                          >
                            <FormControlLabel
                              value="percentage"
                              control={<Radio />}
                              label="Pourcentage"
                            />
                            <FormControlLabel
                              value="fixed"
                              control={<Radio />}
                              label="Montant fixe"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={
                            form.type_promotion === 'percentage' 
                              ? 'Pourcentage de réduction' 
                              : 'Montant de réduction'
                          }
                          name="valeur_promotion"
                          value={form.valeur_promotion}
                          onChange={handleInputChange}
                          type="number"
                          error={!!errors.valeur_promotion}
                          helperText={errors.valeur_promotion}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                {form.type_promotion === 'percentage' ? '%' : 'GNF'}
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="Date début promotion"
                          value={form.date_debut_promo}
                          onChange={(date) =>
                            setForm(prev => ({ ...prev, date_debut_promo: date }))
                          }
                          format="dd/MM/yyyy"
                          slotProps={{
                            textField: {
                              error: !!errors.date_debut_promo,
                              helperText: errors.date_debut_promo,
                              fullWidth: true,
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="Date fin promotion"
                          value={form.date_fin_promo}
                          onChange={(date) =>
                            setForm(prev => ({ ...prev, date_fin_promo: date }))
                          }
                          format="dd/MM/yyyy"
                          slotProps={{
                            textField: {
                              error: !!errors.date_fin_promo,
                              helperText: errors.date_fin_promo,
                              fullWidth: true,
                            },
                          }}
                        />
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Date de péremption (si applicable)"
                      value={form.date_peremption}
                      onChange={(date) =>
                        setForm(prev => ({ ...prev, date_peremption: date }))
                      }
                      format="dd/MM/yyyy"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Button
                        variant="contained"
                        component="label"
                        startIcon={<ImageIcon />}
                      >
                        Choisir une image
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </Button>
                      {form.image && (
                        <Avatar 
                          src={form.image} 
                          alt="Preview" 
                          sx={{ width: 56, height: 56 }}
                          variant="rounded"
                        />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Annuler</Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                >
                  {dialog.item ? 'Modifier' : 'Ajouter'}
                  {(createMutation.isLoading || updateMutation.isLoading) && (
                    <CircularProgress size={24} sx={{ ml: 1 }} />
                  )}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </LocalizationProvider>
      </Grid>
    </Box>
  );
};

export default ProductsManagement;