import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const OrdersContext = createContext()

export const OrdersProvider = ({ children }) => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])

 
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`orders_${user.email}`)
      setOrders(saved ? JSON.parse(saved) : [])
    } else {
      setOrders([])
    }
  }, [user])

 
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `orders_${user.email}`,
        JSON.stringify(orders)
      )
    }
  }, [orders, user])

  const addOrder = (order) => {
    setOrders(prev => [...prev, order])
  }

  const clearOrders = () => {
    setOrders([])
    if (user) localStorage.removeItem(`orders_${user.email}`)
  }

  return (
    <OrdersContext.Provider
      value={{ orders, addOrder, clearOrders }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => useContext(OrdersContext)
