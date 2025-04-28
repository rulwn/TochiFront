import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Home from './screens/Home/Home';
import Cart from './screens/Cart/Cart';
import Products from './screens/Products/Products';
import About from './screens/About/About';
import Profile from './screens/Profile/Profile';
import TermsAndConditions from './screens/TermsConditions/TermsAndConditions';
import Navbar from './components/Nav/Navbar';
import Footer from './components/Footer/Footer';
import Login from './screens/Login/Login';
import Registro from './screens/Registro/Registro';
import PutEmail from './screens/Forgot password/PutEmail';
import PutCode from './screens/Forgot password/PutCode';
function App() {
  const [cartItems, setCartItems] = useState([]);
  const location = useLocation(); // Obtener la ruta actual

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

  const hideNavbarRoutes = ['/login', '/registro', '/putemail', '/putcode'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && (
        <Navbar cartItemCount={cartItems.reduce((sum, item) => sum + (item.selectedQuantity || 1), 0)} />
      )}

      <Routes>
        <Route path="/" element={<Home onAddToCart={handleUpdateCart} cartItems={cartItems} />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} onUpdateCart={handleUpdateCart} />} />
        <Route path="/explore" element={<Products onAddToCart={handleUpdateCart} cartItems={cartItems} />} />
        <Route path="/about" element={<About />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/termsAndConditions" element={<TermsAndConditions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/putemail" element={<PutEmail />} />
        <Route path="/putcode" element={<PutCode />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
