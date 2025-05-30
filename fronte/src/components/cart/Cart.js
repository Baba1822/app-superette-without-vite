import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';
import { useQuery, useMutation } from '@tanstack/react-query';
import { orderService } from '../../services/orderService';
import { toast } from 'react-toastify';

const Cart = ({ cartItems, updateQuantity, removeFromCart, clearCart }) => {
  const [open, setOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [note, setNote] = useState('');

  // Calculer le total
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Mutation pour créer une commande
  const createOrderMutation = useMutation(orderService.createOrder, {
    onSuccess: () => {
      toast.success('Commande passée avec succès !');
      clearCart();
      setOpen(false);
    },
    onError: () => {
      toast.error('Erreur lors de la création de la commande');
    }
  });

  // Gérer la soumission de la commande
  const handleSubmitOrder = () => {
    if (!deliveryAddress || !phoneNumber) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const orderData = {
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      deliveryAddress,
      phoneNumber,
      note,
      total,
      status: 'pending'
    };

    createOrderMutation.mutate(orderData);
  };

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" py={3}>
            <CartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Votre panier est vide
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Votre Panier
          </Typography>
          <List>
            {cartItems.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Box
                      component="img"
                      src={item.image || 'https://via.placeholder.com/50'}
                      alt={item.name}
                      sx={{ width: 50, height: 50, mr: 2 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Prix: {item.price.toFixed(2)} GNF
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                    <IconButton onClick={() => removeFromCart(item.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Typography variant="h6">
              Total: {total.toFixed(2)} GNF
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
              sx={{ mt: 2 }}
            >
              Commander
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Finaliser la commande</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Adresse de livraison"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Numéro de téléphone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Note (optionnel)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              multiline
              rows={3}
              margin="normal"
            />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Récapitulatif de la commande:
            </Typography>
            <List>
              {cartItems.map((item) => (
                <ListItem key={item.id}>
                  <ListItemText
                    primary={item.name}
                    secondary={`${item.quantity} x ${item.price.toFixed(2)} GNF`}
                  />
                  <ListItemSecondaryAction>
                    <Typography>
                      {(item.price * item.quantity).toFixed(2)} GNF
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" align="right">
              Total: {total.toFixed(2)} GNF
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitOrder}
            disabled={createOrderMutation.isLoading}
          >
            {createOrderMutation.isLoading ? 'En cours...' : 'Confirmer la commande'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Cart; 