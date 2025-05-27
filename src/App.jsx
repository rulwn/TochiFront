// Importación de dependencias de React Router y React
import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';

// Importación del AuthProvider y PrivateRoute
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

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

// Importación de componentes comunes
import Navbar from './components/Nav/Navbar';
import Footer from './components/Footer/Footer';
import NavAdmin from './components/Nav/NavAdmin';

// Componente AppContent separado para usar hooks dentro del AuthProvider
function AppContent() {
  // Estado para manejar los productos en el carrito
  const [cartItems, setCartItems] = useState([]);
  
  // Obtener la ruta actual para decidir qué componentes mostrar
  const location = useLocation();

  // Función para agregar o eliminar productos del carrito
  const handleUpdateCart = (product, shouldAdd) => {
    setCartItems(prevItems => {
      if (shouldAdd) {
        const existingIndex = prevItems.findIndex(item => item.id === product.id);
        if (existingIndex >= 0) {
          const updatedItems = [...prevItems];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            selectedQuantity: product.selectedQuantity || 1
          };
          return updatedItems;
        }
        return [...prevItems, {
          ...product,
          selectedQuantity: product.selectedQuantity || 1
        }];
      }
      return prevItems.filter(item => item.id !== product.id);
    });
  };

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
      {/* Navbar condicional */}
      {!hideNavbarRoutes.includes(location.pathname) && !isAdminRoute && (
        <Navbar cartItemCount={cartItems.reduce((sum, item) => sum + (item.selectedQuantity || 1), 0)} />
      )}
      
      {/* NavAdmin para rutas de administrador */}
      {isAdminRoute && <NavAdmin />}

      {/* Definición de las rutas de la aplicación */}
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home onAddToCart={handleUpdateCart} cartItems={cartItems} />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} onUpdateCart={handleUpdateCart} />} />
        <Route path="/explore" element={<Products onAddToCart={handleUpdateCart} cartItems={cartItems} />} />
        <Route path="/about" element={<About />} />
        
        {/* Rutas protegidas para usuarios autenticados */}
        <Route path="/account" element={<PrivateRoute />}>
          <Route index element={<Profile />} />
        </Route>
        <Route path="/orders" element={<PrivateRoute />}>
          <Route index element={<Orders />} />
        </Route>
        <Route path="/userdetails" element={<PrivateRoute />}>
          <Route index element={<UserDetails />} />
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
        <Route path="/product/:id" element={<DetailProduct onAddToCart={handleUpdateCart} />} />
        
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