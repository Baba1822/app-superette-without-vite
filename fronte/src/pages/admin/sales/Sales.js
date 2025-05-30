import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

const initialSales = [
  {
    id: '1',
    date: '2024-03-15',
    customer: 'Mamadou Diallo',
    items: [
      { name: 'Riz local', quantity: 2, price: 50000 },
      { name: 'Huile végétale', quantity: 1, price: 15000 },
    ],
    total: 115000,
    paymentMethod: 'Espèces',
    status: 'Complété',
  },
];

const products = [
  { id: '1', name: 'Riz local', price: 50000 },
  { id: '2', name: 'Huile végétale', price: 15000 },
  { id: '3', name: 'Sucre', price: 10000 },
  { id: '4', name: 'Café', price: 20000 },
];

function Sales() {
  const [sales, setSales] = useState(initialSales);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const handleOpenDialog = (sale = null) => {
    setSelectedSale(sale);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedSale(null);
    setOpenDialog(false);
  };

  const handleSaveSale = (sale) => {
    if (sale.id) {
      setSales(sales.map((s) => (s.id === sale.id ? sale : s)));
    } else {
      const newSale = { ...sale, id: Date.now().toString() };
      setSales([...sales, newSale]);
    }
    handleCloseDialog();
  };

  const handleDeleteSale = (id) => {
    setSales(sales.filter((s) => s.id !== id));
  };

  const handleExport = () => {
    console.log('Exporting...');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Gestion des Ventes</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mr: 2 }}
            onClick={() => handleOpenDialog()}
          >
            Nouvelle Vente
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{ mr: 2 }}
            onClick={handleExport}
          >
            Exporter
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Imprimer
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Produits</TableCell>
              <TableCell align="right">Montant</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.date}</TableCell>
                <TableCell>{sale.customer}</TableCell>
                <TableCell>
                  {sale.items.map((item, i) => (
                    <div key={i}>
                      {item.name} × {item.quantity}
                    </div>
                  ))}
                </TableCell>
                <TableCell align="right">{sale.total.toLocaleString()} GNF</TableCell>
                <TableCell>{sale.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(sale)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteSale(sale.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <SaleDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveSale}
        sale={selectedSale}
      />
    </Box>
  );
}

function SaleDialog({ open, onClose, onSave, sale }) {
  const [formData, setFormData] = useState(() => ({
    id: sale?.id || '',
    date: sale?.date || new Date().toISOString().split('T')[0],
    customer: sale?.customer || '',
    items: sale?.items || [],
    paymentMethod: sale?.paymentMethod || 'Espèces',
    status: sale?.status || 'Complété',
    total: sale?.total || 0,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, price: 0 }],
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    if (field === 'name') {
      const product = products.find((p) => p.name === value);
      updatedItems[index] = {
        name: value,
        quantity: 1,
        price: product?.price || 0,
      };
    } else {
      updatedItems[index][field] = Number(value);
    }

    const total = updatedItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      total,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{sale ? 'Modifier la vente' : 'Nouvelle vente'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                name="date"
                type="date"
                fullWidth
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Client"
                name="customer"
                fullWidth
                value={formData.customer}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Produits
              </Typography>
              {formData.items.map((item, index) => (
                <Grid container spacing={1} key={index} sx={{ mb: 1 }}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Produit</InputLabel>
                      <Select
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(index, 'name', e.target.value)
                        }
                        label="Produit"
                      >
                        {products.map((p) => (
                          <MenuItem key={p.id} value={p.name}>
                            {p.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Quantité"
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, 'quantity', e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Prix unitaire"
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(index, 'price', e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
              ))}
              <Button onClick={handleAddItem}>+ Ajouter un produit</Button>
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Total"
                name="total"
                fullWidth
                value={formData.total}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Méthode de paiement</InputLabel>
                <Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  label="Méthode de paiement"
                >
                  <MenuItem value="Espèces">Espèces</MenuItem>
                  <MenuItem value="Mobile Money">Mobile Money</MenuItem>
                  <MenuItem value="Carte bancaire">Carte bancaire</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default Sales;
