import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import Navbar from './components/Nav/Navbar';

function App() {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product, isAdding) => {
    if (isAdding) {
      // Añadir producto al carrito
      setCartItems(prevItems => [...prevItems, product]);
    } else {
      // Quitar una instancia del producto del carrito
      setCartItems(prevItems => {
        const index = prevItems.findIndex(item => item.id === product.id);
        if (index !== -1) {
          const newItems = [...prevItems];
          newItems.splice(index, 1);
          return newItems;
        }
        return prevItems;
      });
    }
  };

  return (
    <>
      <Navbar cartItemCount={cartItems.length} />
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              onAddToCart={handleAddToCart}
              cartItems={cartItems}
            />
          } 
        />
      </Routes>
    </>
  );
}

export default App;
