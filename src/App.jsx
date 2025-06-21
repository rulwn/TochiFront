// Importación de dependencias de React Router y React
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast'; // Asegúrate de tener react-hot-toast instalado

// Importación del AuthProvider y PrivateRoute
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Importación del hook personalizado para verificar si existe admin
import useAdminData from './screens/private/FirstUse/hook/useAdminData';

// Importación del hook del carrito
import useCart from '../src/screens/public/Cart/hook/useCart';

// Importación de todas las pantallas (screens)
import Home from './screens/public/Home/Home';
import Cart from './screens/public/Cart/Cart';
import Products from './screens/public/Products/Products';
import About from './screens/public/About/About';
import Profile from './screens/public/Profile/Profile';
import TermsAndConditions from './screens/public/TermsConditions/TermsAndConditions';
import Orders from './screens/public/Orders/Orders';
import UserDetails from './screens/public/Userdetails/Userdetails';
import Deliveryaddress from './screens/public/Deliveryaddress/Deliveryaddress';
import PaymentMethods from './screens/public/Payment/Payment';
import Login from './screens/out/Login/Login';
import Registro from './screens/out/Registro/Registro';
import PutEmail from './screens/out/Forgot password/PutEmail';
import PutCode from './screens/out/Forgot password/PutCode';
import NewPassword from './screens/out/Forgot password/NewPassword';
import Checkout from './screens/public/Checkout/Checkout';
import DetailProduct from './screens/public/Details/DetailProduct';
import DashboardAdmin from './screens/private/AdminDashboard/AdminDashboard';
import AccountAdmin from './screens/private/AdminAccount/AdminAccount';
import AdminUsers from './screens/private/AdminUsers/AdminUsers';
import AdminProducts from './screens/private/AdminProducts/AdminProducts';
import AdminOrders from './screens/private/AdminOrders/AdminOrders';
import FirstUser from './screens/private/FirstUse/FirstUse';
import DetailsAdmin from './screens/private/AdminDetails/AdminDetails';
import TermsAndConditionsAdmin from './screens/private/TermsConditionsAdmin/TermsConditionsAdmin';
import CategoryPage from './screens/public/Categories/CategoryPage';

// Importación de componentes comunes
import Navbar from './components/Nav/Navbar';
import Footer from './components/Footer/Footer';
import NavAdmin from './components/Nav/NavAdmin';

// Importación del hook de autenticación
import { useAuth } from './context/AuthContext';

// Componente de loading
const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    fontFamily: 'Arial, sans-serif'
  }}>
    <div>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        Verificando configuración inicial...
      </div>
      <div style={{
        width: '50px',
        height: '50px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto'
      }}></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

// Componente FirstUser envuelto para manejar navegación
function FirstUserWithNavigation({ onAdminCreated }) {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useAuth();

  const handleAdminCreated = (adminData) => {
    // Llamar al callback del padre
    onAdminCreated();

    // Si se proporciona información del admin, establecer la sesión
    if (adminData) {
      // Establecer el estado del usuario como logueado
      setUser({
        email: adminData.email,
        role: 'administrador',
        id: adminData.id,
        ...adminData
      });
      setIsLoggedIn(true);
    }

    // Navegar al dashboard de admin
    navigate('/admin-dashboard');
  };

  return <FirstUser onAdminCreated={handleAdminCreated} />;
}

