import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, TextField, Typography,
  Tooltip
} from '@mui/material';
import { Edit, Delete, Sms } from '@mui/icons-material';
import axios from 'axios';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formValues, setFormValues] = useState({ 
    nom: '', 
    telephone: '', 
    adresse: '', 
    email: '' 
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(response.data.data || response.data); // Adapté selon la structure de réponse
    } catch (error) {
      console.error("Erreur lors du chargement des fournisseurs:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Erreur lors du chargement des fournisseurs");
      alert(error.response?.data?.message || "Erreur lors du chargement des fournisseurs");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormValues({
        nom: supplier.nom,
        telephone: supplier.telephone,
        adresse: supplier.adresse,
        email: supplier.email
      });
    } else {
      setEditingSupplier(null);
      setFormValues({ 
        nom: '', 
        telephone: '', 
        adresse: '', 
        email: '' 
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formValues.nom || !formValues.telephone || !formValues.adresse) {
      alert('Nom, téléphone et adresse sont obligatoires');
      return;
    }

    try {
      if (editingSupplier) {
        await axios.put(
          `http://localhost:5000/api/suppliers/${editingSupplier.id}`,
          formValues
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/suppliers',
          formValues
        );
      }
      fetchSuppliers();
      handleCloseDialog();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!id) {
        throw new Error("ID du fournisseur manquant");
      }
      
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?")) {
        await axios.delete(`http://localhost:5000/api/suppliers/${id}`);
        fetchSuppliers();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const handleSendSMS = (supplier) => {
    alert(`Envoi des identifiants à ${supplier.nom} (${supplier.telephone})`);
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.nom.toLowerCase().includes(search.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading) return <Typography>Chargement...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Gestion des Fournisseurs</Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Rechercher un fournisseur"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          Ajouter un fournisseur
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSuppliers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((supplier) => (
              <TableRow 
                key={`supplier-${supplier.id}`}
                hover
              >
                <TableCell>{supplier.nom}</TableCell>
                <TableCell>{supplier.telephone}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.adresse}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Envoyer SMS">
                    <IconButton onClick={() => handleSendSMS(supplier)}>
                      <Sms />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Modifier">
                    <IconButton onClick={() => handleOpenDialog(supplier)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton onClick={() => handleDelete(supplier.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredSuppliers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingSupplier ? "Modifier un fournisseur" : "Ajouter un fournisseur"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nom"
            name="nom"
            value={formValues.nom}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Téléphone"
            name="telephone"
            value={formValues.telephone}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Adresse"
            name="adresse"
            value={formValues.adresse}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editingSupplier ? "Mettre à jour" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Suppliers;