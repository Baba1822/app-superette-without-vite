import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from 'src/context/CartContext';
import { orderService } from 'src/services/orderService';
import { DeliveryService } from 'src/services/DeliveryService';
import paymentService from 'src/services/PaymentService';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    deliveryZone: '',
    paymentMethod: 'orange_money',
    installmentPlan: false,
    installmentCount: 2,
    phoneNumber: ''
  });

  const deliveryZones = [
    { id: 'kaloum', name: 'Kaloum', price: 5000 },
    { id: 'ratoma', name: 'Ratoma', price: 7000 },
    { id: 'matoto', name: 'Matoto', price: 6000 },
    { id: 'dixinn', name: 'Dixinn', price: 6500 },
    { id: 'matam', name: 'Matam', price: 8000 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    if (!cart) return 0;
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = deliveryZones.find(zone => zone.id === formData.deliveryZone)?.price || 0;
    return subtotal + deliveryFee;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Créer la commande
      // Get client ID from localStorage
      const clientId = localStorage.getItem('clientId');
      if (!clientId) {
        throw new Error('Client ID not found. Please login first.');
      }

      const orderData = {
        clientId: parseInt(clientId),
        items: cart ? cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })) : [],
        totalAmount: calculateTotal(),
        deliveryAddress: formData.deliveryAddress,
        deliveryZone: formData.deliveryZone,
        paymentMethod: formData.paymentMethod,
        phoneNumber: formData.phoneNumber,
        installmentPlan: formData.installmentPlan,
        installmentCount: formData.installmentCount
      };

      const order = await orderService.createOrder(orderData);

      // Créer la livraison
      const delivery = await DeliveryService.createDelivery({
        orderId: order.id,
        address: formData.deliveryAddress,
        zone: formData.deliveryZone,
        status: 'pending'
      });

      // Traiter le paiement
      let paymentResult;
      if (formData.paymentMethod === 'orange_money') {
        paymentResult = await paymentService.processMobileMoneyPayment({
          orderId: order.id,
          amount: calculateTotal(),
          phoneNumber: formData.phoneNumber
        });
      } else {
        // Logique pour d'autres méthodes de paiement
      }

      // Redirection vers OrdersManagement pour l'admin
      navigate('/admin/orders');

      // Nettoyer le panier
      clearCart();

      setSuccess('Commande créée avec succès !');
    } catch (error) {
      setError(error.message || 'Une erreur est survenue lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Passer la commande
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Adresse de livraison"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Zone de livraison</InputLabel>
              <Select
                name="deliveryZone"
                value={formData.deliveryZone}
                onChange={handleInputChange}
                required
              >
                {deliveryZones.map(zone => (
                  <MenuItem key={zone.id} value={zone.id}>
                    {zone.name} (Frais: {zone.price} GNF)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Méthode de paiement</InputLabel>
              <Select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="orange_money">Orange Money</MenuItem>
                <MenuItem value="card">Carte bancaire</MenuItem>
                <MenuItem value="bank_transfer">Virement bancaire</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {formData.paymentMethod === 'orange_money' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Numéro de téléphone"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="installmentPlan"
                value={formData.installmentPlan}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="Paiement fractionné"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="Paiement unique"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {formData.installmentPlan && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Nombre de mensualités</InputLabel>
                <Select
                  name="installmentCount"
                  value={formData.installmentCount}
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value={2}>2 mensualités</MenuItem>
                  <MenuItem value={3}>3 mensualités</MenuItem>
                  <MenuItem value={4}>4 mensualités</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Récapitulatif</Typography>
                <Typography>
                  Sous-total: {calculateTotal() - deliveryZones.find(zone => zone.id === formData.deliveryZone)?.price} GNF
                </Typography>
                <Typography>
                  Frais de livraison: {deliveryZones.find(zone => zone.id === formData.deliveryZone)?.price} GNF
                </Typography>
                <Typography>
                  Total: {calculateTotal()} GNF
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={24} /> : null}
            >
              Passer la commande
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Checkout;
