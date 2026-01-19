import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState([])


  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`)
      setCart(savedCart ? JSON.parse(savedCart) : [])
    } else {
      setCart([]) 
    }
  }, [user])

  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart))
    }
  }, [cart, user])

  const addToCart = (product, quantity) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)

      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...prev, { ...product, quantity }]
    })
  }

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const updateQuantity = (id, quantity) => {
    setCart(
      cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
