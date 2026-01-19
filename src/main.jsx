import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { AuthProvider } from './contexts/AuthContext.jsx'
import { CartProvider } from './contexts/CartContent.jsx'
import { WishlistProvider } from './contexts/WishlistContext.jsx';
import { OrdersProvider } from './contexts/OrdersContext.jsx';


createRoot(document.getElementById('root')).render(
  

  <BrowserRouter>
    <AuthProvider>
  <CartProvider>
    <WishlistProvider>
      <OrdersProvider>

    <App />

      </OrdersProvider>
    </WishlistProvider>
  </CartProvider>
    </AuthProvider>
  </BrowserRouter>

)
