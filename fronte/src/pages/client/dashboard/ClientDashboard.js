import React from 'react';
import { 
  Grid,
  Container,
  Paper,
  Typography,
  Box,
  Button
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Receipt as OrdersIcon,
  LocalOffer as PromoIcon,
  AccountCircle as ProfileIcon
} from '@mui/icons-material';
import { useCart } from '../../../context/CartContext';
import { useOrders } from '../../../hooks/useOrders';

function ClientDashboard() {
  const { itemCount } = useCart();
  const { orders } = useOrders();
  
  const recentOrders = orders.slice(0, 3);
  const pendingOrders = orders.filter(o => o.status === 'En cours').length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de Bord
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <OrdersIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <div>
                <Typography variant="h6">Commandes en cours</Typography>
                <Typography variant="h4">{pendingOrders}</Typography>
              </div>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PromoIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
              <div>
                <Typography variant="h6">Promotions actives</Typography>
                <Typography variant="h4">3</Typography>
              </div>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingCartIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
              <div>
                <Typography variant="h6">Articles en panier</Typography>
                <Typography variant="h4">{itemCount}</Typography>
              </div>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Dernières Commandes
        </Typography>
        {recentOrders.length > 0 ? (
          <Grid container spacing={2}>
            {recentOrders.map(order => (
              <Grid item xs={12} key={order.id}>
                <Paper sx={{ p: 2 }}>
                  <Typography><strong>Commande #{order.id}</strong> - {order.date}</Typography>
                  <Typography>Montant: {order.total.toLocaleString()} GNF</Typography>
                  <Typography>Statut: {order.status}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>Aucune commande récente</Typography>
        )}
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }}
          onClick={() => console.log('Voir toutes les commandes')}
        >
          Voir toutes les commandes
        </Button>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Actions rapides
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Button 
              fullWidth 
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={() => console.log('Accéder au panier')}
            >
              Mon Panier
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button 
              fullWidth 
              variant="outlined"
              startIcon={<OrdersIcon />}
              onClick={() => console.log('Voir commandes')}
            >
              Mes Commandes
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button 
              fullWidth 
              variant="outlined"
              startIcon={<PromoIcon />}
              onClick={() => console.log('Voir promotions')}
            >
              Promotions
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button 
              fullWidth 
              variant="outlined"
              startIcon={<ProfileIcon />}
              onClick={() => console.log('Modifier profil')}
            >
              Mon Profil
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default ClientDashboard;