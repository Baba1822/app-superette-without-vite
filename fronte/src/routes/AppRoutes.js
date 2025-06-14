import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import CashierLayout from '../layouts/CashierLayout';
import ManagerLayout from '../layouts/ManagerLayout';
import StockistLayout from '../layouts/StockistLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import { ProductProvider } from '../context/ProductContext';

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

            {/* Customer routes - Structure corrigée */}
            <Route element={<ProtectedRoute roles={['client']} />}>
                <Route element={<CustomerLayout />}>
                    <Route path="/mon-profil" element={<Profile />} />
                    <Route path="/mes-commandes" element={<ClientOrders />} />
                    <Route path="/fidelite" element={<LoyaltyStatus />} />
                    <Route path="/panier" element={<Cart />} />
                    <Route path="/Shop" element={<Shop />} />
                </Route>
            </Route>

            {/* Admin routes - Structure corrigée */}
            <Route element={<ProtectedRoute roles={['admin']} />}>
                <Route element={<AdminLayout />}>
                    <Route path="/administration" element={<Dashboard />} />
                    <Route path="/administration/commandes" element={<OrdersManagement />} />
                    <Route path="/administration/produits" element={<ProductsManagement />} />
                    <Route path="/administration/paiements" element={<PaymentManagement />} />
                    <Route path="/administration/fournisseurs" element={<Suppliers />} />
                    <Route path="/administration/clients" element={<Customers />} />
                    <Route path="/administration/employes" element={<Employees />} />
                    <Route path="/administration/livraisons" element={<DeliveryManagement />} />
                    <Route path="/administration/ventes" element={<SalesManagement />} />
                    <Route path="/administration/parametres" element={<Settings />} />
                    <Route path="/administration/fidelite" element={<Loyalty />} />
                    <Route path="/administration/rapports" element={<Reports />} />
                </Route>
            </Route>

            {/* Cashier routes - Structure corrigée */}
            <Route element={<ProtectedRoute roles={['cashier']} />}>
                <Route element={<CashierLayout />}>
                    <Route path="/caisse" element={<div>Caisse principale</div>} />
                    <Route path="/caisse/recus" element={<div>Gestion des reçus</div>} />
                    <Route path="/caisse/historique" element={<div>Historique des transactions</div>} />
                </Route>
            </Route>

            {/* Stockist routes - Structure corrigée */}
            <Route element={<ProtectedRoute roles={['stockist']} />}>
                <Route element={<StockistLayout />}>
                    <Route path="/inventaire" element={<StockManagement />} />
                    <Route path="/inventaire/rapports" element={<InventoryReport />} />
                    <Route path="/inventaire/mouvements" element={<StockMovement />} />
                </Route>
            </Route>

            {/* Manager routes - Structure corrigée */}
            <Route element={<ProtectedRoute roles={['manager']} />}>
                <Route element={<ManagerLayout />}>
                    <Route path="/finances" element={<Sales />} />
                    <Route path="/finances/ventes" element={<Sales />} />
                    <Route path="/finances/depenses" element={<Expenses />} />
                    <Route path="/finances/rapports" element={<FinancialReports />} />
                    <Route path="/offres/promotions" element={<Promotions />} />
                    <Route path="/offres/reductions" element={<Discounts />} />
                    <Route path="/offres/saisonnieres" element={<SeasonalOffers />} />
                </Route>
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;