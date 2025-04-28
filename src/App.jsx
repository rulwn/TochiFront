import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './screens/Home/Home';
import Cart from './screens/Cart/Cart';
import Products from './screens/Products/Products';
import About from './screens/About/About';
import Profile from './screens/Profile/Profile';
import TermsAndConditions from './screens/TermsConditions/TermsAndConditions';
import Navbar from './components/Nav/Navbar';
import Footer from './components/Footer/Footer';

function App() {
  const [cartItems, setCartItems] = useState([]);

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

  return (
    <>
      <Navbar cartItemCount={cartItems.reduce((sum, item) => sum + (item.selectedQuantity || 1), 0)} />
      <Routes>
        <Route path="/" element={<Home onAddToCart={handleUpdateCart} cartItems={cartItems} />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} onUpdateCart={handleUpdateCart} />} />
        <Route path="/explore" element={<Products onAddToCart={handleUpdateCart} cartItems={cartItems} />} />
        <Route path="/about" element={<About />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/termsAndConditions" element={<TermsAndConditions />} />
      </Routes>
      <Footer/>
      
    </>
  );
}

export default App;