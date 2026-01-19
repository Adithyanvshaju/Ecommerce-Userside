import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import ProtectedRoute from './components/ProtectedRoute'
import Wishlist from './pages/WishList'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'



function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Register' element={<Register/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path="/product/:id" element={<ProductDetails />} />
         <Route path="/cart" element={ <ProtectedRoute><Cart /></ProtectedRoute>}/>
        <Route path='/Products' element={<Products/>}/>
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />


      <Route/>
      </Routes>
      
    </div>
  )
}

export default App