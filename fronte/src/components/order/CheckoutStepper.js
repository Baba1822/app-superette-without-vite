import React from 'react';
import { 
  Stepper,
  Step,
  StepLabel,
  Box
} from '@mui/material';

function CheckoutStepper({ activeStep, steps }) {
  return (
    <Box sx={{ width: '100%', my: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default CheckoutStepper;