// Componente AppContent separado para usar hooks dentro del AuthProvider
function AppContent() {
  // Hook para verificar si existe un administrador
  const { adminExists, loading, error, recheckAdmin } = useAdminData();

  // Hook del carrito (reemplaza el estado local anterior)
  const {
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemsCount,
    isInCart,
    getProductQuantity
  } = useCart();

  // Obtener la ruta actual para decidir qué componentes mostrar
  const location = useLocation();

  // Función de compatibilidad para los componentes que aún usan la interfaz anterior
  const handleUpdateCart = (product, shouldAdd) => {
    if (shouldAdd) {
      addToCart(product);
    } else {
      removeFromCart(product.id);
    }
  };

  // Si está cargando, mostrar pantalla de loading
  if (loading) {
    return <LoadingScreen />;
  }

  // Si no existe admin (primer uso), mostrar solo el formulario de primer uso
  if (!adminExists) {
    return <FirstUserWithNavigation onAdminCreated={recheckAdmin} />;
  }

  // Rutas en las cuales no se debe mostrar el Navbar
  const hideNavbarRoutes = ['/login', '/registro', '/putemail', '/putcode', '/newpassword', '/firstuse'];

  // Rutas de administrador
  const adminRoutes = [
    '/admin-dashboard',
    '/admin-account',
    '/admin-orders',
    '/admin-products',
    '/admin-users',
    '/firstuse',
    '/detailsAdmin',
    '/termsAndConditionsAdmin',
  ];

  // Determinar si estamos en una ruta de admin
  const isAdminRoute = adminRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {/* Toast notifications para feedback del carrito */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Navbar condicional con contador de carrito actualizado */}
      {!hideNavbarRoutes.includes(location.pathname) && !isAdminRoute && (
        <Navbar cartItemCount={getCartItemsCount()} />
      )}

      {/* NavAdmin para rutas de administrador */}
      {isAdminRoute && <NavAdmin />}

      {/* Definición de las rutas de la aplicación */}
      <Routes>
        {/* Rutas públicas - Ya no necesitan props del carrito */}
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/explore" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path='/account' element={<Profile />} />
        <Route path='/userDetails' element={<UserDetails />} />


        {/* Rutas protegidas para usuarios autenticados */}
        <Route path="/orders" element={<PrivateRoute />}>
          <Route index element={<Orders />} />
        </Route>
        <Route path="/deliveryaddress" element={<PrivateRoute />}>
          <Route index element={<Deliveryaddress />} />
        </Route>
        <Route path="/payment" element={<PrivateRoute />}>
          <Route index element={<PaymentMethods />} />
        </Route>
        <Route path="/checkout" element={<PrivateRoute />}>
          <Route index element={<Checkout />} />
        </Route>

        {/* Rutas públicas de autenticación */}
        <Route path="/termsAndConditions" element={<TermsAndConditions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/putemail" element={<PutEmail />} />
        <Route path="/putcode" element={<PutCode />} />
        <Route path="/newpassword" element={<NewPassword />} />
        <Route path="/product/:id" element={<DetailProduct />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />

        {/* Rutas protegidas para administradores */}
        <Route path="/admin-dashboard" element={<PrivateRoute allowedRoles={['administrador']} />}>
          <Route index element={<DashboardAdmin />} />
        </Route>
        <Route path="/admin-account" element={<PrivateRoute allowedRoles={['administrador']} />}>
          <Route index element={<AccountAdmin />} />
        </Route>
        <Route path="/admin-orders" element={<PrivateRoute allowedRoles={['administrador']} />}>
          <Route index element={<AdminOrders />} />
        </Route>
        <Route path="/admin-products" element={<PrivateRoute allowedRoles={['administrador']} />}>
          <Route index element={<AdminProducts />} />
        </Route>
        <Route path="/admin-users" element={<PrivateRoute allowedRoles={['administrador']} />}>
          <Route index element={<AdminUsers />} />
        </Route>
        <Route path="/firstuse" element={<PrivateRoute allowedRoles={['administrador']} />}>
          <Route index element={<FirstUser />} />
        </Route>
        <Route path="/detailsAdmin" element={<PrivateRoute allowedRoles={['administrador']} />}>
          <Route index element={<DetailsAdmin />} />
        </Route>
        <Route path="/termsAndConditionsAdmin" element={<PrivateRoute allowedRoles={['administrador']} />}>
          <Route index element={<TermsAndConditionsAdmin />} />
        </Route>
      </Routes>

      {/* Footer solo para rutas no admin y no auth */}
      {!isAdminRoute && !hideNavbarRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}

// Componente principal App que envuelve todo con AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;