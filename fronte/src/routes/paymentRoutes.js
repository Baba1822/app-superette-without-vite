import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OrangeMoneyPayment from '../pages/client/payment/OrangeMoneyPayment';

const PaymentRoutes = () => {
  return (
    <Routes>
      <Route path="/orange-money/:paymentId" element={<OrangeMoneyPayment />} />
    </Routes>
  );
};

export default PaymentRoutes;
