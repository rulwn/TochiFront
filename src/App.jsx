// Importación de dependencias de React Router y React
import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';

// Importación de todas las pantallas (screens)
import Home from './screens/Home/Home';
import Cart from './screens/Cart/Cart';
import Products from './screens/Products/Products';
import About from './screens/About/About';
import Profile from './screens/Profile/Profile';
import TermsAndConditions from './screens/TermsConditions/TermsAndConditions';
import Orders from './screens/Orders/Orders';
import UserDetails from './screens/Userdetails/Userdetails';
import DeliveryAddress from './screens/Deliveryaddress/Deliveryaddress';
import PaymentMethods from './screens/Payment/Payment';
import Login from './screens/Login/Login';
import Registro from './screens/Registro/Registro';
import PutEmail from './screens/Forgot password/PutEmail';
import PutCode from './screens/Forgot password/PutCode';
import NewPassword from './screens/Forgot password/NewPassword';
import Checkout from './screens/Checkout/Checkout';
import DetailProduct from './screens/Details/DetailProduct';

// Importación de componentes comunes
import Navbar from './components/Nav/Navbar';
import Footer from './components/Footer/Footer';

function App() {
  // Estado para manejar los productos en el carrito
  const [cartItems, setCartItems] = useState([]);
  
  // Obtener la ruta actual para decidir si mostrar o no la navbar
  const location = useLocation();

  // Función para agregar o eliminar productos del carrito
  const handleUpdateCart = (product, shouldAdd) => {
    setCartItems(prevItems => {
      if (shouldAdd) {
        const existingIndex = prevItems.findIndex(item => item.id === product.id);
        if (existingIndex >= 0) {
          // Si el producto ya existe, actualiza su cantidad
          const updatedItems = [...prevItems];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            selectedQuantity: product.selectedQuantity || 1
          };
          return updatedItems;
        }
        // Si el producto no existe, lo agrega al carrito
        return [...prevItems, {
          ...product,
          selectedQuantity: product.selectedQuantity || 1
        }];
      }
      // Si shouldAdd es falso, elimina el producto del carrito
      return prevItems.filter(item => item.id !== product.id);
    });
  };

  // Rutas en las cuales no se debe mostrar el Navbar
  const hideNavbarRoutes = ['/login', '/registro', '/putemail', '/putcode', '/newpassword'];

  return (
    <>
      {/* Navbar condicional: se muestra solo si no estamos en una de las rutas ocultas */}
      {!hideNavbarRoutes.includes(location.pathname) && (
        <Navbar cartItemCount={cartItems.reduce((sum, item) => sum + (item.selectedQuantity || 1), 0)} />
      )}

      {/* Definición de las rutas de la aplicación */}
      <Routes>
        <Route path="/" element={<Home onAddToCart={handleUpdateCart} cartItems={cartItems} />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} onUpdateCart={handleUpdateCart} />} />
        <Route path="/explore" element={<Products onAddToCart={handleUpdateCart} cartItems={cartItems} />} />
        <Route path="/about" element={<About />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/termsAndConditions" element={<TermsAndConditions />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/userdetails" element={<UserDetails />} />
        <Route path="/deliveryaddress" element={<DeliveryAddress />} />
        <Route path="/payment" element={<PaymentMethods />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/putemail" element={<PutEmail />} />
        <Route path="/putcode" element={<PutCode />} />
        <Route path="/newpassword" element={<NewPassword />} />
        <Route path="/checkout" element={<Checkout />} />
        {/* Ruta dinámica para los detalles de un producto */}
        <Route path="/product/:id" element={<DetailProduct onAddToCart={handleUpdateCart} />} />
      </Routes>

      {/* Footer siempre visible */}
      <Footer />
    </>
  );
}

export default App;
