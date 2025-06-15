import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../../../services/orderService';

const OrangeMoneyPayment = ({ paymentId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { data: payment } = useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => orderService.getPaymentById(paymentId),
    retry: 2,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      console.error('Erreur lors de la récupération du paiement:', error);
      setError('Erreur lors de la récupération du paiement');
    }
  });

  const handlePayment = useMutation({
    mutationFn: async () => {
      const response = await orderService.processOrangeMoneyPayment({
        paymentId,
        phoneNumber
      });
      return response;
    },
    onSuccess: async (data) => {
      setSuccess(true);
      queryClient.invalidateQueries(['payment', paymentId]);
      setTimeout(() => {
        navigate('/order-confirmation');
      }, 3000);
    },
    onError: (error) => {
      setError('Erreur lors du traitement du paiement');
      setLoading(false);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    setLoading(true);
    handlePayment.mutate();
  };

  if (!payment) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', p: 4 }}>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ maxWidth: 400, mx: 'auto', p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom align="center">
            Paiement Orange Money
          </Typography>
          
          <Typography variant="body1" gutterBottom align="center">
            Montant à payer: {payment.amount} GNF
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Numéro Orange Money"
              variant="outlined"
              margin="normal"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              error={!!error}
              helperText={error}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading || !phoneNumber}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Payer'}
            </Button>
          </form>

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Paiement en cours de traitement. Vous serez redirigé vers la page de confirmation.
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default OrangeMoneyPayment;
