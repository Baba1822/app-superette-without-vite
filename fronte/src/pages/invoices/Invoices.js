import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useState } from 'react';

// Mock data for demonstration
const initialInvoices = [
  {
    id: 'INV-2024-001',
    date: '2024-03-15',
    dueDate: '2024-04-15',
    customer: 'Mamadou Diallo',
    items: [
      { name: 'Riz local', quantity: 2, price: 50000 },
      { name: 'Huile végétale', quantity: 1, price: 15000 },
    ],
    subtotal: 115000,
    tax: 17250,
    total: 132250,
    status: 'Payée',
    paymentMethod: 'Espèces',
    notes: 'Facture pour achat en gros',
  },
  {
    id: 'INV-2024-002',
    date: '2024-03-15',
    dueDate: '2024-04-15',
    customer: 'Aissatou Bah',
    items: [
      { name: 'Sucre', quantity: 3, price: 10000 },
      { name: 'Café', quantity: 2, price: 20000 },
    ],
    subtotal: 70000,
    tax: 10500,
    total: 80500,
    status: 'En attente',
    paymentMethod: 'Mobile Money',
    notes: 'Facture régulière',
  },
];

function Invoices() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState('');

  // Calculate statistics
  const totalInvoices = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const pendingInvoices = invoices.filter(invoice => invoice.status === 'En attente');
  const totalPending = pendingInvoices.reduce((sum, invoice) => sum + invoice.total, 0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (invoice = null) => {
    setSelectedInvoice(invoice);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedInvoice(null);
  };

  const handleSaveInvoice = (invoice) => {
    if (invoice.id) {
      // Update existing invoice
      setInvoices(invoices.map(i => i.id === invoice.id ? invoice : i));
    } else {
      // Add new invoice
      const newInvoice = { ...invoice, id: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}` };
      setInvoices([...invoices, newInvoice]);
    }
    handleCloseDialog();
  };

  const handleDeleteInvoice = (id) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = (!startDate || invoice.date >= startDate) && 
                       (!endDate || invoice.date <= endDate);
    
    const matchesStatus = !status || invoice.status === status;

    return matchesSearch && matchesDate && matchesStatus;
  });

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting invoices data...');
  };

  const handlePrint = () => {
    // Implement print functionality
    window.print();
  };

  const handleViewInvoice = (invoice) => {
    // Implement view invoice functionality
    console.log('Viewing invoice:', invoice);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestion des factures</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nouvelle facture
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total des factures
              </Typography>
              <Typography variant="h5">
                {totalInvoices.toLocaleString()} GNF
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Factures en attente
              </Typography>
              <Typography variant="h5">
                {totalPending.toLocaleString()} GNF
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Nombre de factures
              </Typography>
              <Typography variant="h5">
                {invoices.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date de début"
                value={startDate}
                onChange={setStartDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date de fin"
                value={endDate}
                onChange={setEndDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Statut"
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="Payée">Payée</MenuItem>
                <MenuItem value="En attente">En attente</MenuItem>
                <MenuItem value="Annulée">Annulée</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
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
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Invoices Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>N° Facture</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Échéance</TableCell>
              <TableCell>Client</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell align="right">{invoice.total.toLocaleString()} GNF</TableCell>
                  <TableCell>
                    <Chip
                      label={invoice.status}
                      color={
                        invoice.status === 'Payée' ? 'success' :
                        invoice.status === 'En attente' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleViewInvoice(invoice)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDialog(invoice)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteInvoice(invoice.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredInvoices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <InvoiceDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveInvoice}
        invoice={selectedInvoice}
      />
    </Box>
  );
}

function InvoiceDialog({ open, onClose, onSave, invoice }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customer: '',
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    status: 'En attente',
    paymentMethod: 'Espèces',
    notes: '',
    ...invoice,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {invoice ? 'Modifier la facture' : 'Nouvelle facture'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date d'échéance"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Client"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Produits
              </Typography>
              {/* Product selection and quantity inputs would go here */}
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Sous-total"
                name="subtotal"
                type="number"
                value={formData.subtotal}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Taxe (15%)"
                name="tax"
                type="number"
                value={formData.tax}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Total"
                name="total"
                type="number"
                value={formData.total}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Méthode de paiement</InputLabel>
                <Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  label="Méthode de paiement"
                  required
                >
                  <MenuItem value="Espèces">Espèces</MenuItem>
                  <MenuItem value="Mobile Money">Mobile Money</MenuItem>
                  <MenuItem value="Carte bancaire">Carte bancaire</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Statut</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Statut"
                  required
                >
                  <MenuItem value="Payée">Payée</MenuItem>
                  <MenuItem value="En attente">En attente</MenuItem>
                  <MenuItem value="Annulée">Annulée</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained">
            {invoice ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default Invoices;