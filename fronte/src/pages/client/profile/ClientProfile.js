import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { useQuery, useMutation } from '@tanstack/react-query';
import { clientService } from '../../../services/clientService';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

function ClientProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });

  // Récupérer les informations du client
  const { data: profile, isLoading, error } = useQuery(
    ['clientProfile', user?.id],
    clientService.getCurrentClient,
    {
      enabled: !!user?.id
    }
  );

  // Récupérer l'historique des commandes
  const { data: orders = [] } = useQuery(
    ['clientOrders', user?.id],
    () => clientService.getClientOrders(user.id),
    {
      enabled: !!user?.id
    }
  );

  // Mutation pour mettre à jour le profil
  const updateProfileMutation = useMutation(
    (data) => clientService.updateProfile(data),
    {
      onSuccess: () => {
        setIsEditing(false);
        toast.success('Profil mis à jour avec succès');
      },
      onError: () => {
        toast.error('Erreur lors de la mise à jour du profil');
      }
    }
  );

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfileMutation.mutateAsync(formData);
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
        Erreur lors du chargement du profil: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Informations personnelles */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={profile?.avatar}
                sx={{ width: 100, height: 100, mr: 2 }}
              >
                {profile?.firstName?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h5">
                  {profile?.firstName} {profile?.lastName}
                </Typography>
                <Typography color="textSecondary">
                  Client depuis le {new Date(profile?.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Prénom"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nom"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      type="email"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Téléphone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Adresse"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      multiline
                      rows={3}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button onClick={() => setIsEditing(false)}>
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Enregistrer
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            ) : (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {profile?.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Téléphone
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {profile?.phone || 'Non renseigné'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Adresse
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {profile?.address || 'Non renseignée'}
                    </Typography>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Modifier le profil
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Statistiques et historique */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Statistiques
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Commandes totales"
                        secondary={orders.length}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Montant total des achats"
                        secondary={`${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)} €`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Statut du compte"
                        secondary={
                          <Chip
                            label={profile?.status === 'active' ? 'Actif' : 'Inactif'}
                            color={profile?.status === 'active' ? 'success' : 'error'}
                            size="small"
                          />
                        }
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Dernières commandes
                  </Typography>
                  {orders.length > 0 ? (
                    <List>
                      {orders.slice(0, 5).map((order) => (
                        <ListItem key={order.id}>
                          <ListItemText
                            primary={`Commande #${order.id}`}
                            secondary={`${order.total.toFixed(2)} € - ${new Date(order.createdAt).toLocaleDateString()}`}
                          />
                          <Chip
                            label={order.status}
                            color={
                              order.status === 'completed'
                                ? 'success'
                                : order.status === 'pending'
                                ? 'warning'
                                : 'default'
                            }
                            size="small"
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography color="textSecondary">
                      Aucune commande pour le moment
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ClientProfile;