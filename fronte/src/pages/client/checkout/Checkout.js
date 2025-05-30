import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Collapse
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import PaymentMethod from '../../../components/payment/PaymentMethod';
import ShippingForm from '../../../components/checkout/ShippingForm';
import OrderSummary from '../../../components/checkout/OrderSummary';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';

const steps = ['Récapitulatif', 'Livraison', 'Paiement', 'Confirmation'];

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shippingData, setShippingData] = useState({
    address: '',
    city: '',
    phone: ''
  });

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleNext = () => {
    setError(null);
    if (activeStep === steps.length - 1) {
      clearCart();
      navigate('/orders');
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    setActiveStep(activeStep - 1);
  };

  const handleShippingSubmit = (data) => {
    try {
      if (!data.address || !data.city || !data.phone) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }
      setShippingData(data);
      handleNext();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePaymentComplete = async (paymentResult) => {
    setLoading(true);
    setError(null);
    try {
      // Ici, vous pouvez ajouter la logique pour sauvegarder la commande
      handleNext();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Finalisation de la commande
        </Typography>

        {error && <ErrorMessage message={error} />}

        <Stepper activeStep={activeStep} sx={{ my: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
          {activeStep === 0 && (
            <OrderSummary 
              items={cartItems}
              total={total}
              onNext={handleNext}
            />
          )}

          {activeStep === 1 && (
            <ShippingForm
              initialData={shippingData}
              onSubmit={handleShippingSubmit}
              onBack={handleBack}
            />
          )}

          {activeStep === 2 && (
            <PaymentMethod
              amount={total}
              orderId={`ORD-${Date.now()}`}
              shippingData={shippingData}
              onPaymentComplete={handlePaymentComplete}
              onBack={handleBack}
            />
          )}

          {activeStep === 3 && (
            <Box textAlign="center">
              <Typography variant="h5" color="primary" gutterBottom>
                Commande confirmée !
              </Typography>
              <Typography variant="body1" paragraph>
                Votre commande a été passée avec succès. Un email de confirmation vous sera envoyé.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/orders')}
              >
                Voir mes commandes
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Checkout;