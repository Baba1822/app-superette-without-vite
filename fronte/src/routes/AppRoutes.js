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

// Finance (manager)
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

            {/* CORRECTION: Structure des routes protégées */}
            {/* Customer routes */}
            <Route path="/mon-profil" element={
                <ProtectedRoute roles={['client']}>
                    <CustomerLayout><Profile /></CustomerLayout>
                </ProtectedRoute>
            } />
            <Route path="/mes-commandes" element={
                <ProtectedRoute roles={['client']}>
                    <CustomerLayout><ClientOrders /></CustomerLayout>
                </ProtectedRoute>
            } />
            <Route path="/fidelite" element={
                <ProtectedRoute roles={['client']}>
                    <CustomerLayout><LoyaltyStatus /></CustomerLayout>
                </ProtectedRoute>
            } />
            <Route path="/panier" element={
                <ProtectedRoute roles={['client']}>
                    <CustomerLayout><Cart /></CustomerLayout>
                </ProtectedRoute>
            } />
            <Route path="/Shop" element={
                <ProtectedRoute roles={['client']}>
                    <CustomerLayout><Shop /></CustomerLayout>
                </ProtectedRoute>
            } />

            {/* Admin routes */}
            <Route path="/administration" element={
                <ProtectedRoute roles={['admin']}>
                    <AdminLayout><Dashboard /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/administration/commandes" element={
                <ProtectedRoute roles={['admin']}>
                    <AdminLayout><OrdersManagement /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/administration/produits" element={
                <ProtectedRoute roles={['admin']}>
                    <AdminLayout><ProductsManagement /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/administration/paiements" element={
                <ProtectedRoute roles={['admin']}>
                    <AdminLayout><PaymentManagement /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/administration/fournisseurs" element={
                <ProtectedRoute roles={['admin']}>
                    <AdminLayout><Suppliers /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/administration/clients" element={
                <ProtectedRoute roles={['admin']}>
                    <AdminLayout><Customers /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/administration/employes" element={
                <ProtectedRoute roles={['admin']}>
                    <AdminLayout><Employees /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/administration/livraisons" element={
                <ProtectedRoute roles={['admin']}>
                    <AdminLayout><DeliveryManagement /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/administration/ventes" element={
                <ProtectedRoute roles={['admin']}>
                    <AdminLayout><SalesManagement /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/administration/parametres" element={
                <ProtectedRoute roles={['admin']}>
                    <AdminLayout><Settings /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/administration/fidelite" element={
                <ProtectedRoute roles={['admin']}>
                    <AdminLayout><Loyalty /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/administration/rapports" element={
                <ProtectedRoute roles={['admin']}>
                    <AdminLayout><Reports /></AdminLayout>
                </ProtectedRoute>
            } />

            {/* Cashier routes */}
            <Route path="/caisse" element={
                <ProtectedRoute roles={['cashier']}>
                    <CashierLayout><div>Caisse principale</div></CashierLayout>
                </ProtectedRoute>
            } />
            <Route path="/caisse/recus" element={
                <ProtectedRoute roles={['cashier']}>
                    <CashierLayout><div>Gestion des reçus</div></CashierLayout>
                </ProtectedRoute>
            } />
            <Route path="/caisse/historique" element={
                <ProtectedRoute roles={['cashier']}>
                    <CashierLayout><div>Historique des transactions</div></CashierLayout>
                </ProtectedRoute>
            } />

            {/* Stockist routes */}
            <Route path="/inventaire" element={
                <ProtectedRoute roles={['stockist']}>
                    <StockistLayout><StockManagement /></StockistLayout>
                </ProtectedRoute>
            } />
            <Route path="/inventaire/rapports" element={
                <ProtectedRoute roles={['stockist']}>
                    <StockistLayout><InventoryReport /></StockistLayout>
                </ProtectedRoute>
            } />
            <Route path="/inventaire/mouvements" element={
                <ProtectedRoute roles={['stockist']}>
                    <StockistLayout><StockMovement /></StockistLayout>
                </ProtectedRoute>
            } />

            {/* Manager routes - CORRECTION: Chemins manquants */}
            <Route path="/finances" element={
                <ProtectedRoute roles={['manager']}>
                    <ManagerLayout><Sales /></ManagerLayout>
                </ProtectedRoute>
            } />
            <Route path="/finances/ventes" element={
                <ProtectedRoute roles={['manager']}>
                    <ManagerLayout><Sales /></ManagerLayout>
                </ProtectedRoute>
            } />
            <Route path="/finances/depenses" element={
                <ProtectedRoute roles={['manager']}>
                    <ManagerLayout><Expenses /></ManagerLayout>
                </ProtectedRoute>
            } />
            <Route path="/finances/rapports" element={
                <ProtectedRoute roles={['manager']}>
                    <ManagerLayout><FinancialReports /></ManagerLayout>
                </ProtectedRoute>
            } />
            <Route path="/offres/promotions" element={
                <ProtectedRoute roles={['manager']}>
                    <ManagerLayout><Promotions /></ManagerLayout>
                </ProtectedRoute>
            } />
            <Route path="/offres/reductions" element={
                <ProtectedRoute roles={['manager']}>
                    <ManagerLayout><Discounts /></ManagerLayout>
                </ProtectedRoute>
            } />
            <Route path="/offres/saisonnieres" element={
                <ProtectedRoute roles={['manager']}>
                    <ManagerLayout><SeasonalOffers /></ManagerLayout>
                </ProtectedRoute>
            } />

            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;