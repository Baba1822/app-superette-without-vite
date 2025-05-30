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
    nom_fournisseur: '', 
    telephone: '', 
    adresse: '', 
    email: '' 
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/fournisseurs');
      setSuppliers(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des fournisseurs", error);
      alert("Erreur lors du chargement des fournisseurs");
    }
  };

  const handleOpenDialog = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormValues({
        nom_fournisseur: supplier.nom_fournisseur,
        telephone: supplier.telephone,
        adresse: supplier.adresse,
        email: supplier.email
      });
    } else {
      setEditingSupplier(null);
      setFormValues({ 
        nom_fournisseur: '', 
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
    try {
      if (editingSupplier) {
        await axios.put(
          `http://localhost:5000/api/fournisseurs/${editingSupplier.id_fournisseur}`,
          formValues
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/fournisseurs',
          formValues
        );
      }
      fetchSuppliers();
      handleCloseDialog();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement", error);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id_fournisseur) => {
    try {
      if (!id_fournisseur) {
        throw new Error("ID du fournisseur manquant");
      }
      
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?")) {
        await axios.delete(`http://localhost:5000/api/fournisseurs/${id_fournisseur}`);
        fetchSuppliers();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
      alert(`Erreur lors de la suppression: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSendSMS = (supplier) => {
    alert(`Envoi des identifiants à ${supplier.nom_fournisseur} (${supplier.telephone})`);
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.nom_fournisseur.toLowerCase().includes(search.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
                key={`supplier-${supplier.id_fournisseur}`}
                hover
              >
                <TableCell>{supplier.nom_fournisseur}</TableCell>
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
                    <IconButton onClick={() => handleDelete(supplier.id_fournisseur)}>
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
            name="nom_fournisseur"
            value={formValues.nom_fournisseur}
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