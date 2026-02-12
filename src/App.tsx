
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './components/admin/AdminLayout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProductManagement from './pages/admin/ProductManagement';
import ServiceManagement from './pages/admin/ServiceManagement';
import UserLayout from './components/user/UserLayout';
import PackageManagement from './pages/admin/PackageManagement';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import ServicePage from './pages/ServicePage';
import PackagesPage from './pages/PackagesPage';
import PackageDetails from './pages/PackageDetails';
import ServiceDetails from './pages/ServiceDetails'; // Added import
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

import UserDashboard from './pages/UserDashboard';
import UserOrders from './pages/UserOrders';
import OrderManagement from './pages/admin/OrderManagement';
import ServiceRequests from './pages/admin/ServiceRequests';
import NotFound from './pages/NotFound';
import PujaEssentialsPage from './pages/PujaEssentialsPage';
import FlowersPage from './pages/FlowersPage';
import DecorationPage from './pages/DecorationPage';
import EventManagementPage from './pages/EventManagementPage';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" />
          <WhatsAppButton />
          <div className="flex flex-col min-h-screen">
            <Routes>
              {/* Public Routes with Navbar */}
              <Route path="/" element={<><Navbar /><div className="flex-grow"><Home /></div><Footer /></>} />
              <Route path="/shop" element={<><Navbar /><div className="flex-grow"><Shop /></div><Footer /></>} />
              <Route path="/products/:id" element={<><Navbar /><div className="flex-grow"><ProductDetails /></div><Footer /></>} />
              <Route path="/services" element={<><Navbar /><div className="flex-grow"><ServicePage /></div><Footer /></>} />
              <Route path="/packages" element={<><Navbar /><div className="flex-grow"><PackagesPage /></div><Footer /></>} />
              <Route path="/packages/:id" element={<><Navbar /><div className="flex-grow"><PackageDetails /></div><Footer /></>} />
              <Route path="/cart" element={<><Navbar /><div className="flex-grow"><CartPage /></div><Footer /></>} />
              <Route path="/checkout" element={<><Navbar /><div className="flex-grow"><CheckoutPage /></div><Footer /></>} />
              <Route path="/order-success" element={<><Navbar /><div className="flex-grow"><OrderSuccess /></div><Footer /></>} />

              {/* Category Pages */}
              <Route path="/puja-essentials" element={<><Navbar /><div className="flex-grow"><PujaEssentialsPage /></div><Footer /></>} />
              <Route path="/flowers" element={<><Navbar /><div className="flex-grow"><FlowersPage /></div><Footer /></>} />
              <Route path="/decoration" element={<><Navbar /><div className="flex-grow"><DecorationPage /></div><Footer /></>} />
              <Route path="/event-management" element={<><Navbar /><div className="flex-grow"><EventManagementPage /></div><Footer /></>} />
              <Route path="/services/:id" element={<><Navbar /><div className="flex-grow"><ServiceDetails /></div><Footer /></>} />
              <Route path="/orders" element={<><Navbar /><div className="flex-grow"><UserOrders /></div><Footer /></>} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<UserLayout />}>
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/dashboard/orders" element={<UserOrders />} />
                  {/* Add other user dashboard routes here */}
                </Route>
              </Route>

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin={true} />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<ProductManagement />} />
                  <Route path="services" element={<ServiceManagement />} />
                  <Route path="packages" element={<PackageManagement />} />
                  <Route path="orders" element={<OrderManagement />} />
                  <Route path="service-requests" element={<ServiceRequests />} />
                  {/* Add other admin routes here */}
                </Route>
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
