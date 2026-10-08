import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import api from '../services/api'

const CartContext = createContext()

export const CartProvider = ({ children }) => {

  const { user } = useAuth()
  const [cart, setCart] = useState([])


  // =========================
  // GET CART FROM DJANGO
  // =========================

  const fetchCart = async () => {

    try {

      const res = await api.get('/cart/')

      setCart(
        res.data.map(item => ({
          ...item.product,
          quantity: item.quantity,
          cartItemId: item.id
        }))
      )

    } catch (error) {

      console.error('Error fetching cart:', error)

    }

  }


  useEffect(() => {

    if (user) {
      fetchCart()
    } else {
      setCart([])
    }

  }, [user])


  // =========================
  // ADD TO CART
  // =========================

  const addToCart = async (product, quantity) => {

    try {

      await api.post('/cart/add/', {
        product: product.id,
        quantity: quantity
      })

      await fetchCart()

    } catch (error) {

      console.error('Error adding to cart:', error)

    }

  }


  // =========================
  // REMOVE FROM CART
  // =========================

  const removeFromCart = async (id) => {

    try {

      const item = cart.find(item => item.id === id)

      if (!item) return

      await api.delete(`/cart/items/${item.cartItemId}/`)

      await fetchCart()

    } catch (error) {

      console.error('Error removing from cart:', error)

    }

  }


  // =========================
  // UPDATE QUANTITY
  // =========================

  const updateQuantity = async (id, quantity) => {

    try {

      const item = cart.find(item => item.id === id)

      if (!item) return

      await api.patch(
        `/cart/items/${item.cartItemId}/`,
        {
          quantity: quantity
        }
      )

      await fetchCart()

    } catch (error) {

      console.error('Error updating cart:', error)

    }

  }


  // =========================
  // CLEAR CART
  // =========================

  const clearCart = async () => {

    try {

      for (const item of cart) {

        await api.delete(
          `/cart/items/${item.cartItemId}/`
        )

      }

      setCart([])

    } catch (error) {

      console.error('Error clearing cart:', error)

    }

  }


  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  )

}

export const useCart = () => useContext(CartContext)