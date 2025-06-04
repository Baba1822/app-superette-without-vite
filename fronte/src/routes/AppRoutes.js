import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import CashierLayout from '../layouts/CashierLayout';
import ManagerLayout from '../layouts/ManagerLayout';
import StockistLayout from '../layouts/StockistLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Public pages
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import ProductList from '../pages/client/ProductList';
import ProductDetails from '../pages/client/ProductDetails';

// Customer pages
import Profile from '../pages/client/Profile';
import ClientOrders from '../pages/client/Orders';
import LoyaltyStatus from '../pages/client/LoyaltyStatus';
import Cart from '../pages/client/cart/Cart'
import Shop from '../pages/client/shop/Shop';

// Admin pages
import Dashboard from '../pages/admin/dashboard/Dashboard';
import OrdersManagement from '../pages/admin/orders/OrdersManagement';
import ProductsManagement from '../pages/admin/products/ProductsManagement';
import PaymentManagement from '../pages/admin/payments/PaymentManagement';
import Suppliers from '../pages/admin/suppliers/Suppliers';
import Customers from '../pages/admin/customers/Customers';
import Employees from '../pages/admin/employees/Employees';
import DeliveryManagement from '../pages/admin/delivery/DeliveryManagement';
import SalesManagement from '../pages/admin/sales/SalesManagement';
import Settings from '../pages/admin/settings/Settings';
import Loyalty from '../pages/admin/loyalty/Loyalty';
import Reports from '../pages/admin/reports/Reports';

// Finance (cashier)
import Sales from '../pages/finance/Sales';
import Expenses from '../pages/finance/Expenses';
import FinancialReports from '../pages/finance/Reports';

// Stockist
import InventoryReport from '../pages/inventory/InventoryReport';
import StockManagement from '../pages/inventory/StockManagement';
import StockMovement from '../pages/inventory/StockMovement';

// Offers
import Promotions from '../pages/offers/Promotions';
import Discounts from '../pages/offers/Discounts';
import SeasonalOffers from '../pages/offers/SeasonalOffers';

// NotFound page
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/produits-public" element={<ProductList />} />
                <Route path="/produit/:id" element={<ProductDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
                <Route path="/reinitialiser-mot-de-passe/:token" element={<ResetPassword />} />
            </Route>

            {/* Customer routes */}
            <Route element={<CustomerLayout />}>
                <Route path="/mon-profil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/mes-commandes" element={<ProtectedRoute><ClientOrders /></ProtectedRoute>} />
                <Route path="/fidelite" element={<ProtectedRoute><LoyaltyStatus /></ProtectedRoute>} />
                <Route path="/panier" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                {/* Route Shop pour les clients connectés */}
                <Route path="/Shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
                <Route path="/boutique" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
            </Route>

            {/* Admin routes */}
            <Route path="/administration" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="commandes" element={<OrdersManagement />} />
                <Route path="produits" element={<ProductsManagement />} />
                <Route path="paiements" element={<PaymentManagement />} />
                <Route path="fournisseurs" element={<Suppliers />} />
                <Route path="clients" element={<Customers />} />
                <Route path="employes" element={<Employees />} />
                <Route path="livraisons" element={<DeliveryManagement />} />
                <Route path="ventes" element={<SalesManagement />} />
                <Route path="parametres" element={<Settings />} />
                <Route path="fidelite" element={<Loyalty />} />
                <Route path="rapports" element={<Reports />} />
            </Route>

            {/* Cashier routes */}
            <Route path="/caisse" element={<ProtectedRoute role="cashier"><CashierLayout /></ProtectedRoute>}>
                <Route index element={<div>Caisse principale</div>} />
                <Route path="recus" element={<div>Gestion des reçus</div>} />
                <Route path="historique" element={<div>Historique des transactions</div>} />
            </Route>

            {/* Stockist routes */}
            <Route path="/inventaire" element={<ProtectedRoute role="stockist"><StockistLayout /></ProtectedRoute>}>
                <Route index element={<StockManagement />} />
                <Route path="rapports" element={<InventoryReport />} />
                <Route path="mouvements" element={<StockMovement />} />
            </Route>

            {/* Manager routes */}
            <Route path="/finances" element={<ProtectedRoute role="manager"><ManagerLayout /></ProtectedRoute>}>
                <Route path="ventes" element={<Sales />} />
                <Route path="depenses" element={<Expenses />} />
                <Route path="rapports" element={<FinancialReports />} />
            </Route>

            <Route path="/offres" element={<ProtectedRoute role="manager"><ManagerLayout /></ProtectedRoute>}>
                <Route path="promotions" element={<Promotions />} />
                <Route path="reductions" element={<Discounts />} />
                <Route path="saisonnieres" element={<SeasonalOffers />} />
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